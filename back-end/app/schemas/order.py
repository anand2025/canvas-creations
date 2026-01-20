from pydantic import BaseModel
from typing import List
from datetime import datetime

class OrderItem(BaseModel):
    painting_id: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    items: List[OrderItem]
    total_price: float

class OrderOut(OrderCreate):
    id: str
    user_id: str
    status: str
    payment_status: str
    created_at: datetime
