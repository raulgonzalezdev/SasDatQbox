
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.dependencies import get_db, get_current_active_user
from app.schemas.chat import Conversation, ConversationCreate, Message, MessageCreate
from app.services.chat_service import ChatService
from app.models.user import User as DBUser

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
    responses={404: {"description": "Not found"}},
)

@router.post("/conversations/", response_model=Conversation, status_code=status.HTTP_201_CREATED)
def create_conversation(
    conversation_in: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Create a new conversation.
    """
    try:
        service = ChatService(db)
        return service.create_conversation(conversation_in, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/conversations/", response_model=List[Conversation])
def get_user_conversations(
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Get all conversations for the current user.
    """
    service = ChatService(db)
    return service.get_user_conversations(user_id=current_user.id)

@router.get("/conversations/{conversation_id}/messages/", response_model=List[Message])
def get_messages(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Get all messages for a specific conversation.
    """
    service = ChatService(db)
    # Check if user is a participant
    conversation = service.get_conversation(conversation_id)
    if not conversation or current_user not in conversation.participants:
        raise HTTPException(status_code=403, detail="Not authorized to view these messages")
    return service.get_messages_for_conversation(conversation_id=conversation_id)

@router.post("/messages/", response_model=Message, status_code=status.HTTP_201_CREATED)
def send_message(
    message_in: MessageCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Send a message in a conversation.
    """
    if current_user.id != message_in.sender_id:
        raise HTTPException(status_code=403, detail="Sender ID must match current user")

    service = ChatService(db)
    # Check if user is a participant
    conversation = service.get_conversation(message_in.conversation_id)
    if not conversation or current_user not in conversation.participants:
        raise HTTPException(status_code=403, detail="Not authorized to send messages in this conversation")
    
    return service.create_message(message_in=message_in)
