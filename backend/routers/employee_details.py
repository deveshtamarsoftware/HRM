from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from database import connect  # your existing function
from pymysql.cursors import DictCursor
from datetime import date

router = APIRouter()

# --------- Schemas ---------
class EmployeeCreate(BaseModel):
    registration_id: Optional[int] = None
    profile_photo: Optional[str] = None
    work_email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
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
    gender: str                       # 'Male','Female','Other','Prefer not to say'
    marital_status: str               # 'Single','Married','Divorced','Widowed','Other'
    employee_status: Optional[str] = "Active"  # default

# --------- Routes ---------

@router.get("")
def get_employees():
    conn = connect()
    try:
        with conn.cursor(DictCursor) as cur:
            cur.execute(
                """
                SELECT
                  e.*,
                  r.username AS reg_username,
                  r.email    AS reg_email
                FROM myapp.employee_details e
                LEFT JOIN myapp.employee_registration r
                  ON r.registration_id = e.registration_id
                ORDER BY e.employee_id
                """
            )
            rows = cur.fetchall()
        return {"employees": rows}
    finally:
        conn.close()


@router.get("/{employee_id}")
def get_employee(employee_id: int):
    conn = connect()
    try:
        with conn.cursor(DictCursor) as cur:
            cur.execute(
                """
                SELECT
                  e.*,
                  r.username AS reg_username,
                  r.email    AS reg_email
                    FROM myapp.employee_details e
                    LEFT JOIN myapp.employee_registration r
                    ON r.registration_id = e.registration_id
                    WHERE e.employee_id = %s
                """,
                (employee_id,),
            )
            row = cur.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Employee not found")
        return {"employee": row}
    finally:
        conn.close()


@router.post("", status_code=201)
def add_employee(payload: EmployeeCreate):
    # Minimal validation for enum-like fields (optional – MySQL will also enforce)
    valid_gender = {"Male", "Female", "Other", "Prefer not to say"}
    valid_marital = {"Single", "Married", "Divorced", "Widowed", "Other"}
    valid_emp_status = {"Active", "Resigned", "On Leave", "Terminated"}

    if payload.gender not in valid_gender:
        raise HTTPException(400, f"Invalid gender: {payload.gender}")
    if payload.marital_status not in valid_marital:
        raise HTTPException(400, f"Invalid marital_status: {payload.marital_status}")
    if payload.employee_status and payload.employee_status not in valid_emp_status:
        raise HTTPException(400, f"Invalid employee_status: {payload.employee_status}")

    conn = connect()
    try:
        with conn.cursor(DictCursor) as cur:
            sql = """
            INSERT INTO myapp.employee_details
              (registration_id, profile_photo, work_email, phone_number,
               pan_number, aadhar_number, father_name, mother_name,
               emergency_phone_number, nationality, hire_date, job_title,
               department_id, role_id, current_address_id, permanent_address_id,
               base_location, gender, marital_status, employee_status)
            VALUES
              (%s,%s,%s,%s,
               %s,%s,%s,%s,
               %s,%s,%s,%s,
               %s,%s,%s,%s,
               %s,%s,%s,%s)
            """
            params = (
                payload.registration_id,
                payload.profile_photo,
                payload.work_email,
                payload.phone_number,
                payload.pan_number,
                payload.aadhar_number,
                payload.father_name,
                payload.mother_name,
                payload.emergency_phone_number,
                payload.nationality,
                payload.hire_date,
                payload.job_title,
                payload.department_id,
                payload.role_id,
                payload.current_address_id,
                payload.permanent_address_id,
                payload.base_location,
                payload.gender,
                payload.marital_status,
                payload.employee_status,
            )
            cur.execute(sql, params)
            conn.commit()
            new_id = cur.lastrowid

            # (Optional) mark registration as Converted when linked
            if payload.registration_id:
                cur.execute(
                    "UPDATE myapp.employee_registration SET reg_status='Converted' WHERE registration_id=%s",
                    (payload.registration_id,),
                )
                conn.commit()

            # return the created row
            cur.execute(
                """
                SELECT e.*, r.username AS reg_username, r.email AS reg_email
                FROM myapp.employee_details e
                LEFT JOIN myapp.employee_registration r
                  ON r.registration_id = e.registration_id
                WHERE e.employee_id = %s
                """,
                (new_id,),
            )
            created = cur.fetchone()
            return {"employee": created}
    except Exception as ex:
        # Common causes: FK mismatch (registration_id/role_id/department_id), duplicate work_email, enum mismatch
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Could not create employee: {ex}")
    finally:
        conn.close()


@router.delete("/{employee_id}")
def delete_employee(employee_id: int):
    conn = connect()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM myapp.employee_details WHERE employee_id = %s", (employee_id,))
            conn.commit()
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Employee not found or already deleted")
        return {"message": "Employee deleted successfully"}
    finally:
        conn.close()