import json
import logging
from datetime import timedelta
from temporalio import activity, workflow
with workflow.unsafe.imports_passed_through():
    from core.model_interface import predict_email
    from core.text_extractor import extract_text_from_image


class AnalyzeEmailActivity:
    def __init__(self, model, vectorizer):
        self.model = model
        self.vectorizer = vectorizer

    @activity.defn
    async def analyze_email(self, email: str) -> str:
        logging.info(f"Analyzing email: {email}")
        result = predict_email(
            email=email,
            model=self.model,
            vectorizer=self.vectorizer,
            top_n=5
        )
        logging.info(f"Analysis result: {result}")

        return result


class ExtractTextActivity:
    @activity.defn
    async def extract_text(self, image_path: str) -> str:
        logging.info(f"Extracting text from image: {image_path}")
        text = extract_text_from_image(image_path)
        logging.info(f"Extracted text: {text}")
        return text


@workflow.defn
class AnalyzeEmailWorkflow:
    @workflow.run
    async def run(self, data: str) -> str:
        data_json = json.loads(data)
        email = data_json.get("email")
        image_path = data_json.get("image_path")

        if image_path:
            email = await workflow.execute_activity(
                ExtractTextActivity.extract_text,
                image_path,
                schedule_to_close_timeout=timedelta(seconds=10)
            )

        return await workflow.execute_activity(
            AnalyzeEmailActivity.analyze_email,
            email,
            schedule_to_close_timeout=timedelta(seconds=10)
        )
