from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional
from datetime import datetime

class OrderItem(BaseModel):
    painting_id: str
    quantity: int
    price: float

class ShippingAddress(BaseModel):
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str = "India"
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # Remove spaces and dashes
        cleaned = v.replace(' ', '').replace('-', '')
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

class CheckoutRequest(BaseModel):
    shipping_address: ShippingAddress
    payment_method: str
    
    @field_validator('payment_method')
    @classmethod
    def validate_payment_method(cls, v: str) -> str:
        allowed_methods = ['cod', 'card', 'upi']
        if v.lower() not in allowed_methods:
            raise ValueError(f'Payment method must be one of: {", ".join(allowed_methods)}')
        return v.lower()

class OrderCreate(BaseModel):
    items: List[OrderItem]
    total_price: float
    shipping_address: ShippingAddress
    customer_email: EmailStr
    customer_name: str
    payment_method: str

class OrderOut(BaseModel):
    id: str
    user_id: str
    items: List[OrderItem]
    total_price: float
    shipping_cost: float
    grand_total: float
    shipping_address: ShippingAddress
    customer_email: EmailStr
    customer_name: str
    payment_method: str
    status: str
    payment_status: str
    created_at: datetime
    
class OrderResponse(BaseModel):
    order_id: str
    status: str
    message: str
    order_details: OrderOut
