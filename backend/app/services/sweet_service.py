from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.sweet import Sweet
from app.schemas.sweet import SweetCreate, SweetUpdate

class SweetService:
    def __init__(self, db: Session):
        self.db = db

    def create_sweet(self, sweet_data: SweetCreate) -> Sweet:
        """Create a new sweet"""
        db_sweet = Sweet(
            name=sweet_data.name,
            category=sweet_data.category,
            price=sweet_data.price,
            quantity=sweet_data.quantity
        )
        
        self.db.add(db_sweet)
        self.db.commit()
        self.db.refresh(db_sweet)
        return db_sweet

    def get_sweets(self, skip: int = 0, limit: int = 100) -> List[Sweet]:
        """Get all sweets with pagination"""
        return self.db.query(Sweet).offset(skip).limit(limit).all()

    def get_sweet_by_id(self, sweet_id: str) -> Sweet:
        """Get sweet by ID"""
        sweet = self.db.query(Sweet).filter(Sweet.id == sweet_id).first()
        if not sweet:
            raise HTTPException(status_code=404, detail="Sweet not found")
        return sweet

    def update_sweet(self, sweet_id: str, sweet_data: SweetUpdate) -> Sweet:
        """Update sweet"""
        sweet = self.get_sweet_by_id(sweet_id)
        
        update_data = sweet_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(sweet, field, value)
        
        self.db.commit()
        self.db.refresh(sweet)
        return sweet

    def delete_sweet(self, sweet_id: str) -> bool:
        """Delete sweet"""
        sweet = self.get_sweet_by_id(sweet_id)
        self.db.delete(sweet)
        self.db.commit()
        return True

    def search_sweets(
        self, 
        query: Optional[str] = None,
        category: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        min_rating: Optional[float] = None,
        in_stock_only: Optional[bool] = None,
        min_quantity: Optional[int] = None,
        max_quantity: Optional[int] = None,
        sort_by: Optional[str] = None,
        sort_order: Optional[str] = "asc",
        skip: int = 0,
        limit: int = 100
    ) -> List[Sweet]:
        """Search sweets with advanced filters and sorting"""
        from sqlalchemy import func, desc, asc
        from app.models.review import Review
        
        # Base query with average rating
        db_query = self.db.query(
            Sweet,
            func.coalesce(func.avg(Review.rating), 0).label('avg_rating'),
            func.count(Review.id).label('review_count')
        ).outerjoin(Review, Sweet.id == Review.sweet_id).group_by(Sweet.id)
        
        # Apply filters
        if query:
            db_query = db_query.filter(Sweet.name.ilike(f"%{query}%"))
        
        if category:
            db_query = db_query.filter(Sweet.category.ilike(f"%{category}%"))
        
        if min_price is not None:
            db_query = db_query.filter(Sweet.price >= min_price)
        
        if max_price is not None:
            db_query = db_query.filter(Sweet.price <= max_price)
        
        if min_rating is not None:
            db_query = db_query.having(func.coalesce(func.avg(Review.rating), 0) >= min_rating)
        
        if in_stock_only:
            db_query = db_query.filter(Sweet.quantity > 0)
        
        if min_quantity is not None:
            db_query = db_query.filter(Sweet.quantity >= min_quantity)
        
        if max_quantity is not None:
            db_query = db_query.filter(Sweet.quantity <= max_quantity)
        
        # Apply sorting
        if sort_by:
            if sort_by == "price":
                order_col = Sweet.price
            elif sort_by == "name":
                order_col = Sweet.name
            elif sort_by == "rating":
                order_col = func.coalesce(func.avg(Review.rating), 0)
            elif sort_by == "created_at":
                order_col = Sweet.created_at
            elif sort_by == "quantity":
                order_col = Sweet.quantity
            elif sort_by == "category":
                order_col = Sweet.category
            else:
                order_col = Sweet.created_at
            
            if sort_order.lower() == "desc":
                db_query = db_query.order_by(desc(order_col))
            else:
                db_query = db_query.order_by(asc(order_col))
        else:
            # Default sorting by created_at desc
            db_query = db_query.order_by(desc(Sweet.created_at))
        
        results = db_query.offset(skip).limit(limit).all()
        
        # Add rating info to sweet objects
        sweets_with_ratings = []
        for sweet, avg_rating, review_count in results:
            sweet.avg_rating = float(avg_rating) if avg_rating else 0.0
            sweet.review_count = review_count
            sweets_with_ratings.append(sweet)
        
        return sweets_with_ratings

    def get_sweets_with_ratings(self, skip: int = 0, limit: int = 100) -> List[Sweet]:
        """Get all sweets with rating information"""
        from sqlalchemy import func
        from app.models.review import Review
        
        results = self.db.query(
            Sweet,
            func.coalesce(func.avg(Review.rating), 0).label('avg_rating'),
            func.count(Review.id).label('review_count')
        ).outerjoin(Review, Sweet.id == Review.sweet_id).group_by(Sweet.id).offset(skip).limit(limit).all()
        
        sweets_with_ratings = []
        for sweet, avg_rating, review_count in results:
            sweet.avg_rating = float(avg_rating) if avg_rating else 0.0
            sweet.review_count = review_count
            sweets_with_ratings.append(sweet)
        
        return sweets_with_ratings

    def get_categories(self) -> List[str]:
        """Get all unique categories"""
        categories = self.db.query(Sweet.category).distinct().all()
        return [category[0] for category in categories]

    def get_price_range(self) -> dict:
        """Get min and max prices"""
        from sqlalchemy import func
        result = self.db.query(
            func.min(Sweet.price).label('min_price'),
            func.max(Sweet.price).label('max_price')
        ).first()
        
        return {
            'min_price': float(result.min_price) if result.min_price else 0.0,
            'max_price': float(result.max_price) if result.max_price else 0.0
        }

    def purchase_sweet(self, sweet_id: str, user_id: str, quantity: int = 1):
        """Purchase sweet and update inventory"""
        sweet = self.get_sweet_by_id(sweet_id)
        
        if sweet.quantity < quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        
        # Update sweet quantity
        sweet.quantity -= quantity
        
        # Create purchase record
        from app.models.purchase import Purchase
        purchase = Purchase(
            user_id=user_id,
            sweet_id=sweet_id,
            quantity=quantity,
            total_price=sweet.price * quantity
        )
        
        self.db.add(purchase)
        self.db.commit()
        self.db.refresh(purchase)
        
        return purchase

    def restock_sweet(self, sweet_id: str, quantity: int) -> Sweet:
        """Restock sweet inventory"""
        sweet = self.get_sweet_by_id(sweet_id)
        sweet.quantity += quantity
        
        self.db.commit()
        self.db.refresh(sweet)
        return sweet