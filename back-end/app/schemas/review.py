from pydantic import BaseModel
from datetime import datetime

class ReviewCreate(BaseModel):
    user_id: str
    painting_id: str
    rating: float
    review: str

class ReviewOut(ReviewCreate):
    id: str
    created_at: datetime
