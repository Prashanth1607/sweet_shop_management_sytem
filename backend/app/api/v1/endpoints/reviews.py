from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.review import Review
from app.models.sweet import Sweet
from app.schemas.review import ReviewCreate, ReviewResponse, ReviewUpdate

router = APIRouter()

@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new review for a sweet"""
    from app.models.order import Order, OrderItem, OrderStatus
    
    # Check if sweet exists
    sweet = db.query(Sweet).filter(Sweet.id == review.sweet_id).first()
    if not sweet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sweet not found"
        )
    
    # Check if user has purchased this sweet
    has_purchased = db.query(OrderItem).join(Order).filter(
        Order.user_id == current_user.id,
        OrderItem.sweet_id == review.sweet_id,
        Order.status.in_([OrderStatus.DELIVERED, OrderStatus.CONFIRMED])
    ).first()
    
    if not has_purchased:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can only review products you have purchased"
        )
    
    # Check if user already reviewed this sweet
    existing_review = db.query(Review).filter(
        Review.user_id == current_user.id,
        Review.sweet_id == review.sweet_id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this sweet"
        )
    
    # Create new review
    db_review = Review(
        user_id=current_user.id,
        sweet_id=review.sweet_id,
        rating=review.rating,
        comment=review.comment
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Add user email for response
    response_data = ReviewResponse.model_validate(db_review)
    response_data.user_email = current_user.email
    
    return response_data

@router.get("/sweet/{sweet_id}", response_model=List[ReviewResponse])
def get_reviews_for_sweet(
    sweet_id: str,
    db: Session = Depends(get_db)
):
    """Get all reviews for a specific sweet"""
    reviews = db.query(Review).options(joinedload(Review.user)).filter(
        Review.sweet_id == sweet_id
    ).all()
    
    # Add user email to each review
    response_reviews = []
    for review in reviews:
        review_data = ReviewResponse.model_validate(review)
        review_data.user_email = review.user.email
        response_reviews.append(review_data)
    
    return response_reviews

@router.get("/user/me", response_model=List[ReviewResponse])
def get_my_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all reviews by the current user"""
    reviews = db.query(Review).filter(Review.user_id == current_user.id).all()
    
    response_reviews = []
    for review in reviews:
        review_data = ReviewResponse.model_validate(review)
        review_data.user_email = current_user.email
        response_reviews.append(review_data)
    
    return response_reviews

@router.put("/{review_id}", response_model=ReviewResponse)
def update_review(
    review_id: str,
    review_update: ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a review (only by the review author)"""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    if review.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own reviews"
        )
    
    # Update review fields
    for field, value in review_update.model_dump(exclude_unset=True).items():
        setattr(review, field, value)
    
    db.commit()
    db.refresh(review)
    
    response_data = ReviewResponse.model_validate(review)
    response_data.user_email = current_user.email
    
    return response_data

@router.get("/purchasable-items", response_model=List[dict])
def get_purchasable_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get items user has purchased but not yet reviewed"""
    from app.models.order import Order, OrderItem, OrderStatus
    
    # Get all purchased items
    purchased_items = db.query(OrderItem, Sweet).join(Sweet).join(Order).filter(
        Order.user_id == current_user.id,
        Order.status.in_([OrderStatus.DELIVERED, OrderStatus.CONFIRMED])
    ).all()
    
    # Get already reviewed items
    reviewed_sweet_ids = {review.sweet_id for review in db.query(Review).filter(
        Review.user_id == current_user.id
    ).all()}
    
    # Filter out already reviewed items
    reviewable_items = []
    seen_sweet_ids = set()
    
    for order_item, sweet in purchased_items:
        if sweet.id not in reviewed_sweet_ids and sweet.id not in seen_sweet_ids:
            reviewable_items.append({
                'sweet_id': sweet.id,
                'sweet_name': sweet.name,
                'sweet_image_url': sweet.image_url,
                'sweet_category': sweet.category,
                'purchased_quantity': order_item.quantity,
                'purchase_date': order_item.created_at
            })
            seen_sweet_ids.add(sweet.id)
    
    return reviewable_items

@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a review (only by the review author or admin)"""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    if review.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own reviews"
        )
    
    db.delete(review)
    db.commit()
    
    return None