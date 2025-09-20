"""Add image_url and description to sweets

Revision ID: 002
Revises: 001
Create Date: 2024-12-19 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None

def upgrade():
    # Add image_url and description columns to sweets table
    op.add_column('sweets', sa.Column('image_url', sa.String(), nullable=True))
    op.add_column('sweets', sa.Column('description', sa.Text(), nullable=True))

def downgrade():
    # Remove image_url and description columns from sweets table
    op.drop_column('sweets', 'description')
    op.drop_column('sweets', 'image_url')