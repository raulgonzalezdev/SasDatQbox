import os
import sys
from sqlalchemy import create_engine
import sqlalchemy as sa

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.base import Base
# Import all models to ensure they are registered with Base.metadata
from app.models.user import User
from app.models.business import Business, BusinessLocation
from app.models.customer import Customer
from app.models.subscription import SubscriptionProduct, Price, Subscription
from app.models.product import Product
from app.models.inventory import Inventory, StockTransfer, StockTransferItem
from app.models.patient import Patient
from app.models.appointment import Appointment, AppointmentDocument
from app.models.conversation import Conversation, ConversationParticipant, Message
from app.core.config import settings

def main():
    print("Creating database tables...")
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as connection:
        connection.execute(sa.text("CREATE SCHEMA IF NOT EXISTS pos;"))
        connection.commit()

    # This will create all tables defined in your models
    Base.metadata.create_all(bind=engine)
    
    print("Database tables created successfully.")

if __name__ == "__main__":
    main()
