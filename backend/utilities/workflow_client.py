import asyncio
import json
import os

from temporalio.client import Client


class WorkflowClient:
    @staticmethod
    async def execute_workflow(payload):
        client = await Client.connect(os.getenv("TEMPORAL_URL"))

        result = await client.execute_workflow(
            "AnalyzeEmailWorkflow",
            json.dumps(payload),
            id="analyze-email-workflow-id",
            task_queue=os.getenv('TASK_QUEUE'),
        )

        return result

    @staticmethod
    def run_workflow(payload):
        """
        This method wraps the async execution in a sync function for Flask compatibility.
        """
        return asyncio.run(WorkflowClient.execute_workflow(payload))
