import logging
from datetime import timedelta
from temporalio import activity, workflow
with workflow.unsafe.imports_passed_through():
    from core.model_interface import predict_email


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


@workflow.defn
class AnalyzeEmailWorkflow:
    @workflow.run
    async def run(self, email: str) -> str:
        return await workflow.execute_activity(
            AnalyzeEmailActivity.analyze_email,
            email,
            schedule_to_close_timeout=timedelta(seconds=10)
        )
