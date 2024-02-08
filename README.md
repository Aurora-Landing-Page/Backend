# Steps to Run
- Make dotenv file:
  ```
  JWT_SECRET=<String>
  URI=<MongoDB Connection URI>
  NODE_ENV=<development | production>
  TZ=<IANA timezone identifier>
  SITE_FOR_TICKET=<Admin site link>
  DOMAIN=<Site domain for setting cookie domain properly>
  EMAIL=<Sender ID>
  EMAIL_PASSWORD=<Sender password>
  SMTP_SERVER=<SMTP Auth Server Address>
  TICKET_TEMPLATE_ROUTE=<Absolute filepath to the ticket template image>
  CLOUDINARY_CLOUD_NAME=<String>
  CLOUDINARY_API_KEY=<String>
  CLOUDINARY_API_SECRET=<String>
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
  - /getUserData : `GET`
  - /getCaData : `GET`
  - /generateTicket : `GET`
  - DEPRECATED :: /getKey : `GET`
  - DEPRECATED :: /createOrder : `POST`
  - DEPRECATED :: /verifyOrder : `POST`
- The following are the new payment endpoints:
  - /createPurchase : `POST`
  - /uploadScreenshot : `POST`
- The above endpoints respond with:
  - `403` if the JWT is invalid / absent
  - The requested URL if the JWT is present and valid

## Ultra Protected (requireAdmin) endpoints
- The following endpoints are protected by the `requireAdmin` middleware and require a valid admin JWT cookie:
  - /addGroup : `POST`
  - /addIndividual : `POST`
  - /getParticipants : `GET`
  - /getAllCas : `GET`
  - /getReceipt : `GET`
  - /attended : `POST`
  - /verify : `GET`
  - /physicalVerify : `GET`
- The following are the new (manual) payment verification endpoints:
  - /getReceiptDetails : `GET`
  - /approvePayment : `POST`
  - /denyPayment : `POST`
  - /getApprovedReceipts : `GET` 
  - /getApprovedTicketReceipts : `GET` 
  - /getUnapprovedReceipts : `GET` 
- The above endpoints respond with:
  - `403` if the JWT is invalid / absent or if the token does not correspond to an admin account
  - The requested URL if the JWT is present and valid

# API Endpoints
## User Endpoints
   ### /registerUser : POST
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

   ### /getUserData : GET
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
   ### /getKey : GET :: DEPRECATED
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

   ### /createOrder : POST :: DEPRECATED
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

   ### /verifyOrder : POST :: DEPRECATED
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

   ### /createPurchase : POST
   - For ticket purchase, the following must be encoded in the body as JSON:
     ```
     { 
        accomodation: <Boolean>, 
        pronite: <Boolean>, 
        whole_event: <Boolean>, 
        purchaseType: <String (individual || group)>,
        members: <Array of MinUser (not including the user themselves)>
     }
     ```
   - For event participation, the following must be encoded in the body as JSON:
     ```
     { 
        eventId: <String>, 
        eventType: <String (individual || group)>, 
        groupName: <String>, 
        members: <Array of MinUser (not including the user themselves)>
     }
     ```
   - If the purchase was successfully created, the following additional fields are included in the response body:
      ```
      {
          receiptId: <String>,
          ticketCode: <String>,
          amount: <Number>,
          imageUrl: <Cloudinary image URL>,
          data: <Object representing post payment operations>,
          approved: <Boolean>
      }
      ```
   - `imageUrl` will be empty here as image has not yet been uploaded
   - Responds with:
     - `400` if the request is malformed
     - `403` if the JWT is absent / invalid
     - `404` if the intent is participation but specified eventId could not be found
     - `500` is an internal sever error occurs and purchase intent could not be created
     - `200` if the purchase was successfully created

   ### /uploadScreenshot : POST
   - The image must be added to FormData along with the receiptId. The FormData should be of the format:
     ```
     {
        image: <ImageFile>, 
        receiptId: <String>
     }
     ```
   - If the upload was successful, an additional `success: true` field is included in the response body
   - Responds with:
     - `413` if the file size is too large (limited to 1.1MB)
     - `404` if the specified receiptId could not be found
     - `500` if an internal server error occurs
     - `200` if the upload was successful 

## CA Endpoints
   ### /registerCA : POST
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

   ### /getCaData : GET
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
   ### /loginCa and /loginUser : POST
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

   ### /logout : POST
   - The cookie `jwt` is deleted and thus the user is logged out
   - Responds with a `200`

   ### /forgotPass : POST
   - Request must be encoded in the body as raw JSON in the following format:
     ```
     {
         "email": <String>,
         "type": <String (user || ca)>
     }
     ```
   - The type must be set to `user` or `ca`
   - If the query is valid, a new 5 letter password is generated and stored in the DB
   - An email with the new password is then sent to the user/CA
   - Responds with:
     - `400` if the request is malformed / invalid
     - `404` if the specified user is not found in the DB
     - `500` if an internal server error occurs
     - `200` if the password was reset and a mail was successfully sent to the user

   ### /contactUs : POST
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

   ### /generateTicket : GET
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

   ### /getPaymentStatus : POST
   - The email of the user whose payment status is to be checked should be encoded in the body as JSON:
     ```
      {
        "email": <String>,
      }
     ```
   - The following additional fields are included in the response if the query was successful:
     ```
      {
        "receipts": <Array of ManualPayments>,
      }
     ```
   - Responds with:
     - `400` if the request was malformed
     - `404` if the specified email could not be found
     - `500` if an internal server error occurs
     - `200` if the query was successful

## Admin Endpoints
### /addIndividual : POST
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

### /addGroup : POST
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

### /getParticipants : GET
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

### /getAllCas : GET
   - If the query is valid, all CAs will be returned as an array (`data`) of objects.
   - The additional field `data` is included in the response if successful.
   - Responds with:
     - `404` if the query returned no CAs
     - `200` if the query was successful

### /verify : GET
   - Request must be encoded in the query with the key `ticketCode`
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

### /physicalVerify : GET
   - Request must be encoded in the query with the key `ticketCode`
   - If the query is valid, the additional fields included in the response body are:
     ```
      {
        __id: <MongoDB ObjectID>
        name: <String>,
        email: <String>,
        phone: <Number>,
        purchasedTickets: <Boolean Array of 6 elements>,
        attendedEvent: <Boolean Array of 6 elements>,
        ticketCode: <String>,
        onlineRegistrationDone: <Boolean>,
        freeParticipations: <Number>
      }
     ```
   - Responds with:
     - `400` if the request is malformed / invalid
     - `404` if the specified `ticketCode` could not be found
     - `200` if the query was successful

### /attended : POST
   - Request must be encoded in the body as raw JSON in the following format:
     ```
     {
         "ticketCode": <String>,
         "event": <String>,
         "physicalTicket": <Boolean>
     }
     ```
   - `event` must be strictly set to `pronite` or `whole_event`
   - `physicalTicket` must be set to `true` if the ticket shown is a physically sold ticket
   - Responds with:
     - `400` if the request is malformed / invalid
     - `404` if the specified ticketCode could not be found
     - `500` if an internal server error occurs
     - `200` if the query was successful


### /getReceiptDetails : GET
   - Request must be encoded in the query with the key `receiptId`
   - The following additional fields are included in the response:
     ```
      {
          receiptId: <String>,
          ticketCode: <String>,
          amount: <Number>,
          imageUrl: <Cloudinary image URL>,
          data: <Object representing post payment operations>,
          approved: <Boolean>,
          denied: <Boolean>
      }
     ```
   - Responds with:
     - `400` if the request is malformed / invalid
     - `404` if the specified receiptId could not be found
     - `500` if an internal server error occurs
     - `200` if the query was successful

### /getApprovedReceipts : GET
   - Nothing has to be encoded in the request
   - Please note that the `number` property may not correctly reflect the number of tickets sold / participants as group purchases are counted as one irrespective of the number of tickets bought / the number of participants in that specific purchase 
   - The following additional fields are included in the response:
     ```
      {
          approvedPayments: <Array of ManualPayments>,
          number: <Number>
      }
     ```
   - Responds with:
     - `500` if an internal server error occurs
     - `200` if the query was successful

### /getApprovedTicketReceipts : GET
   - Nothing has to be encoded in the request
   - Only includes those payments which were for buying tickets
   - Please note that the `number` property may not correctly reflect the number of tickets sold as group ticket purchases are counted as one irrespective of the number of tickets bought in that specific purchase 
   - The following additional fields are included in the response:
     ```
      {
          approvedPayments: <Array of ManualPayments>,
          number: <Number>
      }
     ```
   - Responds with:
     - `500` if an internal server error occurs
     - `200` if the query was successful

### /getUnapprovedReceipts : GET
   - Nothing has to be encoded in the request
   - The following additional fields are included in the response:
     ```
      {
          unapprovedPayments: <Array of ManualPayments>,
          number: <Number>
      }
     ```
   - Responds with:
     - `500` if an internal server error occurs
     - `200` if the query was successful

### /approvePayment : POST
   - Request must be encoded in the query with the key `receiptId`
   - An additional `success: true` field is included in the response if the `receiptId` was successfully approved
   - Responds with:
     - `404` if the specified receiptId could not be found
     - `500` if an internal server error occurs
     - `200` if the `receiptId` was successfully approved


### /denyPayment : POST
   - Request must be encoded in the query with the key `receiptId`
   - `denied` payments will not be included in further `/getUnapprovedReceipts` query responses
   - An additional `success: true` field is included in the response if the `receiptId` was successfully approved
   - Responds with:
     - `404` if the specified receiptId could not be found
     - `500` if an internal server error occurs
     - `200` if the `receiptId` was successfully denied

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

## `PhysicalUser` object
```
{
    __id: <MongoDB ObjectID>
    name: <String>,
    email: <String>,
    phone: <Number>,
    purchasedTickets: <Boolean Array of 6 elements>,
    attendedEvent: <Boolean Array of 6 elements>,
    ticketCode: <String>,
    onlineRegistrationDone: <Boolean>,
    freeParticipations: <Number>
}
```

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

## `PaymentReceipt` object :: DEPRECATED
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

## `ManualPayment` object
```
{
    receiptId: <String>,
    ticketCode: <String>,
    amount: <Number>,
    imageUrl: <Cloudinary image URL>,
    data: <Object representing post payment operations>,
    approved: <Boolean>,
    denied: <Boolean>
}
```