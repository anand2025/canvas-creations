from pydantic import BaseModel
from datetime import datetime

class CategoryCreate(BaseModel):
    name: str
    description: str

class CategoryOut(CategoryCreate):
    id: str
    created_at: datetime
