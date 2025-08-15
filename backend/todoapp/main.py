from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, todos, users
from database import engine, Base

# Create the FastAPI app instance
app = FastAPI()

# Include CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, you can specify a list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)   

# Create the database tables
Base.metadata.create_all(bind=engine)   

# hello world endpoint
@app.get("/")
async def root():
    return {"message": "Hello World"}

# Include the routers for authentication, todos, and users
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(todos.router, prefix="/todos", tags=["todos"])
app.include_router(users.router, prefix="/users", tags=["users"])
