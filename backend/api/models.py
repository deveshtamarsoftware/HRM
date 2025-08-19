# models.py
from __future__ import annotations
from typing import Optional, List
from datetime import date, datetime

from sqlalchemy import (
    String, Integer, Date, DateTime, Enum, ForeignKey, text
)
from sqlalchemy.orm import (
    DeclarativeBase, Mapped, mapped_column, relationship
)

# --- SQLAlchemy Base ---------------------------------------------------------

class Base(DeclarativeBase):
    pass


# --- Enum types --------------------------------------------------------------

GenderEnum = Enum(
    "Male", "Female", "Other", "Prefer not to say",
    name="gender_enum",
)

MaritalStatusEnum = Enum(
    "Single", "Married", "Divorced", "Widowed", "Other",
    name="marital_status_enum",
)

EmployeeStatusEnum = Enum(
    "Active", "Resigned", "On Leave", "Terminated",
    name="employee_status_enum",
)

RegistrationStatusEnum = Enum(
    "Pending", "Approved", "Rejected", "Converted",
    name="registration_status_enum",
)


# --- employee_registration (myapp.employee_registration) ---------------------

class EmployeeRegistration(Base):
    __tablename__ = "employee_registration"
    __table_args__ = {"schema": "myapp"}

    registration_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    username:       Mapped[str] = mapped_column(String(50),  nullable=False, unique=True)
    password_hash:  Mapped[str] = mapped_column(String(255), nullable=False)
    email:          Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    phone_number:   Mapped[Optional[str]] = mapped_column(String(20))
    first_name:     Mapped[str] = mapped_column(String(50),  nullable=False)
    last_name:      Mapped[str] = mapped_column(String(50),  nullable=False)
    dob:            Mapped[date] = mapped_column(Date,       nullable=False)
    gender:         Mapped[str] = mapped_column(GenderEnum,  nullable=False)
    marital_status: Mapped[str] = mapped_column(MaritalStatusEnum, nullable=False)

    reg_status:     Mapped[str] = mapped_column(RegistrationStatusEnum, nullable=False, server_default=text("'Pending'"))
    approved_by_hr: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("myapp.employee_details.employee_id", onupdate="CASCADE", ondelete="SET NULL"))

    created_at:     Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP")
    )
    updated_at:     Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"), onupdate=datetime.utcnow
    )

    # One-to-one to EmployeeDetails (may be None until converted)
    details: Mapped[Optional["EmployeeDetails"]] = relationship(
        back_populates="registration",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    # Who approved this registration (optional relationship)
    approved_by: Mapped[Optional["EmployeeDetails"]] = relationship(
        "EmployeeDetails",
        foreign_keys=[approved_by_hr],
        viewonly=True,
    )


# --- employee_details (myapp.employee_details) -------------------------------

class EmployeeDetails(Base):
    __tablename__ = "employee_details"
    __table_args__ = {"schema": "myapp"}

    employee_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    registration_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("myapp.employee_registration.registration_id", onupdate="CASCADE", ondelete="SET NULL"),
        index=True,
    )

    profile_photo:   Mapped[Optional[str]] = mapped_column(String(255))
    work_email:      Mapped[Optional[str]] = mapped_column(String(100), unique=True)
    phone_number:    Mapped[Optional[str]] = mapped_column(String(20))

    pan_number:      Mapped[str] = mapped_column(String(50),  nullable=False)
    aadhar_number:   Mapped[str] = mapped_column(String(50),  nullable=False)
    father_name:     Mapped[str] = mapped_column(String(50),  nullable=False)
    mother_name:     Mapped[str] = mapped_column(String(50),  nullable=False)
    emergency_phone_number: Mapped[Optional[str]] = mapped_column(String(20))
    nationality:     Mapped[Optional[str]] = mapped_column(String(50))

    hire_date:       Mapped[date] = mapped_column(Date, nullable=False)
    job_title:       Mapped[Optional[str]] = mapped_column(String(100))

    department_id:   Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("myapp.departments.department_id", onupdate="CASCADE", ondelete="SET NULL")
    )
    role_id:         Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("myapp.company_roles.role_id", onupdate="CASCADE", ondelete="SET NULL")
    )
    current_address_id:  Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("myapp.address.address_id", onupdate="CASCADE", ondelete="SET NULL")
    )
    permanent_address_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("myapp.address.address_id", onupdate="CASCADE", ondelete="SET NULL")
    )

    base_location:   Mapped[str] = mapped_column(String(50), nullable=False)
    gender:          Mapped[str] = mapped_column(GenderEnum,  nullable=False)
    marital_status:  Mapped[str] = mapped_column(MaritalStatusEnum, nullable=False)
    employee_status: Mapped[str] = mapped_column(EmployeeStatusEnum, nullable=False, server_default=text("'Active'"))

    supervisor_id:   Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("myapp.employee_details.employee_id", onupdate="CASCADE", ondelete="SET NULL")
    )
    hr_id:           Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("myapp.employee_details.employee_id", onupdate="CASCADE", ondelete="SET NULL")
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP")
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP"), onupdate=datetime.utcnow
    )

    # Relationships
    registration: Mapped[Optional[EmployeeRegistration]] = relationship(
        back_populates="details"
    )

    supervisor: Mapped[Optional["EmployeeDetails"]] = relationship(
        remote_side="EmployeeDetails.employee_id",
        foreign_keys=[supervisor_id],
        post_update=True,
    )

    hr: Mapped[Optional["EmployeeDetails"]] = relationship(
        remote_side="EmployeeDetails.employee_id",
        foreign_keys=[hr_id],
        post_update=True,
    )

    # If you have models for Department, Role, Address, add relationships here.
    # Example:
    # role: Mapped[Optional["CompanyRole"]] = relationship("CompanyRole")
    # department: Mapped[Optional["Department"]] = relationship("Department")
