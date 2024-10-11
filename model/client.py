import asyncio
import json

from temporalio.client import Client
from workflow import AnalyzeEmailWorkflow


email = """Dear Customer,

To ensure the continued security of your account, we need you to update your account details. Please verify your information by October 5th, 2024 to avoid any disruption in service.

Click here to update your account:
Update Account

Thank you for helping us keep your account safe.

Best regards,
Customer Support
[Company Name]"""


async def start_workflow():
    client = await Client.connect("localhost:7233")

    result = await client.execute_workflow(
        AnalyzeEmailWorkflow.run,
        json.dumps({'email': email, 'image_path': ''}),
        id="analyze-email-workflow-id",
        task_queue="analyze-tasks"
    )

    print(f"Workflow result: {result}")

    result_2 = await client.execute_workflow(
        AnalyzeEmailWorkflow.run,
        json.dumps({'email': '', 'image_path': 'images/test.png'}),
        id="analyze-email-workflow-id",
        task_queue="analyze-tasks"
    )

    print(f"Workflow result 2: {result_2}")


if __name__ == '__main__':
    asyncio.run(start_workflow())
