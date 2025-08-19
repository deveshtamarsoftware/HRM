from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date
from database import connect
from pymysql.cursors import DictCursor
from passlib.hash import bcrypt

router = APIRouter()

# --------- Schemas ---------
class RegistrationCreate(BaseModel):
    username: str
    password: str
    email: EmailStr
    phone_number: Optional[str] = None
    first_name: str
    last_name: str
    dob: date
    gender: str                       # 'Male','Female','Other','Prefer not to say'
    marital_status: str               # 'Single','Married','Divorced','Widowed','Other'

class RegistrationOut(BaseModel):
    registration_id: int
    username: str
    email: EmailStr
    phone_number: Optional[str]
    first_name: str
    last_name: str
    dob: date
    gender: str
    marital_status: str
    reg_status: str
    approved_by_hr: Optional[int]
    created_at: str
    updated_at: str


# --------- Routes ---------

@router.get("")
def list_registrations():
    conn = connect()
    try:
        with conn.cursor(DictCursor) as cur:
            cur.execute("SELECT * FROM myapp.employee_registration ORDER BY registration_id")
            rows = cur.fetchall()
        return {"registrations": rows}
    finally:
        conn.close()


@router.get("/{registration_id}")
def get_registration(registration_id: int):
    conn = connect()
    try:
        with conn.cursor(DictCursor) as cur:
            cur.execute("SELECT * FROM myapp.employee_registration WHERE registration_id = %s", (registration_id,))
            row = cur.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Registration not found")
        return {"registration": row}
    finally:
        conn.close()


@router.post("", status_code=201)
def create_registration(payload: RegistrationCreate):
    valid_gender = {"Male", "Female", "Other", "Prefer not to say"}
    valid_marital = {"Single", "Married", "Divorced", "Widowed", "Other"}

    if payload.gender not in valid_gender:
        raise HTTPException(400, f"Invalid gender: {payload.gender}")
    if payload.marital_status not in valid_marital:
        raise HTTPException(400, f"Invalid marital_status: {payload.marital_status}")

    conn = connect()
    try:
        with conn.cursor(DictCursor) as cur:
            sql = """
            INSERT INTO myapp.employee_registration
              (username, password_hash, email, phone_number, first_name, last_name, dob, gender, marital_status, reg_status)
            VALUES
              (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'Pending')
            """
            params = (
                payload.username,
                bcrypt.hash(payload.password),   # Secure hash
                payload.email,
                payload.phone_number,
                payload.first_name,
                payload.last_name,
                payload.dob,
                payload.gender,
                payload.marital_status,
            )
            cur.execute(sql, params)
            conn.commit()
            new_id = cur.lastrowid

            cur.execute("SELECT * FROM myapp.employee_registration WHERE registration_id = %s", (new_id,))
            created = cur.fetchone()
            return {"registration": created}
    except Exception as ex:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Could not create registration: {ex}")
    finally:
        conn.close()


@router.put("/{registration_id}/approve")
def approve_registration(registration_id: int, hr_employee_id: Optional[int] = None):
    conn = connect()
    try:
        with conn.cursor(DictCursor) as cur:
            cur.execute(
                "UPDATE myapp.employee_registration SET reg_status='Approved', approved_by_hr=%s WHERE registration_id=%s",
                (hr_employee_id, registration_id),
            )
            conn.commit()
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Registration not found")
            cur.execute("SELECT * FROM myapp.employee_registration WHERE registration_id = %s", (registration_id,))
            row = cur.fetchone()
            return {"registration": row}
    finally:
        conn.close()


@router.delete("/{registration_id}")
def delete_registration(registration_id: int):
    conn = connect()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM myapp.employee_registration WHERE registration_id = %s", (registration_id,))
            conn.commit()
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Registration not found or already deleted")
        return {"message": "Registration deleted successfully"}
    finally:
        conn.close()
