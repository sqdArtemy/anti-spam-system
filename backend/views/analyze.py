import json
from http import HTTPStatus

from flask import jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource, reqparse
from marshmallow import ValidationError

from db_init import db, transaction
from schemas.check_request import CheckRequestGetSchema, CheckRequestCreateSchema
from services.minio_service import minio_service
from utilities.enums import Messages
from utilities.exceptions import InvalidInputError
from utilities.workflow_client import WorkflowClient

parser = reqparse.RequestParser()
parser.add_argument("text", location="form")
parser.add_argument("image", type=lambda x: x, location="files")
parser.add_argument("word_number", type=int, default=5, location="form")

class AnalyzeAPI(Resource):
    check_request_create_schema = CheckRequestCreateSchema()
    check_request_get_schema = CheckRequestGetSchema()

    @jwt_required(optional=True)
    def post(self):

        user_identity = get_jwt_identity()

        data = parser.parse_args()
        text = data.get("text")
        image = data.get("image")
        word_number = data.get("word_number")

        if not text and not image:
            raise InvalidInputError(Messages.INVALID_INPUT.value)
        if text and image:
            raise InvalidInputError(Messages.INVALID_INPUT.value)

        input_type = "text" if text else "image"
        email_content = text or None
        image_path = None

        if input_type == "text":
            word_count = len(text.split())

            if word_count < 10:
                word_number = 1
            else:
                word_number = min(max(2, word_count // 10), 12)

        if input_type == "image":
            image_path = minio_service.upload_image(image)

        payload = {
            "email": email_content,
            "image_path": image_path,
            "words_number": word_number if word_number else 5
        }

        try:
            result = WorkflowClient.run_workflow(payload)
        except Exception as e:
            raise InvalidInputError(Messages.WORKFLOW_EXECUTION_ERROR.value.format(str(e)))

        result = json.loads(result)

        is_suspicious = result.get("is_suspicious")
        confidence = result.get("confidence")
        important_words = result.get("important_words")
        time_taken = result.get("time_taken")

        important_words_dict = {word: score for word, score in important_words}

        try:
            with transaction():
                data = {
                    "input": text if input_type == "text" else None,
                    "output": json.dumps(result),
                    "is_sus": is_suspicious,
                    "confidence": confidence,
                    "user_id": user_identity,
                    "check_time": time_taken,
                    "words_count": len(important_words_dict) if important_words_dict else None,
                    "image_path": image_path
                }

                check_request = self.check_request_create_schema.load(data)

                db.session.add(check_request)
                db.session.flush()

                check_request_data = self.check_request_get_schema.dump(check_request)

                return make_response(jsonify(check_request_data), HTTPStatus.OK)

        except ValidationError as e:
            raise ValidationError(e.messages)
