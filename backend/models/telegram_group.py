from db_init import db
from datetime import datetime, timezone


class TelegramGroup(db.Model):
    __tablename__ = "telegram_group"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    external_group_id = db.Column(db.BigInteger, nullable=False)
    bot_enabled = db.Column(db.Boolean, nullable=False, default=True)
    ban_enabled = db.Column(db.Boolean, nullable=False, default=False)
    mute_enabled = db.Column(db.Boolean, nullable=False, default=False)
    ban_threshold = db.Column(db.Integer, nullable=True)
    mute_threshold = db.Column(db.Integer, nullable=True)
    sus_min_confidence = db.Column(db.Numeric(10, 0), nullable=False, default=80)
    spam_min_confidence = db.Column(db.Numeric(10, 0), nullable=False, default=90)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    def __repr__(self) -> str:
        return f"TelegramGroup(id={self.id}, external_group_id={self.external_group_id})"
