
import uuid
import enum
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base
# Assuming you might use pgvector in the future
# from pgvector.sqlalchemy import Vector

class ConversationType(str, enum.Enum):
    MEDICAL_CONSULTATION = "medical_consultation"
    SUPPORT_TICKET = "support_ticket"
    SALES_INQUIRY = "sales_inquiry"

class Conversation(Base):
    __tablename__ = "conversations"
    __table_args__ = {'schema': 'pos', 'extend_existing': True}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("pos.appointments.id"), nullable=True)
    type = Column(SAEnum(ConversationType), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    participants = relationship("User", secondary="pos.conversation_participants", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")
    appointment = relationship("Appointment")

class ConversationParticipant(Base):
    __tablename__ = "conversation_participants"
    __table_args__ = {'schema': 'pos', 'extend_existing': True}

    user_id = Column(UUID(as_uuid=True), ForeignKey("pos.users.id"), primary_key=True)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("pos.conversations.id"), primary_key=True)

class Message(Base):
    __tablename__ = "messages"
    __table_args__ = {'schema': 'pos', 'extend_existing': True}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("pos.conversations.id"), nullable=False)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("pos.users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True), nullable=True)
    # embedding = Column(Vector(384), nullable=True) # For future RAG feature

    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", back_populates="sent_messages")
