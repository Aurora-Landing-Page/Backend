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

## Protected (requireAuth) endpoints
- The following endpoints are protected by the `requireAuth` middleware and require a valid JWT cookie to be present in the user request:
  - /getUserData
  - /getCaData
  - /getParticipants
  - /generateTicket
  - /purchase
  - /verifyPurchase
  - /getKey
  - /createOrder
  - /verifyOrder
- The above endpoints respond with:
  - `403` if the JWT is invalid / absent
  - The requested URL if the JWT is present and valid

## Ultra Protected (requireAdmin) endpoints
- The following endpoints are protected by the `requireAdmin` middleware and require a valid admin JWT cookie:
  - /addGroup
  - /addIndividual
  - /getParticipants
  - /getReceipt
  - /verify
  - /attended
- The above endpoints respond with:
  - `403` if the JWT is invalid / absent or if the token does not correspond to an admin account
  - The requested URL if the JWT is present and valid

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

  ## A working demo of payments is present in the to-be-implemented directory
   ### /getKey
   - Returns the Razorpay key (to the account which will receive payments).
   - The following additional fields are included in the response
     ```
     {
       key: <String>
     }
     ```
   - Responds with:
     - `403` if the JWT is invalid / absent
     - `200` if the key was returned successfully

   ### /createOrder
   - The following fields must be added to the request body as JSON:
     ```
     { 
        eventId: <String (MongoDB ObjectId of the event)>, 
        eventType: <String (group | individual)>, 
        groupName: <String>, 
        members: <Array of MinUsers>, 
        accomodation: <Boolean>, 
        pronite: <Boolean>, 
        whole_event: <Boolean>, 
        purchaseType: <String (individual | group)>
     }
     ```
   - The fields from the created Razorpay order are included as additional fields in the response:
     ```
      {
        id: <String (Razorpay Order ID)>,
        entity: <String>,
        amount: <Number (amount to be paid in paise)>,
        amount_paid: <Number>,
        amount_due: <Number>,
        currency: <String ('INR')>,
        receipt: <String (internal receipt ID)>,
        status: <String>,
        attempts: <Number>,
        created_at: <Epoch Timestamp>
      }
     ```
   - Responds with:
     - `400` if the request is malformed in any way
     - `403` if the JWT is invalid / absent
     - `404` if the either the user / event is not found in the DB
     - `500` if an internal server error occurs
     - `200` if the order was successfully created

   ### /verifyOrder
   - The following fields must be added to the request body as JSON:
     ```
     {
        razorpaySignature: <Hash>, 
        razorpayOrderId: <String>, 
        razorpayPaymentId: <String>
     }
     ```
   - If the verification was successful, an additional `success: true` field is included in the response body
   - Responds with:
     - `400` if the request is malformed / order could not be verified
     - `500` if an internal server error occurs and payment could not be processed
     - `200` if the payment was successful, verified and confirmed

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
         "type": <String (user | ca)>
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

   ### /generateTicket
   - No additional data required to be encoded in the request, user must be logged in
   - The following may be set in the request body if an email should also be sent with the ticket attached:
     ```
      {
        "sendToEmail": <Boolean>,
      }
     ```
   - Responds with:
     - `403` if the JWT is invalid / absent
     - `500` if the ticket could not be generated
     - `200` if the payment was confirmed and participation was saved


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
         "type": <String (individual | group)>
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

### /getReceipt
   - Request must be encoded in the query:
     ```
     {
       receiptId: <String (internal reference ID)>
     }
     ```
   - The payment receipt is included in the response body as JSON.
   - Responds with:
     - `400` if the request is malformed / invalid
     - `404` if the specified receipt could not be found
     - `500` if an internal server error occurs
     - `200` if the query was successful

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
    gender: <String (limited by the enum ["Male", "Female", "Non-Binary"])>,
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
  college: <String>,
  city: <String>,
  dob: <ISO Date>
}
```

## `GroupSchema` object for `User`
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

## `PaymentReceipt` object
```
{
  orderId: <String (Razorpay order ID)>,
  paymentId: <String (Razorpay payment ID)>,
  receiptId: <String (Internal receipt reference)>,
  type: < String limited by the enum ["purchase_individual", "purchase_group", "participate_individual", "participate_group"] >,
  ticketCode: <String (ticket code of user making the payment)>, 
  data: <Object whose fields determine what will happen after the purchase is verified>,
  verified: <Boolean>
}
```