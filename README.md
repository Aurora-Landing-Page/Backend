# Steps to Run
- Make dotenv file:
```
JWT_SECRET=<JWT secret string for encoding>
URI=<MongoDB signin URI>
EMAIL=<Credentials for sending out mail>
EMAIL_PASSWORD=<Credentials for sending out mail>
```
- npm install
- npm start

# API Endpoints
## /register
- For registering new users.
- Request must be encoded in the body as raw JSON in the following format:
```
{
    "name": <String>,
    "email": <String>,
    "phone": <Number>,
    "gender": <String>,
    "college": <String>,
    "city": <String>,
    "dob": <ISO Date>,
    "password": <String>,
    "referralCode": <String> (optional)
}
```
- If the referralCode is specified and valid, a minUserObj will be added to the referrals array of the corresponding CA
- Responds with 400 if the request is malformed

## /mail
- For sending out mail to newly signed up users
- Request must be encoded in the body as raw JSON in the following format:
```
{
    "name": <String>,
    "email": <String>
}
```
- An email will then be sent to the email provided in req body

## /ca
- For creating new Campus Ambassador accounts
- Request must be encoded in the body as raw JSON in the following format:
```
{
    "name": <String>,
    "email": <String>,
    "phone": <Number>,
    "gender": <String>,
    "college": <String>,
    "city": <String>,
    "dob": <ISO Date>,
    "password": <String>
}
```
- If a new CA is created in the database, a response of the following format is sent:
```
{
    "message": "CA saved successfully",
    "CA": {
        "name": <String>,
        "email": <String>,
        "phone": <Number>,
        "gender": <String>,
        "college": <String>,
        "city": <String>,
        "dob": <ISO Date>,
        "referralCode": <String>
    }
}
```

## /loginCa
- JWT based authentication is used
- Request must be encoded in the body as raw JSON in the following format:
```
{
    "email": <String>,
    "password": <String>
}
```
- If the account is found and password is valid, the MongoDB ObjectID is encoded using a JWT secret (stored as an environment variable).
- Two cookies (named jwt and name) are then created for the user which have a persistance time of 24 hours
- The session thus automatically expires after 24 hours

## /logoutCa
The cookies `jwt` and `name` are set to have a persistance time of 1ms which essentially deletes them ending the session

## /getCaData
- If the cookie `jwt` is set and valid (corresponding ObjectID exists in the CAs collection), a response of the following format is sent:
```
{
    "name": <String>,
    "email": <String>,
    "phone": <Number>,
    "gender": <String>,
    "college": <String>,
    "city": <String>,
    "dob": <ISO Date>,
    "referralCode": <String>,
    "referrals": [minUserSchema]
}
```
- `referrals` is an array whose elements satisfy the `minUserSchema`. The format of individual elements is depicted below:
```
{
    "name": <String>,
    "email": <String>,
    "phone": <Number>,
    "college": <String>,
    "_id": <MongoDB ObjectID of the user in the registers collection>
}
```