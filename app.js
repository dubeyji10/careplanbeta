const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios'); // Import Axios for making API calls


// Axios instance with custom validateStatus function
// Axios instance with response interceptor
// const axiosInstance = axios.create();

// // Response interceptor to handle 401 status code
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Handle 401 status code here
//       return Promise.resolve({ data: { message: 'Sorry, you are not authenticated.' } });
//     }
//     return Promise.reject(error);
//   }
// );


const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(__dirname, 'public'));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// Route to display "Hello, World!" as HTML
app.get('/', (req, res) => {
    console.log('at root route');
    res.send('<h1>Hello, World!</h1>');
});

// Route to send current server time as JSON
app.get('/api/time', (req, res) => {
    console.log('api/time');
    const currentTime = new Date();
    res.json({ message: `Current Server Time is ${currentTime}` });
});


// Define a route to render an HTML page
app.get('/hello', (req, res) => {
    console.log('hello');

    res.render('hello', { message: 'Hello, World!' });
});

// request care-plan-with-request-parameters

// Render the form with input fields if the patient identifier is present
app.get('/user-form', (req, res) => {
    console.log('>1 : show user their info form ');
    // Retrieve the patient identifier from the query parameters
    const patientIdentifier = req.query.patient_identifier;
    console.log(' -- 1 - user requested : ', patientIdentifier);

    // Check if the patient identifier is present
    if (!patientIdentifier) {
        res.send('Sorry, request not valid. Please provide a patient identifier.');
    } else {
        // Render the login page and pass the patient identifier to the view
        res.render('carePlanRequest', { patientIdentifier });
    }
});

// Handle the login form submission submit-form ---- authenticate-user


// to handle form submission for authencating user patient info page at url /user-info?patient_identifier=abcdedfgh----
app.post('/authenticate-user', async (req, res) => {
    // console.log(`user request body from the submitted form : ${req.body}`);
    // console.log(`name : request body from the submitted form : ${req.body.patient_first_name}`);
    // console.log(`name : request body from the submitted form : ${req.body.patient_last_name}`);
    // console.log(`dob : request body from the submitted form : ${req.body.patient_dob}`);
    // console.log(`token : request body from the submitted form : ${req.body.patient_token}`);
    // console.log(`identifier : request body from the submitted form : ${req.body.patientIdentifier}`);
    // // on or undefined
    // console.log(`>>> identifier : request body from the submitted form : ${req.body.acceptTerms}`);


    // const patientIdentifier = `${req.body.patientIdentifier}`;
    try {
        var isValid;
        var patientInfo;
        const {
            patient_first_name,
            patient_last_name,
            patient_dob,
            patient_token,
            patientIdentifier,
            acceptTerms,
        } = req.body;
        console.log('->> user has accepted terms ?- remove this later terms and condition are pushed to next page',acceptTerms);

        const payloadForReq = {
            'patient_first_name': patient_first_name,
            'patient_last_name': patient_last_name,
            'patient_dob': patient_dob,
            'patient_token': patient_token
        };

        // send a json dump
        console.log('->>>>> payload : ',payloadForReq);

        // Make an API call using Axios (replace 'API_URL' with your actual API endpoint)
        const urlForReq = `https://naomedicalservice.pythonanywhere.com/validate_credentials_for_patient/${patientIdentifier}`;

        const apiResponse = await axios.post(urlForReq, payloadForReq);
        const statusCode = apiResponse.status;
        console.log('<><><><><> -- API Response Status Code -- <><><><><>:', statusCode);

        // Check the status code of the API response

        // Log the status code
        // console.log('-> API RESPONSE RECIEVED : \n',apiResponse);

        if (statusCode >= 200 && statusCode < 300) {
            console.log('->> user authenticated');
            console.log('-> API RESPONSE DATA RECIEVED : \n',apiResponse.data);
            patientInfo = apiResponse.data;
            // send this patientInfo in req.session to next terms and condition page

            // Check if the API response indicates a valid authentication
            isValid = true;
            
        }
        // Adjust this based on your API response structure

        if (isValid) {
            // send patientInfo to page redirect and also add patientInfo dict items as form input type hidden
            // console.log('-= Redirecting user to path:');
            // console.log(`/accept-terms?patient_identifier=${patientIdentifier}`);

            // res.redirect(`/accept-terms?patient_identifier=${patientIdentifier}`);

            console.log('-- send user the terms and condition page -- not a redirect but send with variables --');
            // res.status(200).send('acceptTerms',{patientIdentifier , patientInfo});
            // this doesn't send user to a url just delivers the acceptTerms page to user with their authenticated info
            // which can be further used as form input


            // Redirect to the accept-terms page and pass patientInfo as a local variable
            res.render('accept-terms', { patientIdentifier, patientInfo });


        } else {
            res.send('<h1>- SORRY NOT AUTHORIZED -</h1>');
        }
    } catch (error) {

        const patientIdentifier = req.body.patientIdentifier;

        console.error('Error making API call:', error);
        // it also catching 403 response as an error --- just send sorry could not authenticate your details

        console.log('------------------------------------------');
        // console.log('->> error.response : ',error.response);
        // res.status(500).send('<html>Sorry Could Not Authenticate Your Deatils</h1></html>');

        tryAgainUrl = `/user-form?patient_identifier=${patientIdentifier}`;
        console.log('-- return to page : ',tryAgainUrl);


        res.render('loginFailed',{ tryAgainUrl })
    }


});

/// --------------------- commented part ---- accept-terms override because of path -----------------------------------
/// render terms and condtion form page if valid and has query params
// Render the terms and conditions form if the patient_identifier is present
// app.get('/accept-terms', (req, res) => {
//     // Retrieve the patient identifier from the query parameters

//     const patient_identifier = req.query.patient_identifier;
//     console.log('->> authenticated user patientIdentifier : ', patient_identifier, " -- shown terms and condtion page ");
//     // Check if the patient identifier is present
//     if (!patient_identifier) {
//         res.send('Sorry, request not valid. Please provide a patient identifier.');
//     } else {
//         console.log(patient_identifier, '-- please accept terms and condition ');
//         // Render the terms and conditions form and pass the patient identifier to the view
//         res.render('acceptTerms', { patient_identifier });
//     }
// });

/// --------------------- commented part ---- accept-terms override because of path -----------------------------------



// final submit -- after terms and condition check
app.post('/submit-terms', async (req, res) => {

    console.log('-- user has accepted terms at ',new Date());
    console.log('->> terms form data :',req.body);
    
    try{
        const dataReceived=JSON.stringify(req.body);
        const carePlanPayload = req.body;
        const urlForReq = `https://naomedicalservice.pythonanywhere.com/fetch-my-care-plan`;
        console.log(` making request to ${urlForReq} with request paylaod : \n ${dataReceived}`);

        // use json object not json string dump
        const apiResponse = await axios.post(urlForReq, carePlanPayload);
        const statusCode = apiResponse.status;
        console.log('<><><><><> -- API Response Status Code -- <><><><><>:', statusCode);
    
    
        // dataReceived as payload for fetch-my-care-plan
    
        // console.log('---- user authorized -- redirect user to their care plan ----');
        // res.send(`<html><h1> your care plan will be generated -- template redirect add here ---- with api call (use v2 not v1) </h1><br><br>${dataReceived}<br><br>care plan returned : <br> ${JSON.stringify(apiResponse.data)} </html>`);
    
        console.log('-- rendering care plan for patient on the template page ---');
        res.render('carePlanPage', { dataReceived:JSON.stringify(dataReceived), apiResponse:JSON.stringify(apiResponse.data) });
        
    }catch(error){
        console.log('-- some error occurred ---');
        console.log(error);

        res.send('<html><h1> Sorry Server Crashed While Generating Your Request Please Try Again Later</h1></html>');
    }
});






app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

