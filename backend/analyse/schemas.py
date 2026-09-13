from typing import List, Optional, Literal

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)
    history: List[ChatMessage] = Field(default_factory=list)
    image: Optional[str] = None


class ChatResponse(BaseModel):
    message: str
    orientation: str
    urgence: Literal["faible", "moderee", "urgente"]