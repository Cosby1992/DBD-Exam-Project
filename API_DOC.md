# API documentation

This is the documentation for the chat-system API.
The documentation are listed by category, Users, Friends, Messages.

## Shortcuts

[Go to users](#Users) <br>
[Go to friends](#Friends) <br>
[Go to messages](#Messages) <br>
[Go to errors](#Errors) <br>

## Endpoints

All endpoints should be an extention to http://localhost:3000 

---

### Users

---

### **Create a new user**

POST /users

```
// Json request body
{
	"email": "user@usersite.dk",
	"password": "secretpass",
	"displayname": "Cool User",
	"firstname": "John",
	"lastname": "Doe",
	"age": 30,
	"gender": "MALE"
}
```

Response

```
// Status code: 200
// Json response body
{
	"insertedId": "60b52c349103910020b0a4a6",
	"insertedCount": "1",
}
```

---

### **Get user from userId**

GET /users?id=\<some-user-id\>

Response

```
// Status code: 200
// Json response body
{
  "_id": "60b52c349103910020b0a4a6",
  "email": "user@usersite.dk",
	"password": "secretpass",
	"displayname": "Cool User",
	"firstname": "John",
	"lastname": "Doe",
}
```

[Back to top ↑](#API-documentation) <br>

---

### Friends

---

### **Create a friends relation**

POST /friends

```
// Json request body
{
	"id1": "b032365bec874d79a8056ad9cc330a71",
	"id2": "41ae6748bdaf4a90838a5da0e8e36291"
}
```

Response

```
// Status code: 200
// Json response body
{
    "message": "Friend request was created succesfully"
}
```

---

### **Get all friends from userId**

GET /friends?id=\<some-user-id\>

Response

```
// Status code: 200
// Json response body
{
  "friends": [
    {
      "user": {
        "id": "14c4845e-6b85-4d77-8c34-99253c3409ae",
        "age": 48,
        "gender": "Two-spirit person"
      }
    },
    {
      "user": {
        "id": "45f03650-a420-4279-9075-987548753662",
        "age": 57,
        "gender": "Genderqueer"
      }
    }
  ]
}
```

---

### **Get all friends from userId**

GET /friends/recommendations?id=\<some-user-id\>

Response

```
// Status code: 200
// Json response body
// OBS: friend recommandations are limited to 20 results
{
  "recommendations": [
    {
      "friend": {
        "id": "135c79a0-d149-464b-840d-32f419cd7971",
        "age": 27,
        "gender": "Two* person"
      },
      "numberOfCommonFriends": 3
    },
    {
      "friend": {
        "id": "449ca6f9-aa20-41a8-9284-5ef44954c648",
        "age": 52,
        "gender": "Male to female trans woman"
      },
      "numberOfCommonFriends": 2
    },
    {
      "friend": {
        "id": "c03f75ec-6579-43e3-a319-39fc115d1fea",
        "age": 33,
        "gender": "Transgender Person"
      },
      "numberOfCommonFriends": 2
    }
  ]
}
```

[Back to top ↑](#API-documentation) <br>

---

### Messages

---

### **Send a message**

POST /messages

```
// Json request body
{
	"from": "4860a872-9a5d-473f-80ce-ff211ab49c40",
	"to": "7ee2569e-5c2f-4a72-b175-a589518d3e26",
	"message": "Hey there..."
}
```

Response

```
// Status code: 200
// Json response body
{
  "message": "OK"
}
```

---

### **Get conversation**

GET /messages?from=\<from-user-id\>&to\<to-user-id>

Response

```
// Status code: 200
// Json response body
{
  "messages": [
    {
        "user": "4860a872-9a5d-473f-80ce-ff211ab49c40",
        "timestamp": "1622500653933",
        "message": "Hey there..."
    },
    {
        "user": "7ee2569e-5c2f-4a72-b175-a589518d3e26",
        "timestamp": "1622500697033",
        "message": "General Kanobi"
    }
  ]
}
```

[Back to top ↑](#API-documentation) <br>

---

### Errors

---

If the request is not completed in the expected way, the API will respond with non 200 response codes. Examples of error responses can be found here:

Error Response Example 1

```
// Status code: 500
// Json response body
{
  "error": "Failed to contact database."
}
```

Error Response Example 2

```
// Status code: 409 (Duplicate entry)
// Json response body
{
  "error": "The email already exists in the database."
}
```

Error Response Example 3

```
// Status code: 404 (Not found)
// Json response body
{
    "error": "No user found with id: 4860a872-9a5d-473f-80ce-ff211ab49c40"
}
```

Error Response Example 4

```
// Status code: 400 (Bad request)
// Json response body
{
    error: "Missing params: id, age or gender"
}
```

[Back to top ↑](#API-documentation) <br>
