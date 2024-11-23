from http import HTTPStatus

import pandas as pd
import requests
from flask_jwt_extended import jwt_required
from flask_restful import Resource

from db_init import db
from schemas import SusErrorCreateSchema


class AssignCheckRequestsAPI(Resource):
    create_sus_error_schema = SusErrorCreateSchema()

    @jwt_required()
    def get(self):
        quantity = 100
        dataset_path = "media/emails.csv"
        try:
            df = pd.read_csv(dataset_path)
        except Exception as e:
            return {"message": f"Error loading dataset: {str(e)}"}, HTTPStatus.INTERNAL_SERVER_ERROR

        if len(df) < quantity:
            return {"message": "Not enough data in the dataset."}, HTTPStatus.BAD_REQUEST

        sampled_data = df.sample(n=quantity)

        results = []

        for _, row in sampled_data.iterrows():
            email_content = row["text"]
            spam_label = row["spam"]

            try:
                response = requests.post(
                    "http://127.0.0.1:5000/analyze",
                    data={
                        "text": email_content,
                        "word_number": 10
                    }
                )

                if response.status_code == HTTPStatus.OK:
                    api_result = response.json()
                    sus = self.create_sus_error_schema.load({
                        "check_request_id": api_result["id"],
                        "is_game": True,
                        "actual_sus": spam_label
                    })
                    db.session.add(sus)
                    db.session.commit()

                else:
                    return {
                        "message": f"API call failed for email: {email_content}",
                        "status_code": response.status_code,
                        "error": response.text
                    }, HTTPStatus.INTERNAL_SERVER_ERROR

            except Exception as e:
                return {"message": f"Error calling API: {str(e)}"}, HTTPStatus.INTERNAL_SERVER_ERROR

        return results, HTTPStatus.OK
