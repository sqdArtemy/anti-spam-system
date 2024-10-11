import asyncio
import os
import json

from temporalio.client import Client
from workflow import AnalyzeEmailWorkflow
from dotenv import load_dotenv


load_dotenv()
email = """Dear Customer,

To ensure the continued security of your account, we need you to update your account details. Please verify your information by October 5th, 2024 to avoid any disruption in service.

Click here to update your account:
Update Account

Thank you for helping us keep your account safe.

Best regards,
Customer Support
[Company Name]"""


async def start_workflow():
    client = await Client.connect(os.getenv("TEMPORAL_URL"))

    result = await client.execute_workflow(
        AnalyzeEmailWorkflow.run,
        json.dumps({'email': email, 'image_path': '', 'words_number': 10}),
        id="analyze-email-workflow-id",
        task_queue=os.getenv('TASK_QUEUE'),
    )

    print(f"Workflow result: {result}")

    result_2 = await client.execute_workflow(
        AnalyzeEmailWorkflow.run,
        json.dumps({'email': '', 'image_path': 'images/test.png', 'words_number': 10}),
        id="analyze-email-workflow-id",
        task_queue=os.getenv('TASK_QUEUE'),
    )

    print(f"Workflow result 2: {result_2}")


if __name__ == '__main__':
    asyncio.run(start_workflow())
