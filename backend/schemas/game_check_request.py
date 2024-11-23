from marshmallow import fields, EXCLUDE, validates, ValidationError
from models import GameCheckRequest, Game, CheckRequest
from utilities.enums import Messages
from app_init import ma
from db_init import db


class GameCheckRequestSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = GameCheckRequest
        fields = (
            "id", "game_id", "check_request_id", "ai_sus", "user_sus",
            "created_at", "updated_at"
        )
        unknown = EXCLUDE
        include_relationships = True
        load_instance = True
        sqla_session = db.session

    game = fields.Nested("schemas.game.GameSchema")
    check_request = fields.Nested("schemas.check_request.CheckRequestSchema")

    @validates('game_id')
    def validate_game(self, value: int):
        if not Game.query.get(value):
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("Game", "id", value))

    @validates('check_request_id')
    def validate_check_request(self, value: int):
        if not CheckRequest.query.get(value):
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("CheckRequest", "id", value))


class GameCheckRequestUpdateSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = GameCheckRequest
        fields = (
            "game_id", "check_request_id", "user_sus",
        )
        unknown = EXCLUDE
        include_relationships = True
        load_instance = True
        sqla_session = db.session

    @validates('game_id')
    def validate_game(self, value: int):
        if not Game.query.get(value):
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("Game", "id", value))

    @validates('check_request_id')
    def validate_check_request(self, value: int):
        if not CheckRequest.query.get(value):
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("CheckRequest", "id", value))
