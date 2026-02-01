from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime, date
from typing import Optional
from enum import Enum
import re

class UserRole(str, Enum):
    ADMIN = "admin"
    SELLER = "seller"
    CUSTOMER = "customer"

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    profile_image: Optional[str] = None
    date_of_birth: Optional[date] = None
    role: UserRole = UserRole.CUSTOMER
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        # Remove spaces and dashes
        cleaned = v.replace(' ', '').replace('-', '').replace('+', '')
        if not cleaned.isdigit() or len(cleaned) < 10:
            raise ValueError('Phone number must be at least 10 digits')
        return v

class UserCreate(UserBase):
    password: str

    @field_validator('password')
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r"[A-Z]", v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r"[a-z]", v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r"\d", v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError('Password must contain at least one special character')
        return v

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        cleaned = v.replace(' ', '').replace('-', '').replace('+', '')
        if not cleaned.isdigit() or len(cleaned) < 10:
            raise ValueError('Phone number must be at least 10 digits')
        return v

class PasswordChange(BaseModel):
    current_password: str
    new_password: str
    
    @field_validator('new_password')
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r"[A-Z]", v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r"[a-z]", v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r"\d", v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError('Password must contain at least one special character')
        return v

class UserOut(UserBase):
    id: str
    created_at: datetime

class UserStats(BaseModel):
    total_orders: int
    total_spent: float
    total_items_purchased: int
    member_since: datetime
    last_order_date: Optional[datetime] = None
