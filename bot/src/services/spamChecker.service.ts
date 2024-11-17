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
import { Context, InlineKeyboard } from "grammy";
import { TgGroupMemberModel } from "../models/tgGroupMember.model";
import { TgGroupModel } from "../models/tgGroup.model";

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

    const checkRequest = await this.checkRequestRepo.addCheckRequest({
      tgGroupMemberId: tgMemberId,
      input: text,
      isSus: Boolean(spamResponse.is_suspicious),
      checkTime: spamResponse.time_taken,
      confidence: spamResponse.confidence,
      output: JSON.stringify(spamResponse),
      wordsCount: text.split(" ").length,
    });

    const member = await this.tgMemberRepo.getById(tgMemberId);
    const group = await this.tgGroupRepo.getById(member?.tgGroupId!);

    if (!spamResponse.is_suspicious) return;
    if (checkRequest.confidence >= group?.spamMinConfidence!) {
      await this.handleSpamMessage(ctx, member!, group!, checkRequest);
    } else if (checkRequest.confidence >= group?.susMinConfidence!) {
      await this.handleSusMessage(ctx, checkRequest, member!);
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

  private async handleSpamMessage(
    ctx: Context,
    member: TgGroupMemberModel,
    group: TgGroupModel,
    checkRequest?: CheckRequestModel,
  ) {
    if (member?.isWhitelisted) return;

    const updatedSusCounter = Number(member?.susCounter) + 1;
    await this.tgMemberRepo.updateMember(member.id!, {
      susCounter: updatedSusCounter,
    });

    if (group?.banEnabled && updatedSusCounter >= group?.banThreshold!) {
      await ctx.banChatMember(member?.externalUserId!);
    } else if (
      group?.muteEnabled &&
      updatedSusCounter >= group.muteThreshold!
    ) {
      await this.muteUser(ctx, member!);
    }

    if (checkRequest) {
      await ctx.deleteMessage();
      await this.hidePreviousMessage(ctx, checkRequest);
    }
  }

  private async handleSusMessage(
    ctx: Context,
    checkRequest: CheckRequestModel,
    member: TgGroupMemberModel,
  ) {
    if (member?.isWhitelisted) return;
    await ctx.reply(
      `The message above is ${
        Math.round(checkRequest.confidence * 100) / 100
      }% likely to be a spam. What would you like to do?`,
      {
        reply_to_message_id: ctx.message?.message_id,
        reply_markup: new InlineKeyboard()
          .row({
            text: "Report",
            callback_data: `manual_report_config_${checkRequest.id}`,
          })
          .row({
            text: "Ignore",
            callback_data: "exit_config",
          }),
      },
    );
  }

  private async muteUser(ctx: Context, member: TgGroupMemberModel) {
    const muteUntil = Math.floor(Date.now() / 1000) + 2 * 60;

    await ctx.restrictChatMember(
      member?.externalUserId!,
      {
        can_send_messages: false,
        can_send_audios: false,
        can_send_photos: false,
        can_send_polls: false,
        can_send_other_messages: false,
        can_add_web_page_previews: false,
        can_change_info: false,
        can_invite_users: false,
        can_pin_messages: false,
      },
      { until_date: muteUntil },
    );
  }

  public manualReportConfig = async (ctx: Context) => {
    await this.deletePreviousMessage(ctx);

    const id = ctx.callbackQuery?.data?.split("_")[3];
    if (!id) return;

    const checkRequest = await this.checkRequestRepo.getById(Number(id));
    if (!checkRequest) return;

    const member = await this.tgMemberRepo.getById(
      checkRequest.tgGroupMemberId!,
    );
    const group = await this.tgGroupRepo.getById(member?.tgGroupId!);

    return await this.handleSpamMessage(ctx, member!, group!, checkRequest);
  };

  private deletePreviousMessage = async (ctx: Context) => {
    const originalMessageId =
      ctx.callbackQuery?.message?.reply_to_message?.message_id;

    if (originalMessageId) {
      try {
        await ctx.deleteMessages([originalMessageId]);
      } catch (error) {
        console.error(`Failed to delete original message: ${error}`);
      }
    }
  };

  private hidePreviousMessage = async (
    ctx: Context,
    checkRequest: CheckRequestModel,
  ) => {
    try {
      const replyMessage = `The previous message was deleted as it was considered **${
        Math.round(checkRequest.confidence * 100) / 100
      }% spam**.\n\nOriginal message:\n||${checkRequest.input}||`;
      await ctx.reply(this.escapeMarkdownV2(replyMessage), {
        parse_mode: "MarkdownV2",
      });
    } catch (error) {
      console.error(`Failed to send confirmation message: ${error}`);
    }
  };

  escapeMarkdownV2(text: string): string {
    return text.replace(/([_[\]()~`>#+\-={}.!])/g, "\\$1");
  }

  public userReportConfig = async (ctx: Context) => {
    const externalUserId = ctx.callbackQuery?.data?.split("_")[3];
    const groupId = ctx.chat?.id!;

    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);
    const member = await this.tgMemberRepo.getByGroupIdAndUserId(
      group?.id!,
      Number(externalUserId!),
    );

    await ctx.deleteMessage();
    await this.handleSpamMessage(ctx, member!, group!);
    await this.deletePreviousMessage(ctx);
    await this.hideReportedMessage(ctx);
  };

  private hideReportedMessage = async (ctx: Context) => {
    try {
      const originalMessage = ctx.callbackQuery?.message?.reply_to_message;

      const replyMessage = `The previous message was deleted as it was reported
      \n\nOriginal message:\n||${originalMessage?.text}||`;
      await ctx.reply(this.escapeMarkdownV2(replyMessage), {
        parse_mode: "MarkdownV2",
      });
    } catch (error) {
      console.error(`Failed to send confirmation message: ${error}`);
    }
  };
}
