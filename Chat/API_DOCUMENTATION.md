# CS571 S23 HW10 API Documentation

## At a Glance

All routes are relative to `https://cs571.org/s23/hw10/api/`

| Method | URL | Purpose | Return Codes |
| --- | --- | --- | --- |
| `GET`| `/chatroom` | Get all chatrooms. | 200, 304 |
| `GET` | `/chatroom/:chatroomName/messages`| Get latest 25 messages for specified chatroom. | 200, 304, 404 |
| `POST` | `/chatroom/:chatroomName/messages` | Posts a message to the specified chatroom. | 200, 400, 404, 413 |
| `DELETE` | `/chatroom/:chatroomName/messages/:messageId` | Deletes the given message. | 200, 400, 401, 404 |
| `POST` | `/register` | Registers a user account. | 200, 400, 401, 409, 413  |
| `POST` | `/login` | Logs a user in. | 200, 400, 401, 404 |
| `GET` | `/whoami` | Gets details about the currently logged in user. | 200, 401 |

**Note:** In this API, because we are no longer using cookies, there is not a logout endpoint.

An unexpected server error `500` *may* occur during any of these requests. It is likely to do with your request. Make sure that you have included the appropriate headers and, if you are doing a POST, that you have a properly formatted JSON body. If the error persists, please contact a member of the course staff.

Make sure to include an authorization header and specify a content-type where appropriate. A valid `X-CS571-ID` must be included with each request, otherwise you will recieve a `401` in addition to any of the errors described below.

## In-Depth Explanations

### Getting all Chatrooms
`GET` `https://cs571.org/s23/hw10/api/chatroom`

A `200` (new) or `304` (cached) response will be sent with the list of all chatrooms.

```json
[
    "Bascom",
    "Brogden",
    "Chamberlin",
    "Grainger",
    "Ingraham",
    "VanVleck",
    "Vilas"
]
```

### Getting Messages for Chatroom

`GET` `https://cs571.org/s23/hw10/api/chatroom/:chatroomName`

There is no get all messages; you must get messages for a particular `:chatroomName`. All messages are public, you do *not* need to be logged in to access them. Only up to the latest 25 messages will be returned. A `200` (new) or `304` (cached) response will be sent with messages organized from most recent to least recent. Note that the `created` field is in Unix epoch time.

```json
{
    "msg": "Successfully got the latest messages!",
    "messages": [
        {
            "id": 2,
            "poster": "acct123",
            "title": "My Test Post",
            "content": "lorem ipsum dolor sit",
            "chatroom": "Vilas",
            "created": 1677515453383
        },
        {
            "id": 1,
            "poster": "acct123",
            "title": "My Test Post",
            "content": "lorem ipsum dolor sit",
            "chatroom": "Vilas",
            "created": 1677515193610
        }
    ]
}
```

If a chatroom is specified that does not exist, a `404` will be returned.

```json
{
    "msg": "The specified chatroom does not exist. Chatroom names are case-sensitive."
}
```

### Registering a User
`POST` `https://cs571.org/s23/hw10/api/register`

You must register a user with a specified `username` and `password`. 

Requests must include a header `Content-Type: application/json`.

**Example Request Body**

```json
{
    "username": "test12456",
    "password": "p@ssw0rd1"
}
```

If the registration is successful, the following `200` will be sent...
```json
{
    "msg": "Successfully created user!",
    "user": {
        "id": 4,
        "username": "test12456",
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

The returned `token` is your JWT. Store this in a safe place. The provided token is an irrevocable JWT that will be valid for **1 hour**. All future requests to authorized endpoints must include this an `Authorization: Bearer <JWT>` header.

If you forget to include a `username` or `password`, the following `400` will be sent...

```json
{
    "msg": "A request must contain a 'username' and 'password'"
}
```

If a user by the requested `username` already exists, the following `409` will be sent...

```json
{
    "msg": "The user already exists!"
}
```

If the `username` is longer than 64 characters or if the `password` is longer than 128 characters, the following `413` will be sent...

```json
{
    "msg": "'username' must be 64 characters or fewer and 'password' must be 128 characters or fewer"
}
```

### Logging in to an Account

`POST` `https://cs571.org/s23/hw10/api/login`

You must log a user in with their specified `username` and `password`.

Requests must include a header `Content-Type: application/json`.

**Example Request Body**

```json
{
    "username": "test12456",
    "password": "pass123"
}
```

If the login is successful, the following `200` will be sent...

```json
{
    "msg": "Successfully authenticated.",
    "user": {
        "id": 4,
        "username": "test12456",
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

The returned `token` is your JWT. Store this in a safe place. The provided token is an irrevocable JWT that will be valid for **1 hour**. All future requests to authorized endpoints must include this an `Authorization: Bearer <JWT>` header.

If you forget the `username` or `password`, the following `400` will be sent...

```json
{
    "msg": "A request must contain a 'username' and 'password'"
}
```

If the `username` exists but the `password` is incorrect, the following `401` will be sent...

```json
{
    "msg": "Incorrect password."
}
```

If the `username` does not exist, the following `404` will be sent...

```json
{
    "msg": "That user does not exist!"
}
```

### Posting a Message

`POST` `https://cs571.org/s23/hw10/api/chatroom/:chatroomName/messages`

Posting a message is an authorized operation; you must have a valid `Authorization` session. The `:chatroomName` must be specified in the URL, and a post must also have a `title` and `content`.

Requests must include the `Authorization` header as well as a header `Content-Type: application/json`.

**Example Request Body**

```json
{
    "title": "My Test Post",
    "content": "lorem ipsum dolor sit"
}
```

If the post is successful, the following `200` will be sent...

```json
{
    "msg": "Successfully posted message!"
}
```

If you forget the `title` or `content`, the following `400` will be sent...

```json
{
    "msg": "A request must contain a 'title' and 'content'"
}
```

If authentication fails (such as an expired token), the following `401` will be sent...

```json
{
    "msg": "You must be logged in to make a post!"
}
```

If a chatroom is specified that does not exist, a `404` will be returned.

```json
{
    "msg": "The specified chatroom does not exist. Chatroom names are case-sensitive."
}
```

If the `title` is longer than 128 characters or if the `content` is longer than 1024 characters, the following `413` will be sent...
```json
{
    "msg": "'title' must be 128 characters or fewer and 'content' must be 1024 characters or fewer"
}
```

### Deleting a Message
`DELETE` `https://cs571.org/s23/hw10/api/chatroom/:chatroomName/messages/:messageId`

Deleting a message is an authorized operation; you must have a valid `Authorization` session. The `:chatroomName` and `:messageId` must be specified in the URL.

There is no request body for this request.

If the delete is successful, the following `200` will be sent...

```json
{
    "msg": "Successfully deleted message!"
}
```

If authentication fails (such as an expired token), the following `401` will be sent...

```json
{
    "msg": "You must be logged in to make a post!"
}
```

If you try to delete another user's post, the following `401` will be sent...

```json
{
    "msg": "You may not delete another user's post!"
}
```

If a chatroom is specified that does not exist, a `404` will be returned.

```json
{
    "msg": "The specified chatroom does not exist. Chatroom names are case-sensitive."
}
```

If a message is specified that does not exist, a `404` will be returned.

```json
{
    "msg": "That message does not exist!"
}
```

### Who Am I?
`GET` `https://cs571.org/s23/hw10/api/whoami`

WhoAmI is an authorized operation; you must have a valid `Authorization` session. This endpoint will check if a user is logged in and who they claim to be, including when their token was issued and when it will expire in Unix epoch time.

This request must include an `Authorization` header. There is no request body for this request.

The following `200` will be sent...

```json
{
    "user": {
        "id": 1,
        "username": "acct123",
        "iat": 1677545250,
        "exp": 1677548850
    }
}
```

If the user is not logged in or has an invalid/expired session, the following `401` will be sent...

```json
{
    "msg": "Missing valid 'Authorization' header. Are you logged in?"
}
```
