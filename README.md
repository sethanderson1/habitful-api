# Habitful API

Server API interface for storing and delivering "Habitful" data.

## Live App

https://habitful-client.vercel.app/

### API Endpoint
https://murmuring-garden-60807.herokuapp.com/

## Open Endpoints

Open endpoints require no Authentication.

### SignUp: `POST /api/users/`


**Sample request Body**

Adds new user credentials to database as long as are valid and name is unique

```json
{ 
    "user_name": "newuser@gmail.com",
    "password" : "Password1!"
 } 
```

**Sample Response Body**

```json
{
    "id": 2,
    "user_name": "newuser@gmail.com",
    "date_created": "2020-07-04T10:07:05.668Z",
}
```


### Login: `POST /api/auth/`

Validates the login credentials against the database and if they are valid returns a JWT

**Sample request Body**

```json
{
  "username": "example",
  "password": "example-password"
}
```

**Sample Response Body**

```json
{
  "authToken": "thISisASampLEjwtAUthToKEN"
}
```

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the
request. A Token can be acquired from the Login view above.

### Get all categories `GET /api/habits/`
Returns a list of the user's habits.

**Example Response Body**

```json
[
    {
        "id": 1,
        "name": "walk for 1 hour",
        "description": "",
        "num_times": "7",
        "time_interval": "week",
        "date_created": "2020-06-30T11:00:00.000Z"
    },
    {
        "id": 2,
        "name": "meditate 15 min",
        "description": "",
        "num_times": "7",
        "time_interval": "week",
        "date_created": "2020-07-01T00:00:00.000Z"
    }
]
```

### Post a category `POST /api/habits/`
Posts to database. Returns 201 status code and the habit data

**Example Request Body**

```json

{
    "name":"eat an apple",
    "user_id":1,
    "description":"",
    "num_times":7,
    "time_interval":"week",
    "date_created": "2020-08-15T11:00:00.000Z"
}
 
 ```

**Example Response Body**

```json

{
    "id": 10,
    "name": "eat an apple",
    "description": "",
    "num_times": "7",
    "time_interval": "week",
    "date_created": "2020-08-15T11:00:00.000Z"
}
    
```


### Get a habit `Get /api/habits/:habitId`
Gets a specific habit. Habit with correct habitId is sent back
with 200 status code.

**Example Response Body**

```json

{
    "id": 1,
    "name": "walk for 1 hour",
    "description": "",
    "num_times": "7",
    "time_interval": "week",
    "date_created": "2020-06-30T11:00:00.000Z"
}
    
```

### Update a habit `Patch /api/habits/:habitId`
Updates a specific habit. 204 status code is sent back.

**Example Request Body**

```json

{
    "name":"eat an banana",
    "user_id":1,
    "description":"",
    "num_times":7,
    "time_interval":"week",
}
    
```

### Delete a habit `DELETE /api/habit/:habitId`
Deletes a specific habit. Habit with correct habitId is deleted
with status code 204

### Get all habit-records `GET /api/habit-records/:habit-recordId`
Returns a list of the user's habit-records.

**Example Response Body**

```json
[
    {
        "id": 994,
        "date_completed": "2020-08-07T07:00:00.000Z",
        "habit_id": 1
    },
    {
        "id": 995,
        "date_completed": "2020-08-06T07:00:00.000Z",
        "habit_id": 1
    },
    {
        "id": 996,
        "date_completed": "2020-08-05T07:00:00.000Z",
        "habit_id": 1
    }
]
```


### Post a habit-record `POST /api/habit-records`
Post a new habit-record. Return post data with status 201 created

**Example Request Body**

```json

    {
       "date_completed":"2020-07-15T20:23:59Z",
       "habit_id":1
    }
```
**Example Response Body**

```json
{
    "id": 3491,
    "date_completed": "2020-07-15T20:23:59Z",
    "habit_id": 1
}
```

### Delete a habit-record `Delete /api/habit-records/record/:habit-recordId`
Deletes a habit-record. Returns status 204 when deleted.


## Technology

### Built with:
* Node.js
    * Express server framework
    * Jsonwebtoken and bcrypt.js for authentication
* PostgreSQL database
    * Knex.js for query building
    * Postgrator for versioning
* Testing on Mocha framework using Chai and Supertest

## Client Repo

* https://github.com/sethanderson1/habitful-client/

