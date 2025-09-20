from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, sweets, reviews, contact, orders

api_router = APIRouter()

# Include routers
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(sweets.router, prefix="/sweets", tags=["sweets"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(contact.router, prefix="/contact", tags=["contact"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])