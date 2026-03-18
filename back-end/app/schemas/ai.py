from pydantic import BaseModel
from typing import List, Optional

class AIProductDescriptionRequest(BaseModel):
    title: str
    category: str
    tags: Optional[List[str]] = None

class AIProductDescriptionResponse(BaseModel):
    description: str

class ChatMessage(BaseModel):
    role: str
    content: str

class AIChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None

class AIChatResponse(BaseModel):
    response: str
