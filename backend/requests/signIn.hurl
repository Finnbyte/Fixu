POST http://localhost:3000/api/session
{
    "email": "matti.mattinen@gmail.com",
    "password": "Password123"
}
HTTP 204
[Asserts]
cookie "Authorization" exists