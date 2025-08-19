# schemas.py
from __future__ import annotations
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr

class RegistrationBase(BaseModel):
    username: str
    email: EmailStr
    phone_number: Optional[str] = None
    first_name: str
    last_name: str
    dob: date
    gender: str
    marital_status: str

class RegistrationCreate(RegistrationBase):
    password: str = Field(min_length=8)

class RegistrationOut(RegistrationBase):
    registration_id: int
    reg_status: str
    approved_by_hr: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    model_config = dict(from_attributes=True)


class EmployeeDetailsBase(BaseModel):
    registration_id: Optional[int] = None
    work_email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    profile_photo: Optional[str] = None
    pan_number: str
    aadhar_number: str
    father_name: str
    mother_name: str
    emergency_phone_number: Optional[str] = None
    nationality: Optional[str] = None
    hire_date: date
    job_title: Optional[str] = None
    department_id: Optional[int] = None
    role_id: Optional[int] = None
    current_address_id: Optional[int] = None
    permanent_address_id: Optional[int] = None
    base_location: str
    gender: str
    marital_status: str
    employee_status: str = "Active"

class EmployeeDetailsCreate(EmployeeDetailsBase):
    pass

class EmployeeDetailsOut(EmployeeDetailsBase):
    employee_id: int
    created_at: datetime
    updated_at: datetime
    model_config = dict(from_attributes=True)
