# User Service

This service is responsible for managing the users of one of FinPay's products.

## Installation

Clone the repository
```
git clone git@gitlab.com:finpay-interviews/finpay-user-service.git
cd finpay-user-service
```
Setup
```
npm i
npm start
```

## Instructions

During the interview, you will demonstrate each endpoint locally, so you will need to set up the database locally and connect it with your backend code.
You may also create an AWS account and set up the database that way, but that is ultimately up to you the candidate. 

You will Create CRUD endpoints for this backend service using Javascript, TypeScript, AWS Lambda, Serverless, Sequelize ORM, and PostrgreSQL.

All of the necessary libraries are included in the project; however, if there are any other libraries you wish to install and use, please do so.

Keep in mind that a user's client scope goes hand in hand with each user record, meaning, it does not make sense to only have one or the other.

#### Endpoint Information

| Request | Endpoint | Description                       |
|:--------| :------- | :-------------------------------- |
| POST    | `/user`  | Creates a user and client scope record |
| GET     | `/user/:id` | Gets a user and client scope record |
| PATCH   | `/user/:id` | Updates a user and/or client scope record |
| DELETE  | `/user/:id` | Deletes a user and client scope record |

#### User Object
The following object is how the request and/or response payload will look like.
For Patch requests, the request body will be a subset of this object.

```angular2html
  {
    firstName: "first",
    lastName: "last",
    mobilePhone: "123-456-7890",
    userName: "test.email@gmail.com",
    allowedClients: [
        {
            clientId: 1,
            clientName: "client1"
        },
        {
            clientId: 2,
            clientName: "client2"
        }
    ]
  }
```

#### Table Schema
Please refer to the tableSchema.png file

#### Things to consider
Best practices, scalability, performance, error handling, validation, design patterns, testing, etc. You do not need to include all of the aforementioned elements to your code but doing so and being able to explain it via comments or during the interview will result in additional points.