from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PaintingBase(BaseModel):
    title: str
    description: str
    image_url: str
    price: float
    category: str
    stock: int
    artist: str
    seller_id: Optional[str] = None
    is_bestseller: Optional[bool] = False
    rating: Optional[float] = 0.0
    num_reviews: Optional[int] = 0

class PaintingCreate(PaintingBase):
    pass

class PaintingOut(PaintingBase):
    id: str
    created_at: datetime
