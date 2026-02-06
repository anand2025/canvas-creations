from pydantic import BaseModel
from datetime import datetime

class ReviewCreate(BaseModel):
    user_id: str
    user_name: str
    painting_id: str
    rating: float
    comment: str

class ReviewOut(ReviewCreate):
    id: str
    created_at: datetime
