from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.sweet import SweetCreate, SweetUpdate, SweetResponse
from app.schemas.purchase import PurchaseCreate, PurchaseResponse
from app.services.sweet_service import SweetService
from app.core.dependencies import get_current_user, get_current_admin_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[SweetResponse])
def get_sweets(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all sweets with ratings"""
    sweet_service = SweetService(db)
    return sweet_service.get_sweets_with_ratings(skip=skip, limit=limit)

@router.post("/", response_model=SweetResponse, status_code=201)
def create_sweet(
    sweet_data: SweetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new sweet (admin only)"""
    sweet_service = SweetService(db)
    return sweet_service.create_sweet(sweet_data)

@router.get("/search", response_model=List[SweetResponse])
def search_sweets(
    query: Optional[str] = Query(None, description="Search by name"),
    category: Optional[str] = Query(None, description="Filter by category"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum rating"),
    in_stock_only: Optional[bool] = Query(None, description="Show only in-stock items"),
    min_quantity: Optional[int] = Query(None, ge=0, description="Minimum quantity"),
    max_quantity: Optional[int] = Query(None, ge=0, description="Maximum quantity"),
    sort_by: Optional[str] = Query(None, description="Sort by: price, name, rating, created_at, quantity, category"),
    sort_order: Optional[str] = Query("asc", description="Sort order: asc or desc"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search sweets with advanced filters and sorting"""
    sweet_service = SweetService(db)
    return sweet_service.search_sweets(
        query=query,
        category=category,
        min_price=min_price,
        max_price=max_price,
        min_rating=min_rating,
        in_stock_only=in_stock_only,
        min_quantity=min_quantity,
        max_quantity=max_quantity,
        sort_by=sort_by,
        sort_order=sort_order,
        skip=skip,
        limit=limit
    )

@router.get("/{sweet_id}", response_model=SweetResponse)
def get_sweet(sweet_id: str, db: Session = Depends(get_db)):
    """Get sweet by ID"""
    sweet_service = SweetService(db)
    return sweet_service.get_sweet_by_id(sweet_id)

@router.put("/{sweet_id}", response_model=SweetResponse)
def update_sweet(
    sweet_id: str,
    sweet_data: SweetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update sweet (admin only)"""
    sweet_service = SweetService(db)
    return sweet_service.update_sweet(sweet_id, sweet_data)

@router.delete("/{sweet_id}")
def delete_sweet(
    sweet_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete sweet (admin only)"""
    sweet_service = SweetService(db)
    sweet_service.delete_sweet(sweet_id)
    return {"message": "Sweet deleted successfully"}

@router.post("/{sweet_id}/purchase", response_model=PurchaseResponse)
def purchase_sweet(
    sweet_id: str,
    purchase_data: PurchaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Purchase a sweet"""
    sweet_service = SweetService(db)
    return sweet_service.purchase_sweet(
        sweet_id=sweet_id,
        user_id=current_user.id,
        quantity=purchase_data.quantity
    )

@router.post("/{sweet_id}/restock", response_model=SweetResponse)
def restock_sweet(
    sweet_id: str,
    quantity: int = Query(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Restock sweet inventory (admin only)"""
    sweet_service = SweetService(db)
    return sweet_service.restock_sweet(sweet_id, quantity)

@router.get("/filters/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    """Get all available categories"""
    sweet_service = SweetService(db)
    return sweet_service.get_categories()

@router.get("/filters/price-range")
def get_price_range(db: Session = Depends(get_db)):
    """Get price range (min and max prices)"""
    sweet_service = SweetService(db)
    return sweet_service.get_price_range()