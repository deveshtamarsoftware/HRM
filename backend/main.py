from fastapi import FastAPI, HTTPException
from database import connect
# from routers.employees import router as employees_router
from routers.employee_details import router as employee_details
from routers.employee_registration import router as employee_registration
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Vite dev server origins
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # or ["*"] for dev-only, if no credentials
    allow_credentials=True,         # set True only if you use cookies/auth headers
    allow_methods=["*"],            # or ["GET","POST","PUT","DELETE","OPTIONS"]
    allow_headers=["*"],            # e.g. ["Authorization","Content-Type"]
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Employee Management API"}

app.include_router(employee_details, prefix="/api", tags=["employees"]) 
app.include_router(employee_registration, prefix="/registrations", tags=["registrations"]) 

