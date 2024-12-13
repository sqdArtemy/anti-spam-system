"""Changed game table mandatory fields 2

Revision ID: 1ea49249ad80
Revises: 3697b13624b2
Create Date: 2024-11-24 01:47:04.975069

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1ea49249ad80'
down_revision = '3697b13624b2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('game', schema=None) as batch_op:
        batch_op.alter_column('ai_score',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('game', schema=None) as batch_op:
        batch_op.alter_column('ai_score',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###
