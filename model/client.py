import asyncio
import time
from temporalio.client import Client
from workflow import AnalyzeEmailWorkflow


email_1 = """Dear Customer,

To ensure the continued security of your account, we need you to update your account details. Please verify your information by October 5th, 2024 to avoid any disruption in service.

Click here to update your account:
Update Account

Thank you for helping us keep your account safe.

Best regards,
Customer Support
[Company Name]"""

email_2 = """I LOVE SEX SEX SEX SEX SEX, I WANT BIG TITS AND COCKS AND ASSES!!!! ANd ALSO MORE FREE WHORES!"""

async def start_workflow():
    client = await Client.connect("localhost:7233")

    b1 = time.time()
    result = await client.execute_workflow(
        AnalyzeEmailWorkflow.run,
        email_1,
        id="analyze-email-workflow-id",
        task_queue="analyze-tasks"
    )
    a1 = time.time()

    print(f"Workflow result: {result} in {a1 - b1} seconds")

    b2 = time.time()
    result_2 = await client.execute_workflow(
        AnalyzeEmailWorkflow.run,
        email_2,
        id="analyze-email-workflow-id",
        task_queue="analyze-tasks"
    )
    a2 = time.time()

    print(f"Workflow result 2: {result_2} in {a2 - b2} seconds")


if __name__ == '__main__':
    asyncio.run(start_workflow())
