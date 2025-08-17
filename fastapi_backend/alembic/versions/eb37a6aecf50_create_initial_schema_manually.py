"""Create initial schema manually

Revision ID: eb37a6aecf50
Revises: 
Create Date: 2024-08-22 20:01:41.012170

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'eb37a6aecf50'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE SCHEMA IF NOT EXISTS pos;")
    
    # Manually define all tables based on current models
    # This is a snapshot of Base.metadata.create_all()
    
    # ENUM types
    op.execute("CREATE TYPE pos.userrole AS ENUM ('DOCTOR', 'PATIENT', 'ADMIN');")
    op.execute("CREATE TYPE pos.pricingtype AS ENUM ('one_time', 'recurring');")
    op.execute("CREATE TYPE pos.subscriptionstatus AS ENUM ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid');")
    op.execute("CREATE TYPE pos.appointmentstatus AS ENUM ('pending_payment', 'active', 'completed', 'cancelled');")
    op.execute("CREATE TYPE pos.documenttype AS ENUM ('prescription', 'exam_order', 'exam_result', 'medical_report');")
    op.execute("CREATE TYPE pos.conversationtype AS ENUM ('medical_consultation', 'follow_up', 'support');")

    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('role', postgresql.ENUM('DOCTOR', 'PATIENT', 'ADMIN', name='userrole', schema='pos'), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_superuser', sa.Boolean(), nullable=True),
        sa.Column('first_name', sa.String(), nullable=True),
        sa.Column('last_name', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('avatar_url', sa.String(), nullable=True),
        sa.Column('billing_address', sa.JSON(), nullable=True),
        sa.Column('payment_method', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        schema='pos'
    )
    
    op.create_table('businesses',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('tax_number', sa.String(), nullable=True),
        sa.Column('owner_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['owner_id'], ['pos.users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        schema='pos'
    )

    op.create_table('customers',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('first_name', sa.String(), nullable=False),
        sa.Column('last_name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('stripe_customer_id', sa.String(), nullable=True),
        sa.Column('business_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['business_id'], ['pos.businesses.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['pos.users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        schema='pos'
    )

    op.create_table('patients',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('first_name', sa.String(), nullable=False),
        sa.Column('last_name', sa.String(), nullable=False),
        sa.Column('date_of_birth', sa.Date(), nullable=False),
        sa.Column('contact_info', sa.JSON(), nullable=True),
        sa.Column('medical_history', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['pos.users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        schema='pos'
    )

    op.create_table('subscription_products',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=True),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('image', sa.String(), nullable=True),
        sa.Column('metadata', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        schema='pos'
    )

    op.create_table('prices',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('product_id', sa.String(), nullable=True),
        sa.Column('active', sa.Boolean(), nullable=True),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('unit_amount', sa.BigInteger(), nullable=True),
        sa.Column('currency', sa.String(), nullable=True),
        sa.Column('type', postgresql.ENUM('one_time', 'recurring', name='pricingtype', schema='pos'), nullable=False),
        sa.Column('interval', sa.String(), nullable=True),
        sa.Column('interval_count', sa.Integer(), nullable=True),
        sa.Column('trial_period_days', sa.Integer(), nullable=True),
        sa.Column('metadata', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['product_id'], ['pos.subscription_products.id'], ),
        sa.PrimaryKeyConstraint('id'),
        schema='pos'
    )
    
    op.create_table('appointments',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('doctor_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('appointment_datetime', sa.DateTime(timezone=True), nullable=False),
        sa.Column('status', postgresql.ENUM('pending_payment', 'active', 'completed', 'cancelled', name='appointmentstatus', schema='pos'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['doctor_id'], ['pos.users.id'], ),
        sa.ForeignKeyConstraint(['patient_id'], ['pos.patients.id'], ),
        sa.PrimaryKeyConstraint('id'),
        schema='pos'
    )

    op.create_table('appointment_documents',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('appointment_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('document_type', postgresql.ENUM('prescription', 'exam_order', 'exam_result', 'medical_report', name='documenttype', schema='pos'), nullable=False),
        sa.Column('file_url', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['appointment_id'], ['pos.appointments.id'], ),
        sa.PrimaryKeyConstraint('id'),
        schema='pos'
    )

    op.create_table('conversations',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('appointment_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('type', postgresql.ENUM('medical_consultation', 'follow_up', 'support', name='conversationtype', schema='pos'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['appointment_id'], ['pos.appointments.id'], ),
        sa.PrimaryKeyConstraint('id'),
        schema='pos'
    )

    op.create_table('conversation_participants',
        sa.Column('conversation_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.ForeignKeyConstraint(['conversation_id'], ['pos.conversations.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['pos.users.id'], ),
        sa.PrimaryKeyConstraint('conversation_id', 'user_id'),
        schema='pos'
    )
    
    op.create_table('messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('conversation_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('sender_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['conversation_id'], ['pos.conversations.id'], ),
        sa.ForeignKeyConstraint(['sender_id'], ['pos.users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        schema='pos'
    )


def downgrade() -> None:
    op.execute("DROP SCHEMA pos CASCADE;")
