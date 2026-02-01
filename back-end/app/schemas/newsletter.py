from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class NewsletterCreate(BaseModel):
    email: EmailStr

class NewsletterOut(BaseModel):
    id: str
    email: EmailStr
    subscribed_at: datetime

class BulkEmailRequest(BaseModel):
    subject: str
    body: str # HTML content supported
