# Steps to Run
- Make dotenv file:
  ```
  JWT_SECRET=<JWT secret string for encoding>
  URI=<MongoDB signin URI>
  EMAIL=<Credentials for sending out mail>
  EMAIL_PASSWORD=<Credentials for sending out mail>
  NODE_ENV=<production || development>  // Configures stack trace printing and response format for errors
  ```
- npm install
- npm start

# API response format
## successResponses
- All 2xx responses will be of the format:
  ```
  {
      title: <String containing the title corresponding to the HTTP status code>,
      message: <String containing success details>,
      ...fields    
  }
  ```
- The destructured object `...fields` contains additional fields as required by the specific response and is optional.

## errorResponses
- All 4xx and 5xx responses will be of the format:
  ```
  {
      title: <String containing the title corresponding to the HTTP status code>,
      name: <String containing name of the error>,
      message: <String containing error details>,
      stackTrace: <String which contains stack trace of the error>
  }
  ```
-  The field `stackTrace` is defined only if NODE_ENV environment variable is set to development.

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
- If a new user is created in the database, the following additional fields are included in the JSON response:
  ```
  {
      "_id": <MongoDB ObjectID>,
      "name": <String>,
      "email": <String>,
      "phone": <Number>,
      "gender": <String>,
      "college": <String>,
      "city": <String>,
      "dob": <ISO Date>,,
      "earlySignup": false,
      "accomodation": false,
      "participatedIndividual": [eventId array],
      "participatedGroup": [],
      "purchasedTickets": [7 element Boolean array],
      "groupPurchase": [minUser Object array],
      "createdAt": <ISO Date>,
      "updatedAt": <ISO Date>,
  }
  ```
- If the referralCode is specified and valid, a minUserObject will be added to the referrals array of the corresponding CA
- Responds with:
  - `400` if the request is malformed / invalid
  - `500` if the user could not be created due to a server error
  - `201` with the user object in response JSON

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
- Responds with:
  - `404` if the specified user is not found in the DB
  - `500` if an internal server error occurs when sending the email
  - `200` if the email has been sent successfully

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
- If a new CA is created in the database, the following additional fields are included in the JSON response:
  ```
  {
      "name": <String>,
      "email": <String>,
      "phone": <Number>,
      "gender": <String>,
      "college": <String>,
      "city": <String>,
      "dob": <ISO Date>,
      "referralCode": <String>
  }
  ```
- Responds with:
  - `400` if the request is malformed / invalid
  - `500` if the user could not be created due to a server error
  - `201` if the user was created successfully

## /loginCa and /loginUser
- JWT based authentication is used
- Request must be encoded in the body as raw JSON in the following format:
  ```
  {
      "email": <String>,
      "password": <String>
  }
  ```
- If the account is found and password is valid, the MongoDB ObjectID is encoded using a JWT secret (stored as an environment variable).
- A cookie (named jwt) is then created which stores the encoded ID for the user which have a persistance time of 24 hours
- The session thus automatically expires after 24 hours
- Responds with:
  - `403` if the specified user/CA is not found in the DB
  - `202` if the user is logged in successfully

## /logout
- The cookie `jwt` is deleted and thus the user is logged out
- Responds with a 200

## /getCaData
- If the cookie `jwt` is set and valid (corresponding ObjectID exists in the CAs collection), a response of the following format is sent:
  ```
  {
      "_id": <MongoDB ObjectID>,
      "name": <String>,
      "email": <String>,
      "phone": <Number>,
      "gender": <String>,
      "college": <String>,
      "city": <String>,
      "dob": <ISO Date>,
      "referralCode": <String>,
      "referrals": [minUserSchema]
      "createdAt": <ISO Date>,
      "updatedAt": <ISO Date>
  }
  ```
- `referrals` is an array whose elements satisfy the `minUserSchema`. The format of individual elements is depicted below:
  ```
  {
      "_id": <MongoDB ObjectID>
      "name": <String>,
      "email": <String>,
      "phone": <Number>,
      "college": <String>
  }
  ```
- Responds with:
  - `403` if the JWT is invalid / absent
  - `404` if the JWT is valid but the corresponding CA does not exist in the DB
  - `500` if an internal server error occurs
  - `200` if the specified CA was found

## /forgotPass 
- Request must be encoded in the body as raw JSON in the following format:
  ```
  {
      "email": <String>,
      "type": <String>
  }
  ```
- The type must be set to `user` or `CA`
- If the query is valid, a new 5 letter password is generated and stored in the DB
- An email with the new password is then sent to the user/CA
- Responds with:
  - `400` if the request is malformed / invalid
  - `404` if the specified user is not found in the DB
  - `500` if an internal server error occurs
  - `200` if the password was reset and a mail was successfully sent to the user

## Protected (requireAuth) endpoints
- The following endpoints are protected by the `requireAuth` middleware and require a valid JWT cookie to be present in the user request:
  - /getCaData 
- The above endpoints respond with:
  - `403` if the JWT is invalid / absent
  - The requested URL if the JWT is present and valid