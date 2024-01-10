# Steps to Run
- Make dotenv file:
  ```
  JWT_SECRET=<String>
  URI=<MongoDB Connection URI>
  NODE_ENV=<development | production>
  TZ=<IANA timezone identifier>
  SITE=<Site link>
  RAZORPAY_ID=<Razorpay account ID>
  RAZORPAY_SECRET=<Razorpay account secret>
  EMAIL=<Sender ID>
  EMAIL_PASSWORD=<Sender password>
  SMTP_SERVER=<SMTP Auth Server Address>
  ```
- npm install
- npm start

# API response format
## successResponses
- All `2xx` responses will be of the format:
  ```
  {
      title: <String containing the title corresponding to the HTTP status code>,
      message: <String containing success details>,
      ...fields    
  }
  ```
- The destructured object `...fields` contains additional fields as required by the specific response and is optional.

## errorResponses
- All `4xx` and `5xx` responses will be of the format:
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
## User Endpoints
   ### /registerUser
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
       "participatedIndividual": <Array of MongoDB ObjectIds>,
       "participatedGroup": <Map (eventId => GroupSchema)>,
       "purchasedTickets": <6 element Boolean array>,
       "groupPurchase": <Array of MinUsers>,
       "attendedEvent": <6 element Boolean array>,
       "isAdmin": <Boolean>,
       "ticketCode": <String>
     }
     ```
   - A registration completed email is sent to the user after the user is successfully saved in the DB.
   - If the referralCode is specified and valid, a `MinUser` will be added to the referrals array of the corresponding CA.
   - Responds with:
     - `400` if the request is malformed / invalid
     - `500` if the user could not be created due to a server error
     - `201` with the user object in response JSON

   ### /getUserData
   - If the cookie `jwt` is set and valid (corresponding ObjectID exists in the Users collection), the following additional fields are included in the response:
     ```
     {
       name: <String>,
       email: <String>,
       phone: <Number>,
       gender: <String>,
       college: <String>,
       city: <String>,
       password: <String>,
       dob: <ISO Date>,
       earlySignup: <Boolean>,
       groupPurchase: <MinUser object array>,
       accomodation: <Boolean>,
       participatedIndividual: <MongoDB ObjectID array>,
       participatedGroup: <Map (eventId string => GroupSchema)>,
       purchasedTickets: <6 element Boolean array>,
       attendedEvent: <6 element Boolean array>,
       isAdmin: <Boolean>,
       ticketCode: <String>
     }
     ```
   - Responds with:
     - `403` if the JWT is invalid / absent
     - `404` if the JWT is valid but the corresponding CA does not exist in the DB
     - `500` if an internal server error occurs
     - `200` if the specified User was found

## CA Endpoints
   ### /registerCa
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
         "password": <String>,
         "caCode": <String>
     }
     ```
   - A registration completed email is sent to the user after the user is successfully saved in the DB.
   - If a new CA is created in the database, the following additional fields are included in the JSON response:
     ```
     {
       name: <String>,
       email: <String>,
       phone: <Number>,
       gender: <String>,
       college: <String>,
       city: <String>,
       password: <String>,
       dob: <ISO Date>,
       earlySignup: <Boolean>,
       groupPurchase: <MinUser object array>,
       accomodation: <Boolean>,
       participatedIndividual: <MongoDB ObjectID array>,
       participatedGroup: <Map (eventId string => GroupSchema)>,
       purchasedTickets: <6 element Boolean array>,
       attendedEvent: <6 element Boolean array>,
       ticketCode: <String>,
       caCode: <String>,
       referralCode: <String>
     }
     ```
   - Responds with:
     - `400` if the request is malformed / invalid
     - `500` if the user could not be created due to a server error
     - `201` if the user was created successfully

   ### /getCaData
   - If the cookie `jwt` is set and valid (corresponding ObjectID exists in the CAs collection), a response of the following format is sent:
     ```
     {
        "_id": <MongoDB ObjectID>,
        "name": <String>,
        "email": <String>,
        "phone": <Number>,
        "gender": <String restricted to the enum ["Male", "Female", "Non-Binary"]>,
        "college": <String>,
        "city": <String>,
        "dob": <ISO Date>,
        "earlySignup": <Boolean>,
        "accomodation": <Boolean>,
        "participatedIndividual": <Array of MongoDB ObjectIds>,
        "purchasedTickets": <Boolean Array of length 6>,
        "attendedEvent": <Boolean Array of length 6>,
        "caCode": <String>
        "referralCode": <String>,
        "referrals": <Array of MinUsers>,
        "groupPurchase": <Array of MinUsers>
     }
     ```
   - `referrals` is an array whose elements satisfy the `MinUser` schema. The format of individual elements is depicted below:
     ```
     {
       "_id": <MongoDB ObjectID>
       "name": <String>,
       "email": <String>,
       "phone": <Number>,
       "college": <String>
     }
     ```
   - The `_id` above is specific to the particular instance of MinUser, not some other collection.
   - Responds with:
     - `403` if the JWT is invalid / absent
     - `404` if the JWT is valid but the corresponding CA does not exist in the DB
     - `500` if an internal server error occurs
     - `200` if the specified CA was found

## Common Endpoints
   ### /loginCa and /loginUser
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

   ### /logout
   - The cookie `jwt` is deleted and thus the user is logged out
   - Responds with a `200`

   ### /forgotPass 
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

   ### /contactUs
   - Request must be encoded in the body as raw JSON in the following format:
     ```
     {
         "name": <String>,
         "email": <String>
         "subject": <String>,
         "message": <String>
     }
     ```
   - If the query is valid, the contactUsMessage will be stored in the DB
   - Responds with:
     - `400` if the request is malformed / invalid
     - `500` if an internal server error occurs
     - `200` if the message was successfully saved in the DB

   ### /participateIndividual --> Payments not yet functional
   - Request must be encoded in the body as raw JSON in the following format:
     ```
      {
        "eventId": <String (individual event's ObjectId)>,
        "type": <String (user | ca)>
      }
     ```
   - Responds with:
     - `403` if the JWT is invalid / absent
     - `409` if the user has already participated in the event 
     - `402` if the payment could not be confirmed
     - `200` if the payment was confirmed and participation was saved

   ### /participateGroup --> Payments not yet functional
   - Request must be encoded in the body as raw JSON in the following format:
     ```
      {
        "eventId": <String (group event's ObjectId)>,
        "type": <String (user | ca)>,
        "groupName": <String>,
        "members": <Array of MinUser Schema including leader>
      }
     ```
   - Responds with:
     - `403` if the JWT is invalid / absent
     - `409` if the user has already participated in the event 
     - `402` if the payment could not be confirmed
     - `200` if the payment was confirmed and participation was saved

   ### /generateTicket
   - No additional data required to be encoded in the request, user must be logged in
   - The following may be set in the request body if an email should also be sent with the ticket attached:
     ```
      {
        "sendToEmail": <Boolean>,
        "type": <String (user | ca)>
      }
     ```
   - Responds with:
     - `403` if the JWT is invalid / absent
     - `500` if the ticket could not be generated
     - `200` if the payment was confirmed and participation was saved


   ### /purchase --> Not Finalised
   - The receipt number for all orders is set to be the same as the ticket code
   - Request must be encoded in the body as raw JSON in the following format:
     ```
      {
        "event": <String>,
        "accomodation": <Boolean>,
        "type": <String (user | ca)>
      }
     ```
   - `event` must be strictly set to `pronite` or `whole_event`
   - Responds with:
     - `400` if the request is malformed / invalid
     - `400` if `accomodation` is set to true but no more accomodation is available
     - `500` if an internal server error occurs
     - `200` if the purchase intent was successfully created

   ### /verifyPurchase --> Not Finalised
   - Request must be encoded in the body as raw JSON in the following format:
     ```
      {
        "razorpay_signature": <String>, 
        "razorpay_order_id": <String>, 
        "razorpay_payment_id" : <String>
      }
     ```
   - Responds with:
     - `400` if the payment could not be verified
     - `500` if the payment could not be processed
     - `200` if the payment was confirmed and entry was saved

## Admin Endpoints
### /addIndividual
   - Request must be encoded in the body as raw JSON in the following format:
     ```
     {
       "eventId": <String representing MongoDB ObjectId>
       "name": <String>,    // required
       "email": <String>,   // optional
       "phone": <Number>    // optional
     }
     ```
   - If the query is valid, a new profile is created in the `admin_added_users` collection.
   - If `email` and `phone` are not specified, the admin's email and phone are used.
   - Responds with:
     - `400` if the request is malformed / invalid
     - `500` if an internal server error occurs
     - `200` if the participation was successfully saved in the DB

### /addGroup
   - Request must be encoded in the body as raw JSON in the following format:
     ```
     {
       "eventId": <String representing MongoDB ObjectId>
       "groupName": <String>,                     // required
       "members": <Array of MinUser Schema>       // required
       "email": <String>,                         // optional
       "phone": <Number>,                         // optional
     }
     ```
   - If the query is valid, a new profile is created in the `admin_added_users` collection (`groupName` is used as `name`)
   - If `email` and `phone` are not specified, the admin's email and phone are used.
   - Also, if `email` and `phone` are not specified for any individual member, the admin's email and phone are used.
   - Responds with:
     - `400` if the request is malformed / invalid
     - `500` if an internal server error occurs
     - `200` if the participation was successfully saved in the DB

### /getParticipants
   - Request must be encoded in the body as raw JSON in the following format:
     ```
     {
         "eventId": <String>,
         "type": <String>
     }
     ```
   - If the query is valid, the contactUsMessage will be stored in the DB
   - Responds with:
     - `400` if the request is malformed / invalid
     - `404` if the specified eventId could not be found
     - `500` if an internal server error occurs
     - `200` if the query was successful

### /verify
   - Request must be encoded in the query as such: `/verify?ticketCode=<String>`
   - If the query is valid, the additional fields included in the response body are:
  ```
    {
      name: <String>,
      email: <String>,
      phone: <Number>,
      gender: <String>,
      college: <String>,
      city: <String>,
      password: <String>,
      dob: <ISO Date>,
      earlySignup: <Boolean>,
      groupPurchase: <MinUser object array>,
      accomodation: <Boolean>,
      participatedIndividual: <MongoDB ObjectID array>,
      participatedGroup: <Map (eventId string => GroupSchema)>,
      purchasedTickets: <7 element Boolean array>,
      isAdmin: <Boolean>,
      ticketCode: <String (6 character alphanumeric)>
    }
  ```
   - Responds with:
     - `400` if the request is malformed / invalid
     - `404` if the specified `ticketCode` could not be found
     - `200` if the query was successful

### /attended
   - Request must be encoded in the body as raw JSON in the following format:
     ```
     {
         "ticketCode": <String>,
         "event": <String>
     }
     ```
   - `event` must be strictly set to `pronite` or `whole_event`
   - Responds with:
     - `400` if the request is malformed / invalid
     - `404` if the specified ticketCode could not be found
     - `500` if an internal server error occurs
     - `200` if the query was successful

## Protected (requireAuth) endpoints 
### All of the following (except /getUserData, /getCaData amd /generateTicket) are disabled in the current version
- The following endpoints are protected by the `requireAuth` middleware and require a valid JWT cookie to be present in the user request:
  - /getUserData
  - /getCaData
  - /participateGroup
  - /participateIndividual
  - /getParticipants
  - /generateTicket
  - /purchase
  - /verifyPurchase
- The above endpoints respond with:
  - `403` if the JWT is invalid / absent
  - The requested URL if the JWT is present and valid

## Ultra Protected (requireAdmin) endpoints (all of the following are disabled in the current version)
- The following endpoints are protected by the `requireAdmin` middleware and require a valid admin JWT cookie:
  - /addGroup
  - /addIndividual
  - /getParticipants
  - /verify
  - /attended
- The above endpoints respond with:
  - `403` if the JWT is invalid / absent or if the token does not correspond to an admin account
  - The requested URL if the JWT is present and valid

# Document Model Formats
### All below documents will also additionally contain the __v and timestamp (createdAt, updatedAt) fields added by Mongoose

## `User` / `Admin` object
```
{
    __id: <MongoDB ObjectID>
    name: <String>,
    email: <String>,
    phone: <Number>,
    password: <String>,
    earlySignup: <Boolean>,
    groupPurchase: <Array of MinUsers>,
    accomodation: <Boolean>,
    participatedIndividual: <Array of MongoDB ObjectIds>,
    participatedGroup: <Map (eventIds => groupSchema)>,
    purchasedTickets: <Boolean Array of 6 elements>,
    attendedEvent: <Boolean Array of 6 elements>,
    isAdmin: <Boolean>,
    ticketCode: <String>,
    gender: ,
    college: <String>,
    city: <String>,
    dob: <ISO Date>
}
```
- Expected format of `purchasedTickets`: [pronite_1, pronite_2, pronite_3, whole_event_1, whole_event_2, whole_event_3]
- Expected format of `attendedEvents`: [pronite_1, pronite_2, pronite_3, whole_event_1, whole_event_2, whole_event_3]


## `CA` object
```
{
  _id: <MongoDB ObjectID>
  name: <String>,
  email: <String>,
  phone: <Number>,
  gender: <String (limited by the enum ["Male", "Female", "Non-Binary"])>,
  password: <String>,
  referralCode: <String>,
  referrals: <Array of MinUser>,
  caCode: <String>,
  earlySignup: <Boolean>,
  groupPurchase: <Array of MinUser>,
  accomodation: <Boolean>,
  participatedIndividual: <MongoDB ObjectId array>
  participatedGroup: <Map (eventIds => groupSchema)>
  purchasedTickets: <Boolean array of 6 elements>,
  attendedEvent: <Boolean array of 6 elements>,
  ticketCode: <String>,
  college: <String>,
  city: <String>,
  dob: <ISO Date>
}
```
- Expected format of `purchasedTickets`: [pronite_1, pronite_2, pronite_3, whole_event_1, whole_event_2, whole_event_3]
- Expected format of `attendedEvents`: [pronite_1, pronite_2, pronite_3, whole_event_1, whole_event_2, whole_event_3]

## `GroupSchema` object for `User`/`CA`
```
{
    groupName: <String>,
    members: <MinUser object array>
}
```

## `MinUser` object
```
{
    name: <String>,
    email: <String>,
    phone: <Number>,
    college: <String>
}
```

## `Event` object
```
{
  name: <String>,
  fee: <Number>,
  participants: <User / Leader MongoDB ObjectId Array>,
  isGroup: <Boolean>
}
```

## `ContactUsMessage` object
```
{
    "name": <String>,
    "email": <String>
    "subject": <String>,
    "message": <String>
}
```

## `CaCode` object
```
{
  "code": <String>,
  "used": <Boolean>,
  "createdBy": <String containing admin email>
}
```