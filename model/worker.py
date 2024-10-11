import asyncio
import logging
from temporalio.client import Client
from temporalio.worker import Worker
from temporalio import workflow as wf
with wf.unsafe.imports_passed_through():
    import dill as pickle
    from core.model_interface import predict_email, preprocess_text, tokenizer

    with open("./core/vocab.pkl", "rb") as file:
        vectorizer = pickle.load(file)
    with open("./core/model.pkl", "rb") as file:
        model = pickle.load(file)

from workflow import AnalyzeEmailWorkflow, AnalyzeEmailActivity, ExtractTextActivity


async def main():
    client = await Client.connect("localhost:7233")
    activity = AnalyzeEmailActivity(model=model, vectorizer=vectorizer)
    text_extract_activity = ExtractTextActivity()

    worker = Worker(
        client,
        task_queue="analyze-tasks",
        workflows=[AnalyzeEmailWorkflow],
        activities=[activity.analyze_email, text_extract_activity.extract_text],
    )

    await worker.run()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
