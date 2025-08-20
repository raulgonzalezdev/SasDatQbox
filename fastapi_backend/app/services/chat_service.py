
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional
from datetime import datetime

from app.models.chat import Conversation, Message, ConversationParticipant
from app.models.user import User
from app.schemas.chat import ConversationCreate, MessageCreateInternal

class ChatService:
    def __init__(self, db: Session):
        self.db = db

    def create_conversation(self, conversation_in: ConversationCreate, current_user_id: UUID) -> Conversation:
        if current_user_id not in conversation_in.participant_ids:
            raise ValueError("Creator must be a participant")

        db_conversation = Conversation(
            type=conversation_in.type,
            appointment_id=conversation_in.appointment_id
        )
        self.db.add(db_conversation)
        self.db.commit()

        for user_id in conversation_in.participant_ids:
            participant = ConversationParticipant(
                user_id=user_id,
                conversation_id=db_conversation.id
            )
            self.db.add(participant)
        
        self.db.commit()
        self.db.refresh(db_conversation)
        return db_conversation

    def get_conversation(self, conversation_id: UUID) -> Optional[Conversation]:
        return self.db.query(Conversation).filter(Conversation.id == conversation_id).first()

    def get_user_conversations(self, user_id: UUID) -> List[Conversation]:
        return self.db.query(Conversation).join(Conversation.participants).filter(User.id == user_id).all()

    def create_message(self, message_in: MessageCreateInternal) -> Message:
        db_message = Message(**message_in.model_dump())
        self.db.add(db_message)
        self.db.commit()
        self.db.refresh(db_message)
        return db_message

    def get_messages_for_conversation(self, conversation_id: UUID) -> List[Message]:
        return self.db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at.asc()).all()

    def mark_conversation_as_read(self, conversation_id: UUID, user_id: UUID):
        """Mark all messages in a conversation as read for a specific user"""
        # Update all unread messages in the conversation for this user
        messages = self.db.query(Message).filter(
            Message.conversation_id == conversation_id,
            Message.sender_id != user_id,
            Message.read_at.is_(None)
        ).all()
        
        for message in messages:
            message.read_at = datetime.utcnow()
        
        self.db.commit()

    def delete_conversation(self, conversation_id: UUID):
        """Delete a conversation and all its messages"""
        # Delete all messages in the conversation
        self.db.query(Message).filter(Message.conversation_id == conversation_id).delete()
        
        # Delete all participants
        self.db.query(ConversationParticipant).filter(ConversationParticipant.conversation_id == conversation_id).delete()
        
        # Delete the conversation
        self.db.query(Conversation).filter(Conversation.id == conversation_id).delete()
        
        self.db.commit()
