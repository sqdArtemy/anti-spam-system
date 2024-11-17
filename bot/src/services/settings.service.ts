import { Context, InlineKeyboard } from "grammy";
import { ITgGroupRepository } from "../interfaces/repositories/tgGroup.interface";
import { TgGroupMemberRepository } from "../repositories/tgGroupMember.repository";
import { TgGroupRepository } from "../repositories/tgGroup.repository";
import { CommandService } from "./command.service";
import { ICommandService } from "../interfaces/services/commandService.interface";
import { TgGroupModel } from "../models/tgGroup.model";
import { Op } from "sequelize";
import { ISpamCheckerService } from "../interfaces/services/spamCheckerService.interface";
import { SpamCheckerService } from "./spamChecker.service";
import { ISettingsService } from "../interfaces/services/settingsService.interface";
import { UserSettingsService } from "./settings/userSettings.service";
import { WhitelistSettingsService } from "./settings/whitelistSettings.service";
import { BanSettingsService } from "./settings/banSettings.service";
import { ConfidenceSettingsService } from "./settings/confidenceSettings.service";

export type UserState =
  | "ban_threshold"
  | "mute_threshold"
  | "sus_threshold"
  | "spam_threshold";

export class SettingsService implements ISettingsService {
  tgGroupRepo: ITgGroupRepository;
  tgMemberRepo: TgGroupMemberRepository;
  userStates: Map<number, UserState>;
  commandsService: ICommandService;
  spamCheckerService: ISpamCheckerService;
  userSettingsService: UserSettingsService;
  whitelistSettingsService: WhitelistSettingsService;
  banSettingsService: BanSettingsService;
  confidenceSettingsService: ConfidenceSettingsService;

  public constructor() {
    this.tgGroupRepo = TgGroupRepository.getTgGroupRepository();
    this.tgMemberRepo = TgGroupMemberRepository.getTgGroupRepository();
    this.userStates = new Map();
    this.commandsService = new CommandService();
    this.spamCheckerService = new SpamCheckerService();
    this.userSettingsService = new UserSettingsService();
    this.whitelistSettingsService = new WhitelistSettingsService();
    this.banSettingsService = new BanSettingsService(this.userStates);
    this.confidenceSettingsService = new ConfidenceSettingsService(
      this.userStates,
    );
  }

  exitFromMenu = async (ctx: Context) => {
    await ctx.deleteMessage();
  };

  banAndMuteConfig = async (ctx: Context) => {
    return await this.banSettingsService.banAndMuteConfig(ctx);
  };

  banConfig = async (ctx: Context) => {
    return await this.banSettingsService.banConfig(ctx);
  };

  banEnableConfig = async (ctx: Context) => {
    return await this.banSettingsService.banEnableConfig(ctx);
  };

  muteConfig = async (ctx: Context) => {
    return await this.banSettingsService.muteConfig(ctx);
  };

  muteEnableConfig = async (ctx: Context) => {
    return await this.banSettingsService.muteEnableConfig(ctx);
  };

  banThresholdConfig = async (ctx: Context) => {
    return await this.banSettingsService.banThresholdConfig(ctx);
  };

  muteThresholdConfig = async (ctx: Context) => {
    return await this.banSettingsService.muteThresholdConfig(ctx);
  };

  handleInput = async (ctx: Context) => {
    const userState = this.userStates.get(ctx.chat?.id!);
    const groupId = ctx.chat?.id!;
    const memberId = ctx.from?.id!;

    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);

    let member = await this.tgMemberRepo.getByGroupIdAndUserId(
      group?.id!,
      memberId,
    );
    if (!member) {
      const username = ctx.from?.username!;
      await this.tgMemberRepo.addMember(group?.id!, memberId, username);
    }

    if (userState) {
      const input = parseInt(ctx.message?.text || "", 10);
      switch (userState) {
        case "ban_threshold":
          await this.handleBanThreshold(ctx, input, groupId);
          break;
        case "mute_threshold":
          await this.handleMuteThreshold(ctx, input, groupId);
          break;
        case "sus_threshold":
          await this.handleSusThreshold(ctx, input, group!);
          break;
        case "spam_threshold":
          await this.handleSpamThreshold(ctx, input, group!);
          break;
      }

      this.userStates.delete(ctx.chat?.id!);
    } else {
      if (!group?.botEnabled) return;

      const memberId = ctx.from?.id!;
      const member = await this.tgMemberRepo.getByGroupIdAndUserId(
        group?.id!,
        memberId,
      );

      const message = ctx.message?.text || "";
      if (message.length > 20 && message.split(" ").length >= 5) {
        await this.spamCheckerService.checkSpam(ctx, message, member?.id!);
      }
    }
  };

  private handleBanThreshold = async (
    ctx: Context,
    input: number,
    groupId: number,
  ) => {
    if (isNaN(input) || input < 1 || input > 10) {
      await ctx.reply("Ebanmisan?");
      return await this.banConfig(ctx);
    }

    await this.tgGroupRepo.updateGroupParams(groupId, {
      banThreshold: input,
    });

    await ctx.reply(`Ban threshold updated to ${input}.`);
    return await this.banConfig(ctx);
  };

  private handleMuteThreshold = async (
    ctx: Context,
    input: number,
    groupId: number,
  ) => {
    if (isNaN(input) || input < 1 || input > 10) {
      await ctx.reply("Ebanmisan?");
      return await this.muteConfig(ctx);
    }

    await this.tgGroupRepo.updateGroupParams(groupId, {
      muteThreshold: input,
    });

    await ctx.reply(`Mute threshold updated to ${input}.`);
    return await this.muteConfig(ctx);
  };

  private handleSusThreshold = async (
    ctx: Context,
    input: number,
    group: TgGroupModel,
  ) => {
    if (
      isNaN(input) ||
      input < 70 ||
      input > 99 ||
      (group?.spamMinConfidence && input >= group?.spamMinConfidence!)
    ) {
      await ctx.reply("Please enter a valid number between 70 and 99.");
      return await this.confidenceConfig(ctx);
    }

    await this.tgGroupRepo.updateGroupParams(group.externalGroupId!, {
      susMinConfidence: input,
    });

    await ctx.reply(`Minimum confidence updated to ${input}.`);
    return await this.confidenceConfig(ctx);
  };

  private handleSpamThreshold = async (
    ctx: Context,
    input: number,
    group: TgGroupModel,
  ) => {
    if (
      isNaN(input) ||
      input < 70 ||
      input > 99 ||
      input <= group?.susMinConfidence!
    ) {
      await ctx.reply("Please enter a valid number between 70 and 99.");
      return await this.confidenceConfig(ctx);
    }

    await this.tgGroupRepo.updateGroupParams(group.externalGroupId!, {
      spamMinConfidence: input,
    });

    await ctx.reply(`Minimum confidence updated to ${input}.`);
    return await this.confidenceConfig(ctx);
  };

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

  whitelistConfig = async (ctx: Context) => {
    return await this.whitelistSettingsService.whitelistConfig(ctx);
  };

  whitelistAddConfig = async (ctx: Context) => {
    return await this.whitelistSettingsService.whitelistAddConfig(ctx);
  };

  onWhitelistAdd = async (ctx: Context) => {
    return await this.whitelistSettingsService.onWhitelistAdd(ctx);
  };

  whitelistRemoveConfig = async (ctx: Context) => {
    return await this.whitelistSettingsService.whitelistRemoveConfig(ctx);
  };

  onWhitelistRemove = async (ctx: Context) => {
    return await this.whitelistSettingsService.onWhitelistRemove(ctx);
  };

  usersConfig = async (ctx: Context) => {
    return await this.userSettingsService.usersConfig(ctx);
  };

  resetSusCounterConfig = async (ctx: Context) => {
    return await this.userSettingsService.resetSusCounterConfig(ctx);
  };

  resetSusCounter = async (ctx: Context) => {
    return await this.userSettingsService.resetSusCounter(ctx);
  };
}
