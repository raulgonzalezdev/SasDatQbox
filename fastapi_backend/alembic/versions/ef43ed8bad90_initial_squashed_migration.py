"""initial_squashed_migration

Revision ID: ef43ed8bad90
Revises: 
Create Date: 2025-08-17 10:16:26.548071

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'ef43ed8bad90'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("CREATE SCHEMA IF NOT EXISTS pos;")
    op.execute("SET search_path TO pos,public;")

    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole') THEN
            CREATE TYPE pos.userrole AS ENUM ('DOCTOR', 'PATIENT', 'ADMIN');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pricingtype') THEN
            CREATE TYPE pos.pricingtype AS ENUM ('one_time', 'recurring');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pricingplaninterval') THEN
            CREATE TYPE pos.pricingplaninterval AS ENUM ('day', 'week', 'month', 'year');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscriptionstatus') THEN
            CREATE TYPE pos.subscriptionstatus AS ENUM ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointmentstatus') THEN
            CREATE TYPE pos.appointmentstatus AS ENUM ('PENDING_PAYMENT', 'ACTIVE', 'COMPLETED', 'CANCELLED');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'documenttype') THEN
            CREATE TYPE pos.documenttype AS ENUM ('PRESCRIPTION', 'EXAM_ORDER', 'EXAM_RESULT', 'MEDICAL_REPORT');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'conversationtype') THEN
            CREATE TYPE pos.conversationtype AS ENUM ('MEDICAL_CONSULTATION', 'SUPPORT_TICKET', 'SALES_INQUIRY');
        END IF;
    END$$;
    """)

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
    op.create_table('users',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('hashed_password', sa.String(), nullable=False),
    sa.Column('role', postgresql.ENUM('DOCTOR', 'PATIENT', 'ADMIN', name='userrole', create_type=False), nullable=False),
    sa.Column('first_name', sa.String(), nullable=True),
    sa.Column('last_name', sa.String(), nullable=True),
    sa.Column('phone', sa.String(), nullable=True),
    sa.Column('avatar_url', sa.String(), nullable=True),
    sa.Column('billing_address', sa.JSON(), nullable=True),
    sa.Column('payment_method', sa.JSON(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    schema='pos'
    )
    op.create_index(op.f('ix_pos_users_email'), 'users', ['email'], unique=True, schema='pos')
    op.create_table('businesses',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('address', sa.String(), nullable=True),
    sa.Column('phone', sa.String(), nullable=True),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('tax_number', sa.String(), nullable=True),
    sa.Column('owner_id', sa.UUID(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['pos.users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema='pos'
    )
    op.create_table('customers',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('stripe_customer_id', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['id'], ['pos.users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema='pos'
    )
    op.create_table('patients',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('user_id', sa.UUID(), nullable=False),
    sa.Column('medical_history', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['pos.users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema='pos'
    )
    op.create_table('prices',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('product_id', sa.String(), nullable=True),
    sa.Column('active', sa.Boolean(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('unit_amount', sa.BigInteger(), nullable=True),
    sa.Column('currency', sa.String(length=3), nullable=True),
    sa.Column('type', postgresql.ENUM('one_time', 'recurring', name='pricingtype', create_type=False), nullable=True),
    sa.Column('interval', postgresql.ENUM('day', 'week', 'month', 'year', name='pricingplaninterval', create_type=False), nullable=True),
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
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('doctor_id', sa.UUID(), nullable=False),
    sa.Column('patient_id', sa.UUID(), nullable=False),
    sa.Column('status', postgresql.ENUM('PENDING_PAYMENT', 'ACTIVE', 'COMPLETED', 'CANCELLED', name='appointmentstatus', create_type=False), nullable=False),
    sa.Column('appointment_datetime', sa.DateTime(timezone=True), nullable=False),
    sa.Column('reason', sa.Text(), nullable=True),
    sa.Column('stripe_payment_intent_id', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['doctor_id'], ['pos.users.id'], ),
    sa.ForeignKeyConstraint(['patient_id'], ['pos.patients.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema='pos'
    )
    op.create_table('business_locations',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('business_id', sa.UUID(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('address', sa.String(), nullable=True),
    sa.Column('phone', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['business_id'], ['pos.businesses.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema='pos'
    )
    op.create_table('products',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('price', sa.Float(), nullable=False),
    sa.Column('sku', sa.String(), nullable=True),
    sa.Column('business_id', sa.UUID(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['business_id'], ['pos.businesses.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('sku'),
    schema='pos'
    )
    op.create_table('subscriptions',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('user_id', sa.UUID(), nullable=False),
    sa.Column('status', postgresql.ENUM('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused', name='subscriptionstatus', create_type=False), nullable=True),
    sa.Column('metadata', sa.JSON(), nullable=True),
    sa.Column('price_id', sa.String(), nullable=True),
    sa.Column('quantity', sa.Integer(), nullable=True),
    sa.Column('cancel_at_period_end', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('current_period_start', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('current_period_end', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('ended_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('cancel_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('canceled_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('trial_start', sa.DateTime(timezone=True), nullable=True),
    sa.Column('trial_end', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['price_id'], ['pos.prices.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['pos.users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema='pos'
    )
    op.create_table('appointment_documents',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('appointment_id', sa.UUID(), nullable=False),
    sa.Column('document_type', postgresql.ENUM('PRESCRIPTION', 'EXAM_ORDER', 'EXAM_RESULT', 'MEDICAL_REPORT', name='documenttype', create_type=False), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['appointment_id'], ['pos.appointments.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema='pos'
    )
    op.create_table('conversations',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('appointment_id', sa.UUID(), nullable=True),
    sa.Column('type', postgresql.ENUM('MEDICAL_CONSULTATION', 'SUPPORT_TICKET', 'SALES_INQUIRY', name='conversationtype', create_type=False), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['appointment_id'], ['pos.appointments.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema='pos'
    )
    op.create_table('inventory',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('product_id', sa.UUID(), nullable=False),
    sa.Column('location_id', sa.UUID(), nullable=False),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['location_id'], ['pos.business_locations.id'], ),
    sa.ForeignKeyConstraint(['product_id'], ['pos.products.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema='pos'
    )
    op.create_table('stock_transfers',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('business_id', sa.UUID(), nullable=False),
    sa.Column('from_location_id', sa.UUID(), nullable=False),
    sa.Column('to_location_id', sa.UUID(), nullable=False),
    sa.Column('status', sa.String(), nullable=False),
    sa.Column('notes', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['business_id'], ['pos.businesses.id'], ),
    sa.ForeignKeyConstraint(['from_location_id'], ['pos.business_locations.id'], ),
    sa.ForeignKeyConstraint(['to_location_id'], ['pos.business_locations.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema='pos'
    )
    op.create_table('conversation_participants',
    sa.Column('user_id', sa.UUID(), nullable=False),
    sa.Column('conversation_id', sa.UUID(), nullable=False),
    sa.ForeignKeyConstraint(['conversation_id'], ['pos.conversations.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['pos.users.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'conversation_id'),
    schema='pos'
    )
    op.create_table('messages',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('conversation_id', sa.UUID(), nullable=False),
    sa.Column('sender_id', sa.UUID(), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('read_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['conversation_id'], ['pos.conversations.id'], ),
    sa.ForeignKeyConstraint(['sender_id'], ['pos.users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema='pos'
    )
    op.create_table('stock_transfer_items',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('transfer_id', sa.UUID(), nullable=False),
    sa.Column('product_id', sa.UUID(), nullable=False),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['product_id'], ['pos.products.id'], ),
    sa.ForeignKeyConstraint(['transfer_id'], ['pos.stock_transfers.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema='pos'
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('stock_transfer_items', schema='pos')
    op.drop_table('messages', schema='pos')
    op.drop_table('conversation_participants', schema='pos')
    op.drop_table('stock_transfers', schema='pos')
    op.drop_table('inventory', schema='pos')
    op.drop_table('conversations', schema='pos')
    op.drop_table('appointment_documents', schema='pos')
    op.drop_table('subscriptions', schema='pos')
    op.drop_table('products', schema='pos')
    op.drop_table('business_locations', schema='pos')
    op.drop_table('appointments', schema='pos')
    op.drop_table('prices', schema='pos')
    op.drop_table('patients', schema='pos')
    op.drop_table('customers', schema='pos')
    op.drop_table('businesses', schema='pos')
    op.drop_index(op.f('ix_pos_users_email'), table_name='users', schema='pos')
    op.drop_table('users', schema='pos')
    op.drop_table('subscription_products', schema='pos')

    op.execute("DROP TYPE pos.userrole;")
    op.execute("DROP TYPE pos.pricingtype;")
    op.execute("DROP TYPE pos.pricingplaninterval;")
    op.execute("DROP TYPE pos.subscriptionstatus;")
    op.execute("DROP TYPE pos.appointmentstatus;")
    op.execute("DROP TYPE pos.documenttype;")
    op.execute("DROP TYPE pos.conversationtype;")