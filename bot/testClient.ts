import { Connection, WorkflowClient } from '@temporalio/client';

const email = `Congratulations! You've won a free iPhone 15! Click here now to claim your prize: scam-link.com`;

async function startWorkflow() {
    // Connect to the Temporal server
    const connection = await Connection.connect({ address: 'localhost:7233' });

    // Create a WorkflowClient
    const client = new WorkflowClient({ connection });

    // Start the workflow
    const handle = await client.start('AnalyzeEmailWorkflow', {
        args: [JSON.stringify({ email: email, image_path: '', words_number: 10})], // Pass the email as input
        taskQueue: 'analyze-tasks',
        workflowId: 'analyze-email-workflow-id7',
    });

    console.log(`Started workflow with ID: ${handle.workflowId}`);

    // Wait for the result
    const result = await handle.result();
    console.log(`Workflow result: ${result}`);
}

// Run the client
startWorkflow().catch((err) => {
    console.error(err);
    process.exit(1);
});
