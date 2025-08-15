from typing import List, Union
from pydantic import BaseModel
from typing import List, Optional


class UserCreate(BaseModel):
    name: str
    age: int
    email:str
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    email: Optional[str] = None
    password: Optional[str] = None

class UserOut(BaseModel):
    id: int
    name: str
    age: int
    email: str
    password: str
    class Config:
        from_attributes  = True