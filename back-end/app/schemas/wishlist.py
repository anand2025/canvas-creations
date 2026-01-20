from pydantic import BaseModel
from typing import List

class WishlistCreate(BaseModel):
    user_id: str
    paintings: List[str]
