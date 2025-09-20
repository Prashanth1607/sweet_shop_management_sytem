"""Add reviews and contact tables

Revision ID: 003
Revises: 002
Create Date: 2024-12-19 11:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None

def upgrade():
    # Create reviews table
    op.create_table('reviews',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('sweet_id', sa.String(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.ForeignKeyConstraint(['sweet_id'], ['sweets.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_reviews_id'), 'reviews', ['id'], unique=False)

    # Create contact_forms table
    op.create_table('contact_forms',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('company', sa.String(), nullable=True),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('is_bulk_order', sa.Boolean(), nullable=True),
        sa.Column('is_processed', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_contact_forms_id'), 'contact_forms', ['id'], unique=False)

def downgrade():
    # Drop contact_forms table
    op.drop_index(op.f('ix_contact_forms_id'), table_name='contact_forms')
    op.drop_table('contact_forms')
    
    # Drop reviews table
    op.drop_index(op.f('ix_reviews_id'), table_name='reviews')
    op.drop_table('reviews')