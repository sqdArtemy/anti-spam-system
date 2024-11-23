from marshmallow import EXCLUDE, fields, validates, ValidationError, pre_load

from app_init import ma
from db_init import db
from models import Feedback, User, CheckRequest
from schemas import CheckRequestGetSchema
from utilities.enums import Messages
from utilities.exceptions import PermissionDeniedError


class FeedbackGetSchema(ma.SQLAlchemyAutoSchema):
    check_request = fields.Nested(CheckRequestGetSchema, many=False)

    created_at = fields.DateTime(format="%Y-%m-%d %H:%M:%S")
    updated_at = fields.DateTime(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Feedback
        fields = ("id", "rating", "actual_sus", "check_request", "created_at", "updated_at")
        load_instance = True
        ordered = True
        include_relationships = True
        sqla_session = db.session

    @pre_load
    def validate_creator_and_user(self, data: dict, *args, **kwargs) -> dict:
        creator_id = data.get("creator_id")
        check_request_id = data.get("check_request_id", None)

        if not (creator_id and User.query.filter_by(id=creator_id).first()):
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("User", "id", creator_id))

        check_request = CheckRequest.query.filter_by(id=check_request_id).first()

        if not check_request:
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("CheckRequest", "id", check_request_id))

        if check_request.user_id != int(creator_id):
            raise PermissionDeniedError(Messages.USER_NOT_CHECK_REQUEST_CREATOR.value)

        return data


class FeedbackCreateSchema(ma.SQLAlchemyAutoSchema):
    created_at = fields.DateTime(format="%Y-%m-%d %H:%M:%S")
    updated_at = fields.DateTime(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Feedback
        fields = ("rating", "actual_sus", "check_request_id")
        load_instance = True
        unknown = EXCLUDE
        sqla_session = db.session

    rating = fields.Integer(required=True)
    actual_sus = fields.Boolean(require=True)
    check_request_id = fields.Integer(required=True)

    @validates("rating")
    def validate_rating(self, value: int) -> None:
        if not (0 <= value <= 5):
            raise ValidationError(Messages.VALUE_RANGE.value.format(0, 5))

    @pre_load
    def validate_creator_and_check_request(self, data, **kwargs) -> dict:
        creator_id = data.get("creator_id", None)
        check_request_id = data.get("check_request_id", None)

        if not (creator_id and User.query.filter_by(id=creator_id).first()):
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("User", "id", creator_id))

        check_request = CheckRequest.query.filter_by(id=check_request_id).first()
        feedback = Feedback.query.filter_by(check_request_id=check_request_id).first()

        if not check_request:
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("CheckRequest", "id", check_request_id))

        if feedback:
            raise ValidationError(Messages.ALREADY_REVIEWED.value)

        if check_request.user_id != int(creator_id):
            raise PermissionDeniedError(Messages.USER_NOT_CHECK_REQUEST_CREATOR.value)

        return data
