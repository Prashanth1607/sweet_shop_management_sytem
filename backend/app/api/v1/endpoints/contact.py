from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_admin
from app.models.user import User
from app.models.contact import ContactForm
from app.schemas.contact import ContactFormCreate, ContactFormResponse, ContactFormUpdate

router = APIRouter()

@router.post("/", response_model=ContactFormResponse, status_code=status.HTTP_201_CREATED)
def create_contact_form(
    contact: ContactFormCreate,
    db: Session = Depends(get_db)
):
    """Create a new contact form submission (public endpoint)"""
    db_contact = ContactForm(**contact.model_dump())
    
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    
    return db_contact

@router.get("/", response_model=List[ContactFormResponse])
def get_contact_forms(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Get all contact form submissions (admin only)"""
    return db.query(ContactForm).order_by(ContactForm.created_at.desc()).all()

@router.get("/unprocessed", response_model=List[ContactFormResponse])
def get_unprocessed_contact_forms(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Get unprocessed contact form submissions (admin only)"""
    return db.query(ContactForm).filter(
        ContactForm.is_processed == False
    ).order_by(ContactForm.created_at.desc()).all()

@router.put("/{contact_id}", response_model=ContactFormResponse)
def update_contact_form(
    contact_id: str,
    contact_update: ContactFormUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Update contact form status (admin only)"""
    contact = db.query(ContactForm).filter(ContactForm.id == contact_id).first()
    
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact form not found"
        )
    
    # Update contact form fields
    for field, value in contact_update.model_dump(exclude_unset=True).items():
        setattr(contact, field, value)
    
    db.commit()
    db.refresh(contact)
    
    return contact

@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact_form(
    contact_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Delete a contact form submission (admin only)"""
    contact = db.query(ContactForm).filter(ContactForm.id == contact_id).first()
    
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact form not found"
        )
    
    db.delete(contact)
    db.commit()
    
    return None