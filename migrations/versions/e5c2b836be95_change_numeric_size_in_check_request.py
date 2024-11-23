"""Change numeric size in check_request

Revision ID: e5c2b836be95
Revises: 8d5557c81a9c
Create Date: 2024-11-22 23:46:27.407299

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e5c2b836be95'
down_revision = '8d5557c81a9c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('check_request', schema=None) as batch_op:
        batch_op.alter_column('confidence',
               existing_type=sa.NUMERIC(precision=10, scale=8),
               type_=sa.Numeric(precision=15, scale=8),
               existing_nullable=False)
        batch_op.alter_column('check_time',
               existing_type=sa.NUMERIC(precision=10, scale=8),
               type_=sa.Numeric(precision=15, scale=8),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('check_request', schema=None) as batch_op:
        batch_op.alter_column('check_time',
               existing_type=sa.Numeric(precision=15, scale=8),
               type_=sa.NUMERIC(precision=10, scale=8),
               existing_nullable=False)
        batch_op.alter_column('confidence',
               existing_type=sa.Numeric(precision=15, scale=8),
               type_=sa.NUMERIC(precision=10, scale=8),
               existing_nullable=False)

    # ### end Alembic commands ###
