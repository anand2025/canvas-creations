from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from enum import Enum

class AddressBase(BaseModel):
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str = "India"
    is_default: bool = False
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # Remove spaces and dashes
        cleaned = v.replace(' ', '').replace('-', '').replace('+', '')
        if not cleaned.isdigit() or len(cleaned) < 10:
            raise ValueError('Phone number must be at least 10 digits')
        return v
    
    @field_validator('postal_code')
    @classmethod
    def validate_postal_code(cls, v: str) -> str:
        cleaned = v.replace(' ', '')
        if not cleaned.isdigit() or len(cleaned) != 6:
            raise ValueError('Postal code must be 6 digits')
        return v

class AddressCreate(AddressBase):
    pass

class AddressUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    is_default: Optional[bool] = None
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        cleaned = v.replace(' ', '').replace('-', '').replace('+', '')
        if not cleaned.isdigit() or len(cleaned) < 10:
            raise ValueError('Phone number must be at least 10 digits')
        return v
    
    @field_validator('postal_code')
    @classmethod
    def validate_postal_code(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        cleaned = v.replace(' ', '')
        if not cleaned.isdigit() or len(cleaned) != 6:
            raise ValueError('Postal code must be 6 digits')
        return v

class AddressOut(AddressBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
