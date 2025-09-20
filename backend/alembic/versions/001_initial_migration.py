"""Initial migration

Revision ID: 001
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('is_admin', sa.Boolean(), nullable=False, default=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('(datetime(\'now\'))'), nullable=True),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(datetime(\'now\'))'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Create sweets table
    op.create_table('sweets',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False, default=0),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('(datetime(\'now\'))'), nullable=True),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(datetime(\'now\'))'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sweets_id'), 'sweets', ['id'], unique=False)
    op.create_index(op.f('ix_sweets_name'), 'sweets', ['name'], unique=False)
    op.create_index(op.f('ix_sweets_category'), 'sweets', ['category'], unique=False)

    # Create purchases table
    op.create_table('purchases',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('sweet_id', sa.String(), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('total_price', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('(datetime(\'now\'))'), nullable=True),
        sa.ForeignKeyConstraint(['sweet_id'], ['sweets.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_purchases_id'), 'purchases', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_purchases_id'), table_name='purchases')
    op.drop_table('purchases')
    op.drop_index(op.f('ix_sweets_category'), table_name='sweets')
    op.drop_index(op.f('ix_sweets_name'), table_name='sweets')
    op.drop_index(op.f('ix_sweets_id'), table_name='sweets')
    op.drop_table('sweets')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')