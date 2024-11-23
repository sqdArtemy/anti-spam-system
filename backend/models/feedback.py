from datetime import datetime, timezone
from db_init import db

class Feedback(db.Model):
    __tablename__ = "feedback"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    check_request_id = db.Column(
        db.Integer,
        db.ForeignKey("check_request.id", ondelete="CASCADE"),
        nullable=False
    )
    rating = db.Column(db.Integer, nullable=False)
    actual_sus = db.Column(db.Boolean, nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    __table_args__ = (
        db.CheckConstraint("rating >= 0 AND rating <= 5", name="check_feedback_rating"),
    )

    def __repr__(self) -> str:
        return f"Feedback(id={self.id}, rating={self.rating}, actual_sus={self.actual_sus})"

    check_request = db.relationship(
        "CheckRequest",
        backref="feedbacks",
        lazy="joined",
        primaryjoin="Feedback.check_request_id == CheckRequest.id"
    )
