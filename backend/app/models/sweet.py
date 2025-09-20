import uuid
from sqlalchemy import Column, String, Integer, Numeric, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class Sweet(Base):
    __tablename__ = "sweets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)
    price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    image_url = Column(String, nullable=True)  # For storing image URLs
    description = Column(Text, nullable=True)  # For product descriptions
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    purchases = relationship("Purchase", back_populates="sweet")
    reviews = relationship("Review", back_populates="sweet", lazy="dynamic")
    order_items = relationship("OrderItem", back_populates="sweet")