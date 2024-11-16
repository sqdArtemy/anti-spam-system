import { ISpamCheckerService } from "../interfaces/services/spamCheckerService.interface";
import { CheckRequestModel } from "../models/checkRequest.model";
import { ICheckRequestRepository } from "../interfaces/repositories/checkRequest.interface";
import { CheckRequestRepository } from "../repositories/checkRequest.repository";
import { Connection, WorkflowClient } from "@temporalio/client";

export class SpamCheckerService implements ISpamCheckerService {
  checkRequestRepo: ICheckRequestRepository;
  constructor() {
    this.checkRequestRepo = CheckRequestRepository.getCheckRequestRepository();
  }

  public async checkSpam(
    text: string,
    tgMemberId: number,
  ): Promise<CheckRequestModel | any> {
    const result = await this.sendRequestToAI(text);
    console.log(result);
  }

  private async sendRequestToAI(text: string) {
    const connection = await Connection.connect({
      address: process.env.WORKER_ADDRESS!,
    });
    const client = new WorkflowClient({ connection });

    const handle = await client.start("AnalyzeEmailWorkflow", {
      args: [text],
      taskQueue: process.env.TASK_QUEUE!,
      workflowId: "analyze-email-workflow-id6",
    });

    console.log(`Started workflow with ID: ${handle.workflowId}`);

    return await handle.result();
  }
}
