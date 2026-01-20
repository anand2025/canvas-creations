from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    address: Optional[str] = None
    role: str = "customer"

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: str
    created_at: datetime
