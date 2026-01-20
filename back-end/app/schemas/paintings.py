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

class PaintingCreate(PaintingBase):
    pass

class PaintingOut(PaintingBase):
    id: str
    created_at: datetime
