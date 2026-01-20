from pydantic import BaseModel
from datetime import datetime

class PaymentCreate(BaseModel):
    order_id: str
    user_id: str
    amount: float
    payment_method: str
    status: str
    transaction_id: str

class PaymentOut(PaymentCreate):
    id: str
    created_at: datetime
