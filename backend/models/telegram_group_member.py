from db_init import db
from datetime import datetime, timezone


class TelegramGroupMember(db.Model):
    __tablename__ = "telegram_group_member"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    telegram_group_id = db.Column(
        db.Integer,
        db.ForeignKey("telegram_group.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False
    )
    external_user_id = db.Column(db.BigInteger, nullable=False)
    external_username = db.Column(db.String(50), nullable=True)
    sus_counter = db.Column(db.Integer, nullable=False, default=0)
    is_blacklisted = db.Column(db.Boolean, nullable=False, default=False)
    is_whitelisted = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    def __repr__(self) -> str:
        return f"TelegramGroupMember(id={self.id}, external_user_id={self.external_user_id})"

    telegram_group = db.relationship(
        "TelegramGroup",
        backref="group_members",
        lazy="joined",
        cascade="all, delete",
        primaryjoin="TelegramGroupMember.telegram_group_id == TelegramGroup.id"
    )
