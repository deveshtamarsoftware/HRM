from fastapi import FastAPI, HTTPException
from database import connect
# from routers.employees import router as employees_router
from routers.employee_details import router as employee_details
from routers.employee_registration import router as employee_registration

app = FastAPI()
@app.get("/")
def read_root():
    return {"message": "Welcome to the Employee Management API"}

app.include_router(employee_details, prefix="/api", tags=["employees"]) 
app.include_router(employee_registration, prefix="/registrations", tags=["registrations"]) 

