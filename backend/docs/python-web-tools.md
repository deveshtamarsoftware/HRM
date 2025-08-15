# 🧠 Learn Pydantic & Starlette — Modern Python Web Tools

 - [Back to main](../README.md)


This guide breaks down the essentials of **Pydantic** and **Starlette**—two powerful libraries for data validation and web development in Python.

---

## 📦 What is Pydantic?

**Pydantic** is a data validation and parsing library that uses Python type hints to enforce rules and structure for incoming and outgoing data.

### 🔍 Why Use Pydantic?
- Automatic data parsing & type conversion
- Clear validation errors
- Strong JSON support
- Great with FastAPI & Starlette

### ✨ Example: Basic Model
```python
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    email: str

# Input dictionary
data = {"id": "123", "name": "Alice", "email": "alice@example.com"}

# Automatic type conversion
user = User(**data)
print(user.id)  # Output: 123
```

## What is Starlette?
Starlette is a fast ASGI framework for building lightweight and asynchronous web APIs. It's the foundation of FastAPI.

🚀 Key Features
- Async request handling
- WebSockets and Background Tasks
- Middleware and dependency injection
- Perfect for microservices and APIs

✨ Example: Hello Starlette
```python
from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route

async def homepage(request):
    return JSONResponse({"message": "Hello, Starlette!"})

app = Starlette(debug=True, routes=[
    Route("/", homepage)
])

Run with: uvicorn main:app --reload
```
 - [Back to main](../README.md)
