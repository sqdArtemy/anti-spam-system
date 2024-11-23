from marshmallow import EXCLUDE, fields, ValidationError, pre_load
from sqlalchemy import false

from app_init import ma
from db_init import db
from models import CheckRequest, SusError
from utilities.enums import Messages


class SusErrorGetSchema(ma.SQLAlchemyAutoSchema):
    created_at = fields.DateTime(format="%Y-%m-%d %H:%M:%S")
    updated_at = fields.DateTime(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = SusError
        fields = ("id", "check_request", "actual_sus", "is_game", "created_at", "updated_at")
        load_instance = True
        ordered = True
        include_relationships = True
        sqla_session = db.session

    @pre_load
    def validate_creator_and_user(self, data: dict, *args, **kwargs) -> dict:
        check_request_id = data.get("check_request_id", None)

        check_request = CheckRequest.query.filter_by(id=check_request_id).first()

        if not check_request:
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("CheckRequest", "id", check_request_id))

        return data


class SusErrorCreateSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = SusError
        fields = ("is_game", "actual_sus", "check_request_id")
        load_instance = True
        unknown = EXCLUDE
        sqla_session = db.session

    is_game = fields.Boolean(required=False, missing=False)
    actual_sus = fields.Boolean(require=True)
    check_request_id = fields.Integer(required=True)

    @pre_load
    def validate_creator_and_check_request(self, data, **kwargs) -> dict:
        check_request_id = data.get("check_request_id", None)

        check_request = CheckRequest.query.filter_by(id=check_request_id).first()

        if not check_request:
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("CheckRequest", "id", check_request_id))

        return data
