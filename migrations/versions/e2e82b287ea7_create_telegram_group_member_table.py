"""Create Telegram Group Member Table

Revision ID: e2e82b287ea7
Revises: 6446f315ddf9
Create Date: 2024-11-19 20:04:22.401032

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e2e82b287ea7'
down_revision = '6446f315ddf9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=150), nullable=False),
    sa.Column('email', sa.String(length=50), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users')
    # ### end Alembic commands ###
