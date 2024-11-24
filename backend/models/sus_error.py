from datetime import datetime, timezone
from db_init import db


class SusError(db.Model):
    __tablename__ = "sus_error"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    check_request_id = db.Column(
        db.Integer,
        db.ForeignKey("check_request.id", ondelete="CASCADE"),
        nullable=False
    )
    actual_sus = db.Column(db.Boolean, nullable=False)
    is_game = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    def __repr__(self) -> str:
        return f"SusError(id={self.id}, actual_sus={self.actual_sus}, is_game={self.is_game}, check_request_id={self.check_request_id})"

    check_request = db.relationship(
        "CheckRequest",
        backref="sus_error",
        primaryjoin="SusError.check_request_id == CheckRequest.id",
        lazy="joined"
    )
