from pydantic import BaseModel
from typing import List

class CartItem(BaseModel):
    painting_id: str
    quantity: int

class CartCreate(BaseModel):
    user_id: str
    items: List[CartItem]
