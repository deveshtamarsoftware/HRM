## installed packages
```
$ pip install python-multipart
$ pip install "python-jose[cryptography]"

$ pip list
$ pip uninstall package-name
```

## connect sqlite db 
```
How to connect and run the SQLITE table:
$ sqlite3 todoapp.db
sqlite> select * from users;
```

## Output
```
{
  "username": "dev",
  "email": "edv@gmail.com",
  "first_name": "dev",
  "last_name": "kum",
  "password": "password",
  "role": "admin"
}

```

JWT TOKEN 

```
access_token

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZXYiLCJpZCI6Miwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUxOTU0MzEzfQ.LV9Xg1ulhG79EdYjOJKTud_l-VyOLaED48WA3WzoWyA

Go to https://jwt.io/ & paste above

Decoded Header
{
  "alg": "HS256",
  "typ": "JWT"
}

Decoded Payload
{
  "sub": "dev",
  "id": 2,
  "role": "admin",
  "exp": 1751954313
}

JWT Signature Verification
 - a-string-secret-at-least-256-bits-long

 ```