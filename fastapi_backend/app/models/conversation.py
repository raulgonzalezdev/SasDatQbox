import uuid
import enum
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class ConversationType(str, enum.Enum):
    MEDICAL_CONSULTATION = "MEDICAL_CONSULTATION"
    SUPPORT_TICKET = "SUPPORT_TICKET"
    SALES_INQUIRY = "SALES_INQUIRY"

class Conversation(Base):
    __tablename__ = "conversations"
    __table_args__ = {'schema': 'pos'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey('pos.appointments.id'), nullable=True)
    type = Column(Enum(ConversationType), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    appointment = relationship("Appointment")
    participants = relationship("ConversationParticipant", back_populates="conversation")
    messages = relationship("Message", back_populates="conversation")

class ConversationParticipant(Base):
    __tablename__ = "conversation_participants"
    __table_args__ = {'schema': 'pos'}

    user_id = Column(UUID(as_uuid=True), ForeignKey('pos.users.id'), primary_key=True)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey('pos.conversations.id'), primary_key=True)

    user = relationship("User")
    conversation = relationship("Conversation", back_populates="participants")

class Message(Base):
    __tablename__ = "messages"
    __table_args__ = {'schema': 'pos'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey('pos.conversations.id'), nullable=False)
    sender_id = Column(UUID(as_uuid=True), ForeignKey('pos.users.id'), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True))

    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User")
