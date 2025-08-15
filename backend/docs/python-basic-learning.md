## Learn Python

 - [Back to main](../README.md)

# Educational-Purpose
In this Repository I will share fastapi core concepts for my YouTube subscribers
1. What is Path parameters
2. What is Query parameters
3. Choice field in FastAPI
4. What is Request Body
5. Declare request example data
6. Fastapi Validations
7. Fastapi Form data
8. Fastapi File Upload
9. Fastapi Error Handling
10. Fastapi DataBase Connectivity
11. Fastapi Restful API's
12. Fastapi Nested Models
13. Fastapi OAuth2 with password and hashing jwt token
14. Fastapi Role based uthentication
15. Fastapi Unit Testing
16. https://github.com/Coding-Crashkurse/FastAPI-Auth/tree/main/fastapi/app  (imp link)
17. https://github.com/codingwithroby/FastAPI-The-Complete-Course (basic to master)


### Simple Object
```
class User:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hello, {self.name}!"

u = User("Bob")
print(u.greet())  # Output: Hello, Bob!

```

### Simple List/array Example
'''
# Array
filenames = ["photo1.jpg", "document.pdf", "notes.txt"]
print(filenames[0])         # Output: photo1.jpg
for name in filenames:
    print(f"File: {name}")

**********************
# Array of object
uploaded_files = [
    {"filename": "image.png", "size": 2048},
    {"filename": "report.docx", "size": 4096},
    {"filename": "video.mp4", "size": 1048576}
]

for file in uploaded_files:
    print(f"{file['filename']} is {file['size']} bytes")
'''

### if and for loop 
```
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}")

age = 20
if age >= 18:
    print("You're an adult")
else:
    print("You're a minor")
```

## Working with Dictionaries

```
users = [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25}
]

users.append({"name": "Charlie", "age": 35}) #add
#update
for user in users:
    if user["name"] == "Bob":
        user["age"] = 26

#delete
users = [user for user in users if user["name"] != "Alice"]

```

🧱 Working with Class Objects
```
class User:
    def __init__(self, name, age):
        self.name = name
        self.age = age

users = [
    User("Alice", 30),
    User("Bob", 25)
]

users.append(User("Charlie", 35))
for u in users:
    if u.name == "Bob":
        u.age = 26

users = [u for u in users if u.name != "Alice"]

```

### OOPS
```
class Dog:
    def __init__(self, name, age, name2):
        self.name = name  
        self.age = age   
        self.name2 = name2


d = Dog("buddy", "3", "nick_name")

print("---", d.name)

```


### JWT VS SESSIONS
Token based authentication are done with OAuth, OpenID and JWT. Also use by Facebook, google, Microsoft for single sign on.
Session based approach is used when using web site and token based when using the mobile app.

```
JWT Token have 3 things
 Header {'alg':'HS256', 'typ:'jwt'}
 Payload {'customer_id':'1212221', 'name':'John Doe','create_date':'12/10/2003 12:02:11', 'expiry_date':'12/10/2003 13:02:11'}
 Signature - secret code (header+payload+your-256-bit-secret)

 1. Login with user name/password, send with Authorization HTTP header, only access to subset of the data
 2. Validated user credential - >Generate the JWT Token, with header, signature and payload , and send back to user client
 3. Client send API request(JWT Token) for validation, Validate Token(stateless) on the server, no need db access can be scaled.
 4. After token valid then operation on Database(CURD), till token is valid
 5. When token is expired, it will ask for re-validate the token, means ask for re-login
```
#### Session
Unique identifier and randomly generated for login(just like you get token when you go to clock room to change cloth)
Now day not much used, but long used.
```
1. Login with user name/password, send with Cookies HTTP header, Give access to all information
2. Validated user credential -> Generate the cookies session id with the help of cookies(stateful) and store in db, 
    - new entry in db new table, and send back the cookies and session id to user client
3. Client send API request(session) for validation, Validate Session(stateful) on the server DB. 
    - client will always send the cookies(session id) in http headers
 4. After token valid then operation on Database(CURD), till token is valid
 5. Next request login is not required, until, you logout, 
 6. After logout, it will invalidate the session id in database. If you try to login again you can't do it. You session has expired.
    - it will also ask to delete the browser cookies to be deleted for that session.
 7. When you are logged in, Server will keep checking your activity, if you are inactive for some time then it will expire the cookie session id and ask to login again (banking application-short session/5min, Facebook - long lived session)

 table structure
  - Customer_id
  - loginTime
  - IpAddress
  - UserAgent(phone, internet browser)
  - session_id (**)
```

## Status code
```
1xx - information response
2xx - Success
3xx - Redirect action after completion
4xx - Client error, Error due to client, Authorised access
5xx - Server error, error on the error
```




 - [Back to main](../README.md)


