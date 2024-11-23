"""Add default false to is_game in SusError table

Revision ID: 8d5557c81a9c
Revises: c3b417a163fa
Create Date: 2024-11-22 20:48:42.327003

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = '8d5557c81a9c'
down_revision = 'c3b417a163fa'
branch_labels = None
depends_on = None


def upgrade():
    # Add a default value to the is_game column
    with op.batch_alter_table('sus_error') as batch_op:
        batch_op.alter_column(
            'is_game',
            existing_type=sa.Boolean(),
            nullable=False,
            server_default=sa.text('false')
        )


def downgrade():
    # Remove the default value from the is_game column
    with op.batch_alter_table('sus_error') as batch_op:
        batch_op.alter_column(
            'is_game',
            existing_type=sa.Boolean(),
            nullable=False,
            server_default=None
        )
