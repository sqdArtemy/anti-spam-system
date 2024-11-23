from datetime import datetime, timezone
from db_init import db


class GameCheckRequest(db.Model):
    __tablename__ = "game_check_request"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    game_id = db.Column(
        db.Integer,
        db.ForeignKey("game.id", ondelete="CASCADE"),
        nullable=False
    )
    check_request_id = db.Column(
        db.Integer,
        db.ForeignKey("check_request.id", ondelete="CASCADE"),
        nullable=False
    )
    ai_sus = db.Column(db.Boolean, nullable=True)
    user_sus = db.Column(db.Boolean, nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    def __repr__(self) -> str:
        return f"GameCheckRequest(id={self.id}, ai_sus={self.ai_sus}, user_sus={self.user_sus})"
