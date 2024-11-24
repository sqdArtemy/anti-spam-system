from datetime import datetime, timezone
from db_init import db

class Game(db.Model):
    __tablename__ = "game"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    user_score = db.Column(db.Integer, nullable=True)
    ai_score = db.Column(db.Integer, nullable=True)
    rounds = db.Column(db.Integer, nullable=False)
    max_time = db.Column(db.Numeric(8, 2), nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    def __repr__(self) -> str:
        return f"Game(id={self.id}, user_score={self.user_score}, ai_score={self.ai_score})"

    user = db.relationship(
        "User",
        backref="games",
        lazy="joined",
        primaryjoin="Game.user_id == User.id"
    )

    check_requests = db.relationship(
        "CheckRequest",
        secondary="game_check_request",
        # backref=db.backref("games_association", lazy="dynamic"),
        lazy="dynamic",
        overlaps="check_requests_association,games"
    )
