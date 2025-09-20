#!/usr/bin/env python3
"""
Create database tables for the Sweet Shop Management System
"""
from app.db.database import engine, Base
from app.models.user import User
from app.models.sweet import Sweet
from app.models.purchase import Purchase

def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables()