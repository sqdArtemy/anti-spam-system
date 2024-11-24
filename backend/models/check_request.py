from datetime import datetime, timezone
from db_init import db

class CheckRequest(db.Model):
    __tablename__ = "check_request"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    input = db.Column(db.Text, nullable=True)
    output = db.Column(db.Text, nullable=False)
    image_path = db.Column(db.Text, nullable=True)
    is_sus = db.Column(db.Boolean, nullable=False)
    confidence = db.Column(db.Numeric(15, 8), nullable=False)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=True)
    telegram_group_member_id = db.Column(
        db.Integer,
        db.ForeignKey("telegram_group_member.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=True
    )
    check_time = db.Column(db.Numeric(15, 8), nullable=False)
    words_count = db.Column(db.Integer, nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    def __repr__(self) -> str:
        return f"CheckRequest(id={self.id}, is_sus={self.is_sus}, confidence={self.confidence})"


    user = db.relationship(
        "User",
        backref="check_requests",
        lazy="joined",
        primaryjoin="CheckRequest.user_id == User.id"
    )

    telegram_group_member = db.relationship(
        "TelegramGroupMember",
        backref="check_requests",
        lazy="joined",
        cascade="all, delete",
        primaryjoin="CheckRequest.telegram_group_member_id == TelegramGroupMember.id"
    )

    games = db.relationship(
        "Game",
        secondary="game_check_request",
        backref=db.backref("check_requests_association", lazy="dynamic"),  # Changed the backref here
        lazy="dynamic"
    )
