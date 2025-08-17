BEGIN;

CREATE TABLE pos.alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Running upgrade  -> ef43ed8bad90

CREATE SCHEMA IF NOT EXISTS pos;

SET search_path TO pos,public;

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

CREATE TABLE pos.subscription_products (
    id VARCHAR NOT NULL, 
    active BOOLEAN, 
    name VARCHAR, 
    description VARCHAR, 
    image VARCHAR, 
    metadata JSON, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
    updated_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id)
);

CREATE TABLE pos.users (
    id UUID NOT NULL, 
    email VARCHAR NOT NULL, 
    hashed_password VARCHAR NOT NULL, 
    role userrole NOT NULL, 
    first_name VARCHAR, 
    last_name VARCHAR, 
    phone VARCHAR, 
    avatar_url VARCHAR, 
    billing_address JSON, 
    payment_method JSON, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
    updated_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_pos_users_email ON pos.users (email);

CREATE TABLE pos.businesses (
    id UUID NOT NULL, 
    name VARCHAR NOT NULL, 
    address VARCHAR, 
    phone VARCHAR, 
    email VARCHAR, 
    tax_number VARCHAR, 
    owner_id UUID NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
    updated_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id), 
    FOREIGN KEY(owner_id) REFERENCES pos.users (id)
);

CREATE TABLE pos.customers (
    id UUID NOT NULL, 
    stripe_customer_id VARCHAR, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
    updated_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id), 
    FOREIGN KEY(id) REFERENCES pos.users (id)
);

CREATE TABLE pos.patients (
    id UUID NOT NULL, 
    user_id UUID NOT NULL, 
    medical_history TEXT, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
    updated_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES pos.users (id)
);

CREATE TABLE pos.prices (
    id VARCHAR NOT NULL, 
    product_id VARCHAR, 
    active BOOLEAN, 
    description VARCHAR, 
    unit_amount BIGINT, 
    currency VARCHAR(3), 
    type pricingtype, 
    interval pricingplaninterval, 
    interval_count INTEGER, 
    trial_period_days INTEGER, 
    metadata JSON, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
    updated_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id), 
    FOREIGN KEY(product_id) REFERENCES pos.subscription_products (id)
);

CREATE TABLE pos.appointments (
    id UUID NOT NULL, 
    doctor_id UUID NOT NULL, 
    patient_id UUID NOT NULL, 
    status appointmentstatus NOT NULL, 
    appointment_datetime TIMESTAMP WITH TIME ZONE NOT NULL, 
    reason TEXT, 
    stripe_payment_intent_id VARCHAR, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
    updated_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id), 
    FOREIGN KEY(doctor_id) REFERENCES pos.users (id), 
    FOREIGN KEY(patient_id) REFERENCES pos.patients (id)
);

CREATE TABLE pos.business_locations (
    id UUID NOT NULL, 
    business_id UUID NOT NULL, 
    name VARCHAR NOT NULL, 
    address VARCHAR, 
    phone VARCHAR, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
    updated_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id), 
    FOREIGN KEY(business_id) REFERENCES pos.businesses (id)
);

CREATE TABLE pos.products (
    id UUID NOT NULL, 
    name VARCHAR NOT NULL, 
    description VARCHAR, 
    price FLOAT NOT NULL, 
    sku VARCHAR, 
    business_id UUID NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
    updated_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id), 
    FOREIGN KEY(business_id) REFERENCES pos.businesses (id), 
    UNIQUE (sku)
);

CREATE TABLE pos.subscriptions (
    id VARCHAR NOT NULL, 
    user_id UUID NOT NULL, 
    status subscriptionstatus, 
    metadata JSON, 
    price_id VARCHAR, 
    quantity INTEGER, 
    cancel_at_period_end BOOLEAN, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    updated_at TIMESTAMP WITH TIME ZONE, 
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    current_period_end TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    ended_at TIMESTAMP WITH TIME ZONE, 
    cancel_at TIMESTAMP WITH TIME ZONE, 
    canceled_at TIMESTAMP WITH TIME ZONE, 
    trial_start TIMESTAMP WITH TIME ZONE, 
    trial_end TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id), 
    FOREIGN KEY(price_id) REFERENCES pos.prices (id), 
    FOREIGN KEY(user_id) REFERENCES pos.users (id)
);

CREATE TABLE pos.appointment_documents (
    id UUID NOT NULL, 
    appointment_id UUID NOT NULL, 
    document_type documenttype NOT NULL, 
    content TEXT NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
    updated_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id), 
    FOREIGN KEY(appointment_id) REFERENCES pos.appointments (id)
);

CREATE TABLE pos.conversations (
    id UUID NOT NULL, 
    appointment_id UUID, 
    type conversationtype NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
    updated_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id), 
    FOREIGN KEY(appointment_id) REFERENCES pos.appointments (id)
);

CREATE TABLE pos.inventory (
    id UUID NOT NULL, 
    product_id UUID NOT NULL, 
    location_id UUID NOT NULL, 
    quantity INTEGER NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
    updated_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id), 
    FOREIGN KEY(location_id) REFERENCES pos.business_locations (id), 
    FOREIGN KEY(product_id) REFERENCES pos.products (id)
);

CREATE TABLE pos.stock_transfers (
    id UUID NOT NULL, 
    business_id UUID NOT NULL, 
    from_location_id UUID NOT NULL, 
    to_location_id UUID NOT NULL, 
    status VARCHAR NOT NULL, 
    notes VARCHAR, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
    updated_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id), 
    FOREIGN KEY(business_id) REFERENCES pos.businesses (id), 
    FOREIGN KEY(from_location_id) REFERENCES pos.business_locations (id), 
    FOREIGN KEY(to_location_id) REFERENCES pos.business_locations (id)
);

CREATE TABLE pos.conversation_participants (
    user_id UUID NOT NULL, 
    conversation_id UUID NOT NULL, 
    PRIMARY KEY (user_id, conversation_id), 
    FOREIGN KEY(conversation_id) REFERENCES pos.conversations (id), 
    FOREIGN KEY(user_id) REFERENCES pos.users (id)
);

CREATE TABLE pos.messages (
    id UUID NOT NULL, 
    conversation_id UUID NOT NULL, 
    sender_id UUID NOT NULL, 
    content TEXT NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
    read_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id), 
    FOREIGN KEY(conversation_id) REFERENCES pos.conversations (id), 
    FOREIGN KEY(sender_id) REFERENCES pos.users (id)
);

CREATE TABLE pos.stock_transfer_items (
    id UUID NOT NULL, 
    transfer_id UUID NOT NULL, 
    product_id UUID NOT NULL, 
    quantity INTEGER NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
    updated_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id), 
    FOREIGN KEY(product_id) REFERENCES pos.products (id), 
    FOREIGN KEY(transfer_id) REFERENCES pos.stock_transfers (id)
);

INSERT INTO pos.alembic_version (version_num) VALUES ('ef43ed8bad90') RETURNING pos.alembic_version.version_num;

COMMIT;