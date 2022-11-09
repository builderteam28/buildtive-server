# API DOCS

## List of available endpoints
 
- [X]  POST /users/login
- [X]  POST /users/register
- [X]  GET /users/:id
- [X]  PUT /users/:id
- [X]  POST /workers/register
- [X]  POST /workers/login
- [X]  GET /workers/categories/:categoryId
- [X]  GET /workers/:id
- [X]  PUT /workers/:id
- [X]  GET /projects
- [X]  GET /projects/:id
- [X]  POST /projects
- [X]  PUT /projects/:id
- [X]  PATCH /projects/:id
- [X]  DELETE /projects/:id
- [X]  GET /categories
- [X]  GET /categories/:id
- [X]  GET /payment/:id
- [X]  POST /payment
- [X]  PUT /payment/:id
- [X]  GET /ratings
- [X]  POST /projects/workers
- [X]  PATCH /projects/worker/:id
## 1. POST /users/register (register user)
  ### Request Body
```json
  {
    "email"       : String,
    "password"    : String,
    "fullName"    : String,
    "address"     : String,
    "phoneNumber" : Integer
  }
```
  ### Response
  _201 - Created New User_
  ```json
  {
    "message" : "Created new User"
  }
  ```
  _401 - Bad Request_
  ```json
  {
    "message" : String
  }
  ```
## 2. POST /users/login (login user)
  ### Request Body
  ```json
  {
    "email"   : String,
    "password": String
  }
  ```
  ### Response
  _200 - OK_
  ```json
  {
    "access_token" : String
  }
  ```
  _400 - Bad Request_
  ```json
  {
    "message" : String
  }
  ```
  _401 - Unauthorized_
  ```json
  {
    message : "Invalid email/password"
  }
  ```
## 3. GET /users/:id (show user profile)
  ### Request
  ```json
  {
    "id" : req.user.id
  }
  ```
  ### Response
  _200 - OK_
  ```json
  {
    "email": String,
    "fullName": String,
    "phoneNumber": String,
    "address": String,
  }
  ```
## 4. PUT /users/:id (edit user profile)
  ### Request
  _Get an ID_
  ```json
  {
    "id" : req.user.id
  }
  ```
  _Request Body_
  ```json
  {
    "fullName"    : String,
    "phoneNumber" : String,
    "address"     : String
  }
  ```
  ### Response
  _200 - OK_
  ```json
  {
    "message" : "Profile updated"
  }
  ```
  _401 - Bad Request_
  ```json
  {
    "message" : String
  }
  ```
## 5. POST /workers/register (register worker)
#### Description

- Create a new worker data

#### Request

- Body
  ```json
  {
    "email": String,
    "password": String,
    "fullName": String,
    "phoneNumber": String,
    "address": String,
    "birthDate": Date,
    "idNumber": STRING
  }
  ```

#### Response

_201 - Created_

- Body
  ```json
  {
    "message": String
  }
  ```

_400 - Bad Request_

- Body
  ```json
  {
    "message": String
  }
  ```

## 6. POST /workers/login (login worker)

#### Request

- Body
  ```json
  {
    "email": String,
    "password": String
  }
  ```

#### Response

_200 - OK_

- Body
  ```json
  {
    "access_token": String,
    "id": integer,
    "email": String,
  }
  ```

_400 - Bad Request_

- Body
  ```json
  {
    "message": String
  }
  ```

_401 - Unauthorized_

- Body
  ```json
  {
    "message": "Invalid email/password"
  }
  ```

## 7. GET /workers/:id (show worker profile)

#### Description

- Get a worker data based on given id

#### Request

- Headers
  ```json
  {
    "access_token": String
  }
  ```

#### Response

_200 - OK_

- Body
  ```json
  {
    "email": String,
    "fullName": String,
    "phoneNumber": String,
    "address": String,
    "birthDate": Date,
    "idNumber": STRING,
    "createdAt": Date
  }
  ```

_404 - Not Found_

- Body
  ```json
  {
    "message": STRING
  }
  ```

## 8. GET /workers/categories/:categoryId (push notification)

## 9. PUT /workers/:id (edit worker profile)

#### Description

- Put a worker data based on given id

#### Request

- Headers
  ```json
  {
    "access_token": String
  }
  ```

#### Response

_200 - OK_

- Body
  ```json
  {
    "message": STRING
  }
  ```

_404 - Not Found_

- Body

  ```json
  {
    "message": STRING
  }
  ```

## 10. GET /projects (project list at home)

## 11. GET /projects/:id (project detail { include payment status} )

## 12. POST /projects (create project)

## 13. PUT /projects/:id (edit project)

## 14. DELETE /projects/:id (delete project)

## 15. GET /categories (filtering projects at home, create project)

#### Description

- Get all the categories data

#### Request

#### Response

_200 - OK_

- Body
  ```json
  [
    {
        "id": Integer,
        "name": String,
        "ProjectId": Integer,
        "trailerUrl": Integer,
        "createdAt": Date,
        "updatedAt": Date,
    },
  ]
  ```

## 16. GET /categories/:id

#### Description

- Get a category data based on given id

#### Request

#### Response

_200 - OK_

- Body
  ```json
  {
    "id": Integer,
    "name": String,
    "ProjectId": Integer,
    "trailerUrl": Integer,
    "createdAt": Date,
    "updatedAt": Date,
  }
  ```

## 18. POST /payments (create payment)

## 19. patch /payments/:id ()

## 20. POST /ratings (user give ratings to workers)
