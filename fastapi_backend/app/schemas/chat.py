
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from .user import User # Import User schema for nesting
from app.models.chat import ConversationType

# Message Schemas
class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    conversation_id: UUID
    sender_id: UUID # In a real app, this would likely come from the authenticated user

class Message(MessageBase):
    id: UUID
    conversation_id: UUID
    sender_id: UUID
    created_at: datetime
    read_at: Optional[datetime] = None
    sender: User # Nested sender information

    class Config:
        from_attributes = True

# Conversation Schemas
class ConversationBase(BaseModel):
    type: ConversationType
    appointment_id: Optional[UUID] = None

class ConversationCreate(ConversationBase):
    participant_ids: List[UUID] = Field(..., min_items=2, max_items=2, description="A conversation must have exactly two participants for now.")

class Conversation(ConversationBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    participants: List[User] = []
    messages: List[Message] = []

    class Config:
        from_attributes = True
