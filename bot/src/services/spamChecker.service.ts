import { ISpamCheckerService } from "../interfaces/services/spamCheckerService.interface";
import { CheckRequestModel } from "../models/checkRequest.model";
import { ICheckRequestRepository } from "../interfaces/repositories/checkRequest.interface";
import { CheckRequestRepository } from "../repositories/checkRequest.repository";
import { Connection, WorkflowClient } from "@temporalio/client";
import { IAiModelResponse } from "../interfaces/aiModelResponse.interfance";
import { ITgGroupMemberRepository } from "../interfaces/repositories/tgGroupMember.interface";
import { TgGroupMemberRepository } from "../repositories/tgGroupMember.repository";
import { ITgGroupRepository } from "../interfaces/repositories/tgGroup.interface";
import { TgGroupRepository } from "../repositories/tgGroup.repository";
import { Context } from "grammy";

export class SpamCheckerService implements ISpamCheckerService {
  checkRequestRepo: ICheckRequestRepository;
  tgMemberRepo: ITgGroupMemberRepository;
  tgGroupRepo: ITgGroupRepository;
  constructor() {
    this.checkRequestRepo = CheckRequestRepository.getCheckRequestRepository();
    this.tgMemberRepo = TgGroupMemberRepository.getTgGroupRepository();
    this.tgGroupRepo = TgGroupRepository.getTgGroupRepository();
  }

  public async checkSpam(
    ctx: Context,
    text: string,
    tgMemberId: number,
  ): Promise<void> {
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

    if (spamResponse.is_suspicious) {
      await this.handleSuspiciousSpam(ctx, tgMemberId);
    }
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

  private async handleSuspiciousSpam(ctx: Context, tgMemberId: number) {
    const member = await this.tgMemberRepo.getById(tgMemberId);
    const group = await this.tgGroupRepo.getById(member?.tgGroupId!);

    const updatedSusCounter = Number(member?.susCounter) + 1;
    await this.tgMemberRepo.updateMember(tgMemberId, {
      susCounter: updatedSusCounter,
    });

    if (group?.botEnabled && updatedSusCounter >= group?.banThreshold!) {
    } else if (
      group?.muteEnabled &&
      updatedSusCounter >= group.muteThreshold!
    ) {
    }
  }
}
