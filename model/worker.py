import asyncio
import os
import logging
import re
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from minio import Minio
from temporalio.client import Client
from temporalio.worker import Worker
from temporalio import workflow as wf
from dotenv import load_dotenv
from transformers import pipeline
with wf.unsafe.imports_passed_through():
    import dill as pickle
    from core.model_interface import predict_email, preprocess_text, tokenizer

    with open("./core/vocab.pkl", "rb") as file:
        vectorizer = pickle.load(file)
    with open("./core/model.pkl", "rb") as file:
        model = pickle.load(file)

    sentiment_model = pipeline("sentiment-analysis")

from workflow import AnalyzeEmailWorkflow, AnalyzeEmailActivity, ExtractTextActivity, SentimentAnalysisActivity


async def main():
    temporal_client = await Client.connect(os.getenv("TEMPORAL_URL"))
    minio_client = Minio(
        os.getenv("MINIO_ENDPOINT"),
        access_key=os.getenv("MINIO_ACCESS_KEY"),
        secret_key=os.getenv("MINIO_SECRET_KEY"),
        secure=bool(os.getenv("MINIO_SECURE")),
    )

    activity = AnalyzeEmailActivity(model=model, vectorizer=vectorizer)
    text_extract_activity = ExtractTextActivity(minio_client=minio_client)
    sentiment_analysis_activity = SentimentAnalysisActivity(analysis_model=sentiment_model)

    worker = Worker(
        temporal_client,
        task_queue=os.getenv("TASK_QUEUE"),
        workflows=[AnalyzeEmailWorkflow],
        activities=[
            activity.analyze_email,
            text_extract_activity.extract_text,
            sentiment_analysis_activity.analyze_sentiment,

        ],
    )

    await worker.run()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    load_dotenv()
    asyncio.run(main())
