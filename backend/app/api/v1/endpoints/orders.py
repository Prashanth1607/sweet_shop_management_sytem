from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from decimal import Decimal
from app.core.dependencies import get_db, get_current_user, get_current_admin
from app.models.user import User
from app.models.order import Order, OrderItem, OrderStatus
from app.models.sweet import Sweet
from app.schemas.order import OrderCreate, OrderResponse, OrderUpdate, OrderItemResponse

router = APIRouter()

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new order"""
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item"
        )
    
    # Calculate total amount and validate items
    total_amount = Decimal('0.00')
    order_items_data = []
    
    for item in order_data.items:
        # Check if sweet exists and has enough stock
        sweet = db.query(Sweet).filter(Sweet.id == item.sweet_id).first()
        if not sweet:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Sweet with id {item.sweet_id} not found"
            )
        
        if sweet.quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Not enough stock for {sweet.name}. Available: {sweet.quantity}, Requested: {item.quantity}"
            )
        
        # Use current sweet price, not the price from request
        unit_price = sweet.price
        total_price = unit_price * item.quantity
        total_amount += total_price
        
        order_items_data.append({
            'sweet_id': item.sweet_id,
            'quantity': item.quantity,
            'unit_price': unit_price,
            'total_price': total_price,
            'sweet': sweet
        })
    
    # Create order
    db_order = Order(
        user_id=current_user.id,
        total_amount=total_amount,
        shipping_address=order_data.shipping_address,
        payment_method=order_data.payment_method,
        notes=order_data.notes
    )
    
    db.add(db_order)
    db.flush()  # Get the order ID
    
    # Create order items and update stock
    for item_data in order_items_data:
        db_order_item = OrderItem(
            order_id=db_order.id,
            sweet_id=item_data['sweet_id'],
            quantity=item_data['quantity'],
            unit_price=item_data['unit_price'],
            total_price=item_data['total_price']
        )
        db.add(db_order_item)
        
        # Update sweet stock
        item_data['sweet'].quantity -= item_data['quantity']
    
    db.commit()
    db.refresh(db_order)
    
    # Load order with items for response
    order_with_items = db.query(Order).options(
        joinedload(Order.order_items).joinedload(OrderItem.sweet)
    ).filter(Order.id == db_order.id).first()
    
    return format_order_response(order_with_items, current_user.email)

@router.get("/my-orders", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's orders"""
    orders = db.query(Order).options(
        joinedload(Order.order_items).joinedload(OrderItem.sweet)
    ).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    
    return [format_order_response(order, current_user.email) for order in orders]

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific order"""
    order = db.query(Order).options(
        joinedload(Order.order_items).joinedload(OrderItem.sweet),
        joinedload(Order.user)
    ).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Users can only see their own orders, admins can see all
    if order.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own orders"
        )
    
    return format_order_response(order, order.user.email)

@router.get("/", response_model=List[OrderResponse])
def get_all_orders(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Get all orders (admin only)"""
    orders = db.query(Order).options(
        joinedload(Order.order_items).joinedload(OrderItem.sweet),
        joinedload(Order.user)
    ).order_by(Order.created_at.desc()).all()
    
    return [format_order_response(order, order.user.email) for order in orders]

@router.put("/{order_id}", response_model=OrderResponse)
def update_order(
    order_id: str,
    order_update: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update order (admin can update status, users can update shipping info for pending orders)"""
    order = db.query(Order).options(
        joinedload(Order.order_items).joinedload(OrderItem.sweet),
        joinedload(Order.user)
    ).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check permissions
    if not current_user.is_admin and order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own orders"
        )
    
    # Non-admin users can only update certain fields for pending orders
    if not current_user.is_admin:
        if order.status != OrderStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You can only update pending orders"
            )
        
        # Only allow updating shipping address and notes for non-admin users
        if order_update.status is not None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can update order status"
            )
    
    # Update order fields
    for field, value in order_update.model_dump(exclude_unset=True).items():
        setattr(order, field, value)
    
    db.commit()
    db.refresh(order)
    
    return format_order_response(order, order.user.email)

def format_order_response(order: Order, user_email: str) -> OrderResponse:
    """Format order for response with proper item details"""
    order_items = []
    for item in order.order_items:
        order_items.append(OrderItemResponse(
            id=item.id,
            order_id=item.order_id,
            sweet_id=item.sweet_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.total_price,
            created_at=item.created_at,
            sweet_name=item.sweet.name if item.sweet else None,
            sweet_image_url=item.sweet.image_url if item.sweet else None
        ))
    
    return OrderResponse(
        id=order.id,
        user_id=order.user_id,
        total_amount=order.total_amount,
        status=order.status,
        shipping_address=order.shipping_address,
        payment_method=order.payment_method,
        notes=order.notes,
        created_at=order.created_at,
        updated_at=order.updated_at,
        order_items=order_items,
        user_email=user_email
    )