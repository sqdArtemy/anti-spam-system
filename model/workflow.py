import json
import logging
from datetime import timedelta
from temporalio import activity, workflow
with workflow.unsafe.imports_passed_through():
    from minio import Minio
    from core.model_interface import predict_email
    from core.text_extractor import extract_text_from_image


class AnalyzeEmailActivity:
    def __init__(self, model, vectorizer):
        self.model = model
        self.vectorizer = vectorizer

    @activity.defn
    async def analyze_email(self, data: str) -> str:
        json_data = json.loads(data)
        email = json_data.get("email")
        words_number = int(json_data.get("words_number"))

        logging.info(f"Analyzing email: {email}")
        result = predict_email(
            email=email,
            model=self.model,
            vectorizer=self.vectorizer,
            top_n=words_number
        )
        logging.info(f"Analysis result: {result}")

        return result


class ExtractTextActivity:
    def __init__(self, minio_client: Minio):
        self.minio_client = minio_client

    @activity.defn
    async def extract_text(self, image_path: str) -> str:
        logging.info(f"Extracting text from image: {image_path}")
        text = extract_text_from_image(
            image_path=image_path,
            minio_client=self.minio_client
        )
        logging.info(f"Extracted text: {text}")
        return text


@workflow.defn
class AnalyzeEmailWorkflow:
    @workflow.run
    async def run(self, data: str) -> str:
        json_data = json.loads(data)
        image_path = json_data.get("image_path")

        if image_path:
            email = await workflow.execute_activity(
                ExtractTextActivity.extract_text,
                image_path,
                schedule_to_close_timeout=timedelta(seconds=10)
            )
            json_data["email"] = email

        return await workflow.execute_activity(
            AnalyzeEmailActivity.analyze_email,
            json.dumps(json_data),
            schedule_to_close_timeout=timedelta(seconds=10)
        )
