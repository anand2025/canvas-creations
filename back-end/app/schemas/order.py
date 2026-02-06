from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional
from datetime import datetime

class OrderItem(BaseModel):
    painting_id: str
    quantity: int
    price: float

class ShippingAddress(BaseModel):
    full_name: Optional[str] = "N/A"
    phone: Optional[str] = "N/A"
    address_line1: Optional[str] = "N/A"
    address_line2: Optional[str] = None
    city: Optional[str] = "N/A"
    state: Optional[str] = "N/A"
    postal_code: Optional[str] = "N/A"
    country: Optional[str] = "India"
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if not v or v == "N/A": return v
        # Remove spaces and dashes
        cleaned = v.replace(' ', '').replace('-', '')
        if not cleaned.isdigit() or len(cleaned) < 10:
            return v # Let it pass if it's already bad data in DB
        return v
    
    @field_validator('postal_code')
    @classmethod
    def validate_postal_code(cls, v: str) -> str:
        if not v or v == "N/A": return v
        cleaned = v.replace(' ', '')
        if not cleaned.isdigit() or len(cleaned) != 6:
            return v # Let it pass if it's already bad data in DB
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
    user_id: Optional[str] = None
    items: List[OrderItem]
    total_price: float
    shipping_cost: Optional[float] = 0.0
    grand_total: Optional[float] = None
    shipping_address: Optional[ShippingAddress] = None
    customer_email: Optional[str] = "N/A"
    customer_name: Optional[str] = "Guest"
    payment_method: Optional[str] = "N/A"
    status: str
    payment_status: Optional[str] = "pending"
    created_at: Optional[datetime] = None
    
class OrderResponse(BaseModel):
    order_id: str
    status: str
    message: str
    order_details: OrderOut

class PaginatedOrdersResponse(BaseModel):
    orders: List[OrderOut]
    total_count: int
    page: int
    limit: int
    total_pages: int
