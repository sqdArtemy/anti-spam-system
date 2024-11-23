from marshmallow import fields, post_load, validates, ValidationError, EXCLUDE
from werkzeug.security import generate_password_hash

from models import User
from utilities.validators import is_name_valid, is_email_valid, is_password_valid
from utilities.enums import Messages
from app_init import ma
from db_init import db
    

class UserSchemaMixin:

    @validates('email')
    def validate_email(self, value: str) -> None:
        if User.query.filter_by(email=value).first():
            raise ValidationError(Messages.OBJECT_ALREADY_EXISTS.value.format("User", "email", value))

    @post_load
    def hash_password(self, data: dict, **kwargs) -> dict:
        if data.get("password"):
            data["password"] = generate_password_hash(data.get("password"))

        return data


class UserCreateSchema(ma.SQLAlchemyAutoSchema, UserSchemaMixin):
    class Meta:
        model = User
        fields = (
            "email", "name", "password"
        )
        unknown = EXCLUDE
        include_relationships = True
        load_instance = True

    name = fields.Str(required=True, validate=is_name_valid)
    password = fields.Str(required=True, validate=is_password_valid)
    email = fields.Str(required=True, validate=is_email_valid)


class UserGetSchema(ma.SQLAlchemyAutoSchema):
    created_at = fields.DateTime(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = User
        fields = (
            "id", "email", "name", "created_at"
        )
        ordered = True
        include_relationships = True
        load_instance = True
        sqla_session = db.session


class UserUpdateSchema(ma.SQLAlchemyAutoSchema, UserSchemaMixin):
    class Meta:
        model = User
        fields = (
            "email", "name", "password"
        )
        unknown = EXCLUDE
        include_relationships = True

    name = fields.Str(required=False, validate=is_name_valid)
    email = fields.Str(required=False, validate=is_email_valid)
    password = fields.Str(required=False, validate=is_password_valid, load_only=True)