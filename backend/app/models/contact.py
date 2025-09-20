import uuid
from sqlalchemy import Column, String, DateTime, Text, Boolean
from sqlalchemy.sql import func
from app.db.database import Base

class ContactForm(Base):
    __tablename__ = "contact_forms"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    is_bulk_order = Column(Boolean, default=False)
    is_processed = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())