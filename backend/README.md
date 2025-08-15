# Python

## Why fast Api
 - Async by default, morden framwork to build fast, high performance production ready code.
 - easy to define route, error handling
 - Swagger ready, based on giants: starlette(for web part) & pydentic(for data parts)
 - large communit support
 - easy to use
 - Djngo is hevey weight

# View the application
 - http://127.0.0.1:8000/ (html view)
 - http://127.0.0.1:8000/docs (Swager view)
 - http://127.0.0.1:8000/redoc (diffrent swager view)
 - http://127.0.0.1:8000/openapi.json (Json View)
 - https://jwt.io/

## Start fastAPI
 - pip install fastapi
 - pip install fastapi[all] ths will install every thing including uvicorn
 - pip install "uvicorn[standard]" - helps to run the fast api like 
 - pip install python-multipart sqlalchemy jinja2
 - python -m uvicorn main:app --reload
 - python -m uvicorn connectdb.maindb:app --reload   - connectdb.maindb(folder(connectdb) structure with __init__)
## Install Python Adding modules with pip
Manual
```
$ python -m venv .venv
$ .venv\Scripts\activate  # On Windows

- Install dependencies & create requirnmet.txt file
    $ pip install fastapi uvicorn numpy  # or whatever your app uses
    $ pip freeze > requirements.txt
    $ add [fastapi, uvicorn[standard]]
    $ pip install -r requirements.txt
    $ pip list #listing the installed package

<!-- $ pip list
$ create requirements.txt file 
$ add [fastapi, uvicorn[standard]]
$ pip install -r .\requirements.txt -->

```
With Code
```
- Setting up vs code with extention
  - ms-python.python
  - ms-python.vscode-pylance
  - ms-python.debugpy

- Download and install python - Go to the official site: python.org/downloads, Click “Download Python 3.x.x” (stable version)
- Double-click the downloaded .exe file, 
  - Important: Check the box that says “Add Python to PATH”
  - Click “Install Now”
  - python --version
  - pip --version
- create python main.py, add print("Hello, Python on Windows!"), and run "python main.py"

```
#### Sharing your program create virtual Environment
```
- Navigate to your project folder: 
    $ cd your_project_folder

- Activate Environment & isolate dependencies
    $ python -m venv venv
    $ venv\Scripts\activate  # On Windows

- Install dependencies & create requirnmet.txt file
    $ pip install fastapi uvicorn numpy  # or whatever your app uses
    $ pip freeze > requirements.txt
    $ pip install -r requirements.txt
    $ pip list #listing the installed package

- Oher commands    
    $ python -m pip install --upgrade pip
    $ pip search package_name
    $ pip install pyinstaller

- Install standard or all
    $ pip install fastapi[standard]  # install the standard version
      - installs - pydantic(email-validator), starlette(httpx, jinja2, python-multipart), uvicorn
    $ pip install fastapi[all]       # install every thing of fastapi
```
#### How to download and run other project
```
    $ Clone the repo and download the folder 
    $ Create Virtual environment & activate it
      - python -m venv venv
      - venv\Scripts\activate  # On Windows
      - deactivate #exit virtual environment
    $ Install dependencies
      - pip freeze > requirements.txt	# Save installed package
      - Add below in the file
            fastapi==0.110.0
            uvicorn==0.29.0
            sqlalchemy==2.0.30
      - pip install -r requirements.txt # install dependencies
      - python -m pip install --upgrade pip # Update dependency 
    $ Run the project
      -  python -m uvicorn main:app --reload  
          - Python - run the python installed in machine
          - -m -> module mode, tell to run the modules, as if they are script 
          - uvicorn - ASGI web server to run backend and handle request, i.e python
          - main:app -  app is instance from (app = FastAPI()), main is file name called main.py
          - --reload -> flag help to restart automatically 
    $ Other commands
      - uvicorn main:app --reload	Start FastAPI with auto-reload for development
      - uvicorn main:app --host 0.0.0.0 --port 8080	Run on all n/w interfaces, custom port
      - uvicorn main:app --workers 4	Run with multiple worker processes
      - uvicorn main:app --reload --log-level debug	Enable debug logs
```
#### URL
```
      - https://pypi.org/search/?q=fastapi&o=  #serach like npm 
      - https://docs.python.org/3/tutorial/    # learn python from offical document
      - https://fastapi.tiangolo.com/learn/
      - https://github.com/codingwithroby/FastAPI-The-Complete-Course
```

### Learn Python
 - [Read for Python Basic language loop,array](./docs/python-basic-learning.md)
 - [Read for Python fastapi](https://github.com/fastapi/fastapi)
 - [Read for Pydantic & Starlette](./docs/python-web-tools.md)

## Working Directory
```
fistpyapi/
├── .env
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── main.py
├── app/
│   ├── __init__.py
│   ├── core/
│   │   ├── config.py            # Environment config & settings
│   │   └── security.py          # Auth/JWT handling
│   ├── models/
│   │   └── user.py              # SQLAlchemy or Pydantic models
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   └── user_routes.py   # e.g., /v1/users
│   │   └── v2/
│   │       ├── __init__.py
│   │       └── user_routes.py   # e.g., /v2/users
│   ├── services/
│   │   └── user_service.py      # Business logic
│   ├── db/
│   │   ├── base.py
│   │   ├── models.py
│   │   └── session.py           # DB connection setup
│   └── schemas/
│       └── user_schema.py       # Pydantic request/response models
└── tests/
    └── test_users.py
```

## Learn Python from UDEMY
 - https://fastapi.tiangolo.com/tutorial/first-steps/ (fast api documents)
 - https://github.com/Pierian-Data/Complete-Python-3-Bootcamp
 - https://www.youtube.com/watch?v=iWS9ogMPOI0 (Python FastAPI Tutorial: Build a REST API in 15 Minutes)
 - https://youtu.be/VFu95RjLSQ8 (FastAPI: Basics to Advanced Concepts, 3hrs)
 - https://github.com/ArjanCodes/2023-fastapi
 - https://www.youtube.com/watch?v=SORiTsvnU28

- use can use the simple rest client or postman to run it.
 - curl -X "POST" "http://127.0.0.1:8000/" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"foo\": \"bar\"}"
 - curl -X POST -H "Content-Type: application/json" "http://127.0.0.1:8000/items?item=apple" 
 - curl -X GET http://127.0.0.1:8000/items/2 
 - $ curl -X GET 'http://127.0.0.1:8000/items?limit=2'

## BaseModel
In FastAPI, BaseModel comes from Pydantic and is used for data validation and serialization. It helps define structured data models, ensuring that incoming and outgoing data follows a specific format.
### Key Uses of BaseModel in FastAPI:
 - Automatic Data Validation – Ensures that request data matches the expected types.
 - Serialization & Deserialization – Converts Python objects into JSON and vice versa.
 - Improved API Documentation – FastAPI automatically generates OpenAPI docs based on BaseModel.
 - Default Values & Constraints – Allows setting default values and validation rules
 - Path and Query are used to define and validate parameters in API routes.

## Learn more about - Step by step
 - https://realpython.com/fastapi-python-web-apis/

#### HTTP request methods:
  - POST
  - GET
  - PUT
  - DELETE
  - OPTIONS
  - HEAD
  - PATCH
  - TRACE


#### You can also use the other operations mentioned above:
  - @app.post()
  - @app.put()
  - @app.delete()
  - @app.options()
  - @app.head()
  - @app.patch()
  - @app.trace()

difference between normal functions and async functions and when to use them


##### Data Handling With pydantic : data validation
  -  str, float, bool

##### Request Body: Receiving JSON Data
  - Use "pydantic" to Declare JSON Data Models (Data Shapes)
  - import BaseModel from pydantic and then use it to create subclasses defining the schema, or data shapes, you want to receive.
  
  ```
    from typing import Optional
    from pydantic import BaseModel

    class Item(BaseModel):
      name: str
      description: Optional[str] = None
      price: float
      tax: Optional[float] = None  

    @app.post("/items/")
    async def create_item(item: Item):
        return item

  ```
#### Which Python Framework is best? Django vs Flask vs FastAPI
- https://www.youtube.com/watch?v=3vfum74ggHE
- https://github.com/patrickloeber/python-fun/tree/master/webapps

## Request Body and Path Parameters
You can declare path parameters and a request body at the same time.
    ```
    @app.put("/items/{item_id}")
    async def create_item(item_id: int, item: Item):
        return {"item_id": item_id, **item.dict()}
    ```

##### ORM:
sqlalchemy (pip install sqlalchemy)


##### Connecting Sql light
```
D:\sites\LearnPython\fistpyapi>sqlite3
sqlite> .schema
sqlite>  create table todos (id INTEGER NOT NULL, title VARCHAR,desc VARCHAR, PRIMARY KEY (id));
sqlite>  
    insert into todos (id, title, desc)values (1, 'Tero No1', 'Tero No 1 is the title');
    insert into todos (id, title, desc)values (2, 'Tero No2', 'Tero No 2 is the title');
    insert into todos (id, title, desc)values (3, 'Tero No3', 'Tero No 3 is the title');
sqlite>  insert into todos where id=2;
sqlite> select * from todos;
    1|BookDay|THIS IS ABOUT THE HOME PAGE

sqlite> .mode column
sqlite> select * from todos;
id  title    desc
--  -------  ---------------------------
1   BookDay  THIS IS ABOUT THE HOME PAGE


sqlite> .mode markdown
sqlite> select * from todos;
| id  | title   | desc                        |
| --- | ------- | --------------------------- |
| 1   | BookDay | THIS IS ABOUT THE HOME PAGE |


sqlite> .mode box
sqlite> .mode table
sqlite> select * from todos;
┌────┬─────────┬─────────────────────────────┐
│ id │  title  │            desc             │
├────┼─────────┼─────────────────────────────┤
│ 1  │ BookDay │ THIS IS ABOUT THE HOME PAGE │
└────┴─────────┴─────────────────────────────┘

How to connect and run the SQLITE table:
$ sqlite3 todoapp.db
sqlite> select * from users;
```

### Install Sqlite
#### To install SQLite3 on Windows 10, follow these steps:
 - Download SQLite Tools Go to the official SQLite download page and look for the section titled "Precompiled Binaries for Windows". Download the file named sqlite-tools-win-x64-*.zip (or win-x86 if you're on 32-bit).
 - Extract the ZIP File Extract the contents to a folder, for example: C:\sqlite. Inside, you’ll find sqlite3.exe, which is the command-line tool.
 - Add SQLite to System Path (Optional but Recommended)
   - Open the Start menu, search for Environment Variables, and click Edit the system environment variables.
   - In the System Properties window, click Environment Variables.
   - Under System variables, find and select Path, then click Edit.
   - Click New and add the path to your SQLite folder (e.g., C:\sqlite).
   - Click OK to close all windows.
 - Verify Installation Open Command Prompt and type: sqlite3
 - pip install fastapi uvicorn sqlalchemy

### Setting up database and models
```
# db.py
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

```

### Create a Virtual Environment use command 
```
1. Create environment
python -m venv venv
venv\Scripts\activate   # For Windows, use source for mac
pip install fastapi uvicorn sqlalchemy pydantic fastapi-pagination

2. Freeze Installed Packages into requirements.txt
pip freeze > requirements.txt

3. This creates a requirements.txt like:
fastapi==0.110.0
uvicorn==0.29.0
sqlalchemy==2.0.30
pydantic==2.7.1
fastapi-pagination==0.12.24
(Optional: You can manually edit this file to remove unneeded dependencies.)

4. Installing from requirements.txt Later
To recreate your environment on another machine:
  pip install -r requirements.txt

or 
Option 2: Use a Clean Virtual Environment Sometimes starting fresh helps:

python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt

Update dependency 
python -m pip install --upgrade pip

```

### Logging
```
import logging

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
# logger.info("This is an info message")
# logger.warning("This is a warning")
# logger.error("This is an error")

```


### Docker:
```
# Use official Python image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]



docker build -t my-fastapi-app .
docker run -d -p 8000:8000 my-fastapi-app

```

```
python -m uvicorn main:basic --reload


docker build -t my-fastapi-app .
docker run -d -p 8000:8000 my-fastapi-app


**************
## use command line
python -m venv venv
venv\Scripts\activate  # On Windows
--> add file to requirement.txt
pip install -r requirements.txt

```

### Module not installed
```
python --version
pip --version
If they don’t match, use:

python -m pip install pyodbc
🧪 Step 3: Test the Install
After installing, test it in Python:

python
import pyodbc
print(pyodbc.version)
```

## Module not found issue
```
ModuleNotFoundError: No module named 'numpy'
Fix
pip install numpy


Multiple Python Versions: If you have multiple Python versions installed on your system, ensure you are using the pip command associated with the Python interpreter you intend to use for your project. Sometimes, you might need to use pip3 instead of pip, or even 
$ python -m pip install numpy.
```
#### Linking read me files
```
Assume this folder structure:

project/
├── README.md
├── docs/
│   └── guide.md
└── tutorial/
    └── intro.md
✅ Link from README.md to docs/guide.md:
    [Read the Guide](docs/guide.md)
✅ Link from docs/guide.md to tutorial/intro.md:
markdown
    [Go to Intro](../tutorial/intro.md)
✅ Link from tutorial/intro.md back to root README.md:
    [Back to Home](../README.md)
    
    
💡 Tips
- Use %20 for spaces in filenames: [My File](docs/My%20File.md)
- Use ./ for current directory and ../ to go up one level
- GitHub automatically renders these links in the web UI
```


### Status Codes
```
You can import the status module from fastapi: status is provided directly by Starlette

from fastapi import FastAPI, status
app = FastAPI()

@app.get("/items/", status_code=status.HTTP_418_IM_A_TEAPOT)
def read_items():
    return [{"name": "Plumbus"}, {"name": "Portal Gun"}]

https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml

```

