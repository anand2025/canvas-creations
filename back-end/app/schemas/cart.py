from pydantic import BaseModel
from typing import List, Optional

class CartItem(BaseModel):
    painting_id: str
    quantity: int

class CartCreate(BaseModel):
    user_id: str
    items: List[CartItem]

class AddToCartItem(BaseModel):
    painting_id: str
    quantity: int = 1

class UpdateCartItem(BaseModel):
    painting_id: str
    quantity: int
