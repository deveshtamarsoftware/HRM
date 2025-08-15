# main.py
from fastapi import FastAPI, Depends, HTTPException, Form, File, UploadFile, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from connectdbsqlite.db import Base, engine, SessionLocal
import time
from connectdbsqlite.models import User
from connectdbsqlite.crud import DATABASE_URL, hello_world
from pydantic import BaseModel # Pydantic is used for data validation and serialization
from typing import List, Optional
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from connectdbsqlite.schemas import UserCreate, UserUpdate, UserOut
# from fastapi_pagination import Page, add_psagination, paginate
# from fastapi_pagination.ext.sqlalchemy import paginate as sqlalchemy_paginate
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
# logger.info("This is an info message")
# logger.warning("This is a warning")
# logger.error("This is an error")


# Base.metadata.drop_all(bind=engine) # Uncomment this line to drop all tables before creating them
Base.metadata.create_all(bind=engine)
app = FastAPI()
# add_pagination(app)

@app.middleware("http") #This logs each HTTP request like:
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    print(f"Request: {request.method} {request.url.path} completed in {duration}ms")

    logging.info(f"{request.method} {request.url.path} completed in {duration}ms")
    return response

def process_notification(email, message: str):
    time.sleep(1000)
    print(f"sending email to {email}, message : {message}")

@app.post("/send-notifications/{email}")
async def send_notification(email: str, background_tasks: BackgroundTasks):
    message = "hello how are you...?"
    # process_notification(email, message)
    background_tasks.add_task(process_notification, email, message)
    return {"message": "Notification sent to the background task."}

# Create a limiter instance
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Apply rate limit to a route
@app.get("/limited")
@limiter.limit("5/minute")  # ⏱️ 5 requests per minute per IP
async def limited_endpoint(request: Request):
    return {"message": "You're within the rate limit!"}

def get_db(): # request db session for each request
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")  # Decorator for GET requests to the root URL
async def read_root():
    """Root endpoint that returns a simple message. """
    return {"message": "Hello, World!"}

@app.post("/users/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(name=user.name, age=user.age, email=user.email, password=user.password) 
    # db_user = User(**user.dict()) # Unpack the user data into the User model

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/hello-world/")
def read_hello():
    print('DATABASE_URL', DATABASE_URL) # Print the hello_world function output
    msg = hello_world() # Call the hello_world function
    return msg

@app.get("/users/")
def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.get("/users-pagination/", response_model=List[UserOut])
def read_users_pagination(skip:int=0, limit:int=10, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return db.query(User).offset(skip).limit(limit).all()

@app.get("/users-by-id/{user_id}", response_model=List[UserOut])
def read_users_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).all()
    print(user) 
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
 
@app.put("/users/{user_id}", response_model=UserOut)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.name = user.name if user.name is not None else db_user.name
    db_user.age = user.age if user.age is not None else db_user.age
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"ok": True}

@app.post("/login")
# def login(username: str, password: str):
#     db = SessionLocal()
#     user = db.query(User).filter(User.name == username).first()
#     if not user or user.password != password:
#         raise HTTPException(status_code=401, detail="Invalid credentials")
#     return {"ok": True}
def login(username:str = Form(...), password: str = Form(...)):
    db = SessionLocal()
    user = db.query(User).filter(User.name == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    else:
        print(user.__dict__)
        print(vars(user)) #Same as __dict__, but a bit cleaner in some contexts.
        logging.info(f"User found: {user.name}")

    return {"username": username, "message": 'Login successful'}

@app.post('/uploadfile/file')
async def upload_file(file: UploadFile = File(...)):
    logging.info(f"Received file: {file.filename}, Content type: {file.content_type}")
    return {"filename": file.filename, "content_type": file.content_type, "file_size": len(file.file.read())}


@app.post('/uploadfile/')
async def save_upload_file(file: UploadFile = File(...)):
    logging.info(f"Received file: {file.filename}, Content type: {file.content_type}")
    # Save the file to a local directory
    with open(f'uploads/{file.filename}', "wb") as f:
        f.write(await file.read())
    logging.info(f"File {file.filename} saved successfully.")
    return {"filename": file.filename, "message": "File uploaded successfully"}     


@app.post('/upload-multiple-files/')
async def upload_multiple_files(files: List[UploadFile] = File(...)):
    for file in files:
        logging.info(f"Received file: {file.filename}, Content type: {file.content_type}")
        with open(f'uploads/{file.filename}', "wb") as f:
            f.write(await file.read())
        logging.info(f"File {file.filename} saved successfully.")
    return {"message": "Files uploaded successfully"}

