# crud.py
from __future__ import annotations
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.hash import bcrypt

from .models import EmployeeRegistration, EmployeeDetails
from .schemas import RegistrationCreate, EmployeeDetailsCreate

# --- Registration ------------------------------------------------------------

async def create_registration(session: AsyncSession, data: RegistrationCreate) -> EmployeeRegistration:
    reg = EmployeeRegistration(
        username=data.username,
        password_hash=bcrypt.hash(data.password),  # Hash with your policy/MFA elsewhere
        email=data.email,
        phone_number=data.phone_number,
        first_name=data.first_name,
        last_name=data.last_name,
        dob=data.dob,
        gender=data.gender,
        marital_status=data.marital_status,
        reg_status="Pending",
    )
    session.add(reg)
    await session.flush()  # gets registration_id
    await session.commit()
    await session.refresh(reg)
    return reg

async def approve_registration(session: AsyncSession, registration_id: int, hr_employee_id: Optional[int]) -> EmployeeRegistration:
    reg = await session.scalar(
        select(EmployeeRegistration).where(EmployeeRegistration.registration_id == registration_id)
    )
    if not reg:
        raise ValueError("Registration not found")
    reg.reg_status = "Approved"
    reg.approved_by_hr = hr_employee_id
    await session.commit()
    await session.refresh(reg)
    return reg


# --- Employee details --------------------------------------------------------

async def create_employee_from_registration(session: AsyncSession, registration_id: int, data: EmployeeDetailsCreate) -> EmployeeDetails:
    # ensure registration exists
    reg = await session.scalar(
        select(EmployeeRegistration).where(EmployeeRegistration.registration_id == registration_id)
    )
    if not reg:
        raise ValueError("Registration not found")

    emp = EmployeeDetails(
        registration_id=registration_id,
        profile_photo=data.profile_photo,
        work_email=data.work_email or f"{reg.username}@myapp.com",
        phone_number=data.phone_number or reg.phone_number,
        pan_number=data.pan_number,
        aadhar_number=data.aadhar_number,
        father_name=data.father_name,
        mother_name=data.mother_name,
        emergency_phone_number=data.emergency_phone_number,
        nationality=data.nationality,
        hire_date=data.hire_date,
        job_title=data.job_title,
        department_id=data.department_id,
        role_id=data.role_id,
        current_address_id=data.current_address_id,
        permanent_address_id=data.permanent_address_id,
        base_location=data.base_location,
        gender=data.gender,
        marital_status=data.marital_status,
        employee_status=data.employee_status,
    )

    session.add(emp)
    await session.flush()
    # mark registration as converted (optional)
    reg.reg_status = "Converted"
    await session.commit()
    await session.refresh(emp)
    return emp


async def get_employee_with_registration(session: AsyncSession, employee_id: int) -> Optional[tuple[EmployeeDetails, EmployeeRegistration]]:
    stmt = (
        select(EmployeeDetails, EmployeeRegistration)
        .join(EmployeeRegistration, EmployeeDetails.registration_id == EmployeeRegistration.registration_id, isouter=True)
        .where(EmployeeDetails.employee_id == employee_id)
    )
    return await session.first(stmt)
