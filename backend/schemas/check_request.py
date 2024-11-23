import json

from marshmallow import EXCLUDE, fields, validates, ValidationError

from app_init import ma
from db_init import db
from models import CheckRequest, User
from schemas import UserGetSchema
from utilities.enums import Messages


class CheckRequestCreateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CheckRequest
        fields = (
            "input", "output", "is_sus", "confidence",
            "user_id", "check_time", "words_count", "image_path"
        )
        unknown = EXCLUDE
        include_relationships = True
        load_instance = True
        sqla_session = db.session

    user_id = fields.Int(missing=None)

    @validates('user_id')
    def validate_user(self, value: int):
        """
        Validates that the user_id exists in the User table if a value is provided.
        If no user_id is provided (i.e., it is None), no validation is done.
        """
        if value is not None and not User.query.get(value):
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("User", "id", value))

    @validates('is_sus')
    def validate_is_sus(self, value: bool):
        """
        Validates that is_sus is a boolean.
        """
        if not isinstance(value, bool):
            raise ValidationError(Messages.VALIDATE_IS_SUS.value)


class CheckRequestGetSchema(ma.SQLAlchemyAutoSchema):
    user = fields.Nested(UserGetSchema, many=False)
    output = fields.Method("parse_output")
    created_at = fields.DateTime(format="%Y-%m-%d %H:%M:%S")
    updated_at = fields.DateTime(format="%Y-%m-%d %H:%M:%S")
    confidence = fields.Float(missing=None)
    check_time = fields.Float(missing=None)

    class Meta:
        model = CheckRequest
        fields = (
            "id", "input", "output", "is_sus", "confidence",
            "user", "check_time", "words_count", "image_path", "created_at", "updated_at"
        )
        ordered = True
        include_relationships = True
        load_instance = True
        sqla_session = db.session

    def parse_output(self, obj):
        """
        This method parses the 'output' field (which is expected to be a JSON string)
        into a Python dictionary. It also formats the 'important_words' list into a dictionary.
        """
        try:
            parsed_output = json.loads(obj.output)

            if 'important_words' in parsed_output:
                parsed_output['important_words'] = {word: score for word, score in parsed_output['important_words']}

            return parsed_output
        except (TypeError, ValueError):
            return {}

class CheckRequestGetGameSchema(ma.SQLAlchemyAutoSchema):

    ai_sus = ma.Boolean(attribute='is_sus')

    class Meta:
        model = CheckRequest
        fields = ("id", "input", "ai_sus", "actual_sus")
        ordered = True
        include_relationships = True
        load_instance = True
        sqla_session = db.session