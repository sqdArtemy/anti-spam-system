from contextlib import contextmanager

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from redis import Redis
from app_init import app

db = SQLAlchemy(app)
migrate = Migrate(app, db)

redis_store = Redis(
    host=app.config['REDIS_HOST'],
    port=app.config['REDIS_PORT'],
    db=app.config['REDIS_DB']
)


@contextmanager
def transaction():
    try:
        yield
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise
