import json
from http import HTTPStatus

from flask import jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource, reqparse
from marshmallow import ValidationError

from db_init import db, transaction
from schemas import FeedbackCreateSchema, FeedbackGetSchema, SusErrorCreateSchema, SusErrorGetSchema

parser = reqparse.RequestParser()
parser.add_argument("rating", type=int, location="form")
parser.add_argument("actual_sus", type=int, location="form")


class FeedbackViewSet(Resource):
    create_sus_error_schema = SusErrorCreateSchema()
    create_feedback_schema = FeedbackCreateSchema()
    get_feedback_schema = FeedbackGetSchema()
    get_sus_error_schema = SusErrorGetSchema()

    @jwt_required()
    def post(self, check_request_id: int):
        requester_id = get_jwt_identity()

        data = parser.parse_args()
        data["check_request_id"] = check_request_id
        data["creator_id"] = requester_id

        try:
            with transaction():

                feedback = self.create_feedback_schema.load(data)
                sus = self.create_sus_error_schema.load(data)
                db.session.add(feedback)
                db.session.add(sus)
                db.session.commit()

                return make_response(jsonify(self.get_feedback_schema.dump(feedback)), HTTPStatus.OK)

        except ValidationError as e:
            raise ValidationError(e.messages)
