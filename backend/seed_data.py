#!/usr/bin/env python3
"""
Seed the database with sample data
"""
from decimal import Decimal
from app.db.database import SessionLocal
from app.models import User, Sweet, Review, ContactForm
from app.core.auth import auth_service

def seed_database():
    """Add sample data to the database"""
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(User).first():
            print("Database already has data, skipping seed...")
            return
        
        print("Seeding database with sample data...")
        
        # Create admin user
        admin_user = User(
            email="admin@sweetshop.com",
            hashed_password=auth_service.hash_password("admin123"),
            is_admin=True
        )
        db.add(admin_user)
        
        # Create regular user
        regular_user = User(
            email="user@sweetshop.com",
            hashed_password=auth_service.hash_password("user123"),
            is_admin=False
        )
        db.add(regular_user)
        
        # Create sample sweets with images and descriptions
        sweets = [
            Sweet(
                name="Chocolate Bar", 
                category="Chocolate", 
                price=Decimal("2.50"), 
                quantity=100,
                image_url="https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop",
                description="Rich milk chocolate bar made with premium cocoa beans. Smooth and creamy texture."
            ),
            Sweet(
                name="Gummy Bears", 
                category="Gummy", 
                price=Decimal("1.99"), 
                quantity=75,
                image_url="https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&h=400&fit=crop",
                description="Colorful, chewy gummy bears in assorted fruit flavors. A classic favorite for all ages."
            ),
            Sweet(
                name="Lollipop", 
                category="Hard Candy", 
                price=Decimal("0.50"), 
                quantity=200,
                image_url="https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=400&h=400&fit=crop",
                description="Classic round lollipop with various fruit flavors. Perfect for a quick sweet treat."
            ),
            Sweet(
                name="Chocolate Chip Cookie", 
                category="Cookie", 
                price=Decimal("1.25"), 
                quantity=50,
                image_url="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop",
                description="Freshly baked chocolate chip cookies with crispy edges and chewy centers."
            ),
            Sweet(
                name="Vanilla Ice Cream", 
                category="Ice Cream", 
                price=Decimal("3.99"), 
                quantity=30,
                image_url="https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=400&fit=crop",
                description="Creamy vanilla ice cream made with real vanilla beans and fresh cream."
            ),
            Sweet(
                name="Strawberry Cake", 
                category="Cake", 
                price=Decimal("12.99"), 
                quantity=10,
                image_url="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop",
                description="Moist strawberry cake layered with fresh strawberries and whipped cream frosting."
            ),
            Sweet(
                name="Sour Patch Kids", 
                category="Gummy", 
                price=Decimal("2.25"), 
                quantity=60,
                image_url="https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&h=400&fit=crop",
                description="Sour then sweet gummy candies that pack a tangy punch followed by fruity sweetness."
            ),
            Sweet(
                name="Candy Cane", 
                category="Hard Candy", 
                price=Decimal("0.75"), 
                quantity=150,
                image_url="https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=400&h=400&fit=crop",
                description="Traditional peppermint candy canes with red and white stripes. Perfect for holidays."
            ),
            Sweet(
                name="Chocolate Truffle", 
                category="Chocolate", 
                price=Decimal("4.99"), 
                quantity=25,
                image_url="https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop",
                description="Luxurious chocolate truffles with ganache centers, dusted with cocoa powder."
            ),
            Sweet(
                name="Rainbow Lollipop", 
                category="Hard Candy", 
                price=Decimal("1.00"), 
                quantity=80,
                image_url="https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&h=400&fit=crop",
                description="Colorful spiral lollipops with multiple fruit flavors in every lick."
            ),
            Sweet(
                name="Marshmallow", 
                category="Soft Candy", 
                price=Decimal("0.25"), 
                quantity=300,
                image_url="https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=400&h=400&fit=crop",
                description="Soft, fluffy marshmallows perfect for roasting or enjoying as a sweet treat."
            ),
            Sweet(
                name="Caramel Apple", 
                category="Caramel", 
                price=Decimal("3.50"), 
                quantity=20,
                image_url="https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&h=400&fit=crop",
                description="Fresh apples dipped in rich, buttery caramel. A perfect autumn treat."
            ),
        ]
        
        for sweet in sweets:
            db.add(sweet)
        
        db.commit()
        print("Database seeded successfully!")
        print(f"Created {len(sweets)} sweets and 2 users")
        print("Admin login: admin@sweetshop.com / admin123")
        print("User login: user@sweetshop.com / user123")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()