
## route 1

### in url use with underscore patient_identifier
#### -> carePlanRequest page with request parameters -- for each patient identifier 

try later

```css
.w-form-label
{
    display: inline-block;
    cursor: pointer;
    font-weight: normal;
    margin-bottom: 0px;
    margin-top: 4px;
    margin-left: 10px;
}
```


# note

## request to fetch my care plan with unique patient mongo id and patient acct no generated will also include userDeviceInfo

## so that we can track user agent and location info when care plan is requested ---
### terms form data ( form of terms and condition ) : 
```json
{
  patient_identifier: '658d842f88260c6f617e0501',
  deviceInfo: '{
    "latitude":27.160523701122067 , "longitude":77.99804 , "userAgent":Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0
    }',
  patient_acct_no: '106156',
  checkbox: 'on',
  'checkbox-5': 'on',
  'checkbox-4': 'on',
  'checkbox-3': 'on',
  'checkbox-2': 'on',
  'checkbox-1': 'on',
  field: 'Berry Delia'
}

```

#### checkbox-1 -> I understand that I will be asked to provide feedback to improve our product.
#### checkbox-2 -> I understand that this care plan will only be accessible 1 time as part of this beta program.
#### checkbox-3 -> I understand that this is not medical advice and should not be considered as such.
#### checkbox-4 -> I understand that I am voluntarily choosing to be part of this program and was not asked or influenced by anyone.
#### checkbox-5 -> I understand I am releasing all liability from Nao Medical for this program.
#### checkbox(0) -> I Understand this is a Beta Technology Program and may contain inaccurate information.


### after terms are accepted -- method should trigger a route which makes api call to fetch-my-care plan with above req body

### and render care plan on the care plan page
