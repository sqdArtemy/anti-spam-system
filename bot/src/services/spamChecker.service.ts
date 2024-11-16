import { ISpamCheckerService } from "../interfaces/services/spamCheckerService.interface";
import { CheckRequestModel } from "../models/checkRequest.model";
import { ICheckRequestRepository } from "../interfaces/repositories/checkRequest.interface";
import { CheckRequestRepository } from "../repositories/checkRequest.repository";
import { Connection, WorkflowClient } from "@temporalio/client";
import { IAiModelResponse } from "../interfaces/aiModelResponse.interfance";
import { ITgGroupMemberRepository } from "../interfaces/repositories/tgGroupMember.interface";
import { TgGroupMemberRepository } from "../repositories/tgGroupMember.repository";

export class SpamCheckerService implements ISpamCheckerService {
  checkRequestRepo: ICheckRequestRepository;
  tgMemberRepo: ITgGroupMemberRepository;
  constructor() {
    this.checkRequestRepo = CheckRequestRepository.getCheckRequestRepository();
    this.tgMemberRepo = TgGroupMemberRepository.getTgGroupRepository();
  }

  public async checkSpam(
    text: string,
    tgMemberId: number,
  ): Promise<CheckRequestModel | any> {
    const result = await this.sendRequestToAI(text);
    const spamResponse: IAiModelResponse = JSON.parse(result);

    await this.checkRequestRepo.addCheckRequest({
        tgGroupMemberId: tgMemberId,
        input: text,
        isSus: Boolean(spamResponse.is_suspicious),
        checkTime: spamResponse.time_taken,
        confidence: spamResponse.confidence,
        output: JSON.stringify(spamResponse),
        wordsCount: text.split(" ").length,
    });
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
