import { ITgGroupRepository } from "../../interfaces/repositories/tgGroup.interface";
import { TgGroupMemberRepository } from "../../repositories/tgGroupMember.repository";
import { TgGroupRepository } from "../../repositories/tgGroup.repository";
import { Context, InlineKeyboard } from "grammy";
import { UserState } from "../settings.service";

export class ConfidenceSettingsService {
  tgGroupRepo: ITgGroupRepository;
  tgMemberRepo: TgGroupMemberRepository;
  userStates: Map<number, UserState>;

  public constructor(userStates: Map<number, UserState>) {
    this.tgGroupRepo = TgGroupRepository.getTgGroupRepository();
    this.tgMemberRepo = TgGroupMemberRepository.getTgGroupRepository();
    this.userStates = userStates;
  }

  confidenceConfig = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);

    await ctx.reply(`
    Current confidence settings:
    Sus confidence: ${group?.susMinConfidence!}
    Spam confidence: ${group?.spamMinConfidence!}
    `);

    await ctx.reply("Please choose an option:", {
      reply_markup: new InlineKeyboard()
        .row({
          text: "Update sus confidence",
          callback_data: "sus_confidence",
        })
        .row({
          text: "Update spam confidence",
          callback_data: "spam_confidence",
        })
        .row({ text: "Exit", callback_data: "exit_config" }),
    });
  };

  updateSusThreshold = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);

    await ctx.reply(
      `Please enter a number between 70 and ${group?.spamMinConfidence!} for the minimum confidence:`,
    );
    this.userStates.set(ctx.chat?.id!, "sus_threshold");
  };

  updateSpamThreshold = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);

    await ctx.reply(
      `Please enter a number between ${group?.susMinConfidence!} and 99 for the minimum confidence:`,
    );
    this.userStates.set(ctx.chat?.id!, "spam_threshold");
  };
}
