
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.dependencies import get_db, get_current_active_user
from app.schemas.chat import Conversation, ConversationCreate, Message, MessageCreate, MessageCreateInternal
from app.services.chat_service import ChatService
from app.models.user import User as DBUser

router = APIRouter(
    tags=["Chat"],
    responses={404: {"description": "Not found"}},
)

# Función helper para parsear datos de JSON o form-urlencoded
async def parse_request_data(request: Request, model_class):
    """Parse data from JSON or form-urlencoded request"""
    ct = (request.headers.get("content-type") or "").lower()
    
    if ct.startswith("application/x-www-form-urlencoded") or ct.startswith("multipart/form-data"):
        form = await request.form()
        # Convert form data to dict
        data = {}
        for key, value in form.items():
            data[key] = value
        return model_class(**data)
    else:
        # Default to JSON
        data = await request.json()
        return model_class(**data)

@router.post("/conversations/", response_model=Conversation, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Create a new conversation.
    Accepts JSON or form-urlencoded data.
    """
    try:
        conversation_in = await parse_request_data(request, ConversationCreate)
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

@router.get("/conversations/{conversation_id}", response_model=Conversation)
def get_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Get a specific conversation.
    """
    service = ChatService(db)
    conversation = service.get_conversation(conversation_id)
    if not conversation or current_user not in conversation.participants:
        raise HTTPException(status_code=403, detail="Not authorized to view this conversation")
    return conversation

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

@router.post("/conversations/{conversation_id}/messages/", response_model=Message, status_code=status.HTTP_201_CREATED)
async def send_message(
    conversation_id: UUID,
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Send a message in a conversation.
    Accepts JSON or form-urlencoded data.
    """
    service = ChatService(db)
    
    # Check if user is a participant before creating the message
    conversation = service.get_conversation(conversation_id)
    if not conversation or not any(p.id == current_user.id for p in conversation.participants):
        raise HTTPException(status_code=403, detail="Not authorized to send messages in this conversation")

    message_in = await parse_request_data(request, MessageCreate)
    
    # Create the internal message schema with the sender_id from the authenticated user
    message_internal = MessageCreateInternal(
        **message_in.model_dump(),
        conversation_id=conversation_id,
        sender_id=current_user.id
    )
    
    return service.create_message(message_in=message_internal)

@router.post("/conversations/{conversation_id}/read")
def mark_conversation_as_read(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Mark all messages in a conversation as read for the current user.
    """
    service = ChatService(db)
    conversation = service.get_conversation(conversation_id)
    if not conversation or current_user not in conversation.participants:
        raise HTTPException(status_code=403, detail="Not authorized to access this conversation")
    
    service.mark_conversation_as_read(conversation_id=conversation_id, user_id=current_user.id)
    return {"message": "Conversation marked as read"}

@router.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Delete a conversation (only for participants).
    """
    service = ChatService(db)
    conversation = service.get_conversation(conversation_id)
    if not conversation or current_user not in conversation.participants:
        raise HTTPException(status_code=403, detail="Not authorized to delete this conversation")
    
    service.delete_conversation(conversation_id=conversation_id)
    return {"message": "Conversation deleted successfully"}
