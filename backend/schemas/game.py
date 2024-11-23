from marshmallow import fields, EXCLUDE, validates, ValidationError
from models import Game, User
from utilities.enums import Messages
from app_init import ma
from db_init import db


class GameCreateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Game
        fields = (
            "user_id", "user_score", "ai_score", "rounds",
            "max_time"
        )
        unknown = EXCLUDE
        include_relationships = True
        load_instance = True
        sqla_session = db.session

    user_score = fields.Int(missing=None)
    max_time = fields.Float(missing=None)

    @validates('user_id')
    def validate_user(self, value: int):
        """
        Validates that the user_id exists in the User table if a value is provided.
        If no user_id is provided (i.e., it is None), no validation is done.
        """
        if value is not None and not User.query.get(value):
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("User", "id", value))

class GameGetSchema(ma.SQLAlchemyAutoSchema):
    created_at = fields.DateTime(format="%Y-%m-%d %H:%M:%S")
    updated_at = fields.DateTime(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Game
        fields = (
            "id", "user_id", "user_score", "ai_score", "rounds",
            "max_time", "created_at", "updated_at"
        )
        unknown = EXCLUDE
        include_relationships = True
        load_instance = True
        sqla_session = db.session
