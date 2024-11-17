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

type UserState =
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

  public constructor() {
    this.tgGroupRepo = TgGroupRepository.getTgGroupRepository();
    this.tgMemberRepo = TgGroupMemberRepository.getTgGroupRepository();
    this.userStates = new Map();
    this.commandsService = new CommandService();
    this.spamCheckerService = new SpamCheckerService();
  }

  exitFromMenu = async (ctx: Context) => {
    await ctx.deleteMessage();
  };

  banAndMuteConfig = async (ctx: Context) => {
    const keyboard = new InlineKeyboard().row(
      { text: "Ban settings", callback_data: "ban_config" },
      { text: "Mute settings", callback_data: "mute_config" },
      { text: "Exit", callback_data: "exit_config" },
    );

    await ctx.reply("Please choose an option:", {
      reply_markup: keyboard,
    });
  };

  banConfig = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);

    await ctx.reply(`
    Current ban settings:
    Ban enabled: ${group?.banEnabled === true ? "Yes" : "No"}
    Ban threshold: ${Number(group?.banThreshold)}
    `);

    const buttons = [
      {
        text: group?.banEnabled ? "Disable ban" : "Enable ban",
        callback_data: `ban_enable_config`,
      },
      { text: "Exit", callback_data: "exit_config" },
    ];

    if (group?.banEnabled) {
      buttons.unshift({
        text: "Change ban settings",
        callback_data: "ban_threshold_config",
      });
    }

    const keyboard = new InlineKeyboard().row(...buttons);

    await ctx.reply("Please choose an option:", {
      reply_markup: keyboard,
    });
  };

  banEnableConfig = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    let group = await this.tgGroupRepo.getByExternalGroupId(groupId);
    group = await this.tgGroupRepo.updateGroupParams(groupId, {
      banEnabled: !group?.banEnabled,
    });

    if (!group?.banEnabled) await ctx.reply("Ban has been disabled");
    else await ctx.reply("Ban has been enabled");

    return await this.banConfig(ctx);
  };

  muteConfig = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);

    await ctx.reply(`
    Current mute settings:
    Mute enabled: ${group?.muteEnabled === true ? "Yes" : "No"}
    Mute threshold: ${Number(group?.muteThreshold)}
    `);

    const buttons = [
      {
        text: group?.muteEnabled ? "Disable mute" : "Enable mute",
        callback_data: `mute_enable_config`,
      },
      { text: "Exit", callback_data: "exit_config" },
    ];

    if (group?.muteEnabled) {
      buttons.unshift({
        text: "Change mute settings",
        callback_data: "mute_threshold_config",
      });
    }

    const keyboard = new InlineKeyboard().row(...buttons);

    await ctx.reply("Please choose an option:", {
      reply_markup: keyboard,
    });
  };

  muteEnableConfig = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    let group = await this.tgGroupRepo.getByExternalGroupId(groupId);
    group = await this.tgGroupRepo.updateGroupParams(groupId, {
      muteEnabled: !group?.muteEnabled,
    });

    if (!group?.banEnabled) await ctx.reply("Mute has been disabled");
    else await ctx.reply("Mute has been enabled");

    return await this.muteConfig(ctx);
  };

  banThresholdConfig = async (ctx: Context) => {
    await ctx.reply(
      "Please enter a number between 1 and 10 for the ban threshold:",
    );
    this.userStates.set(ctx.chat?.id!, "ban_threshold");
  };

  muteThresholdConfig = async (ctx: Context) => {
    await ctx.reply(
      "Please enter a number between 1 and 10 for the mute threshold:",
    );
    this.userStates.set(ctx.chat?.id!, "mute_threshold");
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
    const groupId = ctx.chat?.id!;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);

    const whitelistedMembers = await this.tgMemberRepo.getAllWhitelisted(
      group?.id!,
    );
    const nonWhitelistedMembers = await this.tgMemberRepo.getAllNonWhitelisted(
      group?.id!,
    );

    let message = "Current Whitelisted Members:\n";
    if (whitelistedMembers.length > 0) {
      message += whitelistedMembers
        .map(
          (member) => `- ${member.externalUsername || member.externalUserId}`,
        )
        .join("\n");
    } else {
      message += "No members are currently whitelisted.";
    }

    await ctx.reply(message);

    const buttons = [
      ...(nonWhitelistedMembers.length > 0
        ? [{ text: "Add to whitelist", callback_data: "whitelist_add" }]
        : []),
      ...(whitelistedMembers.length > 0
        ? [{ text: "Remove from whitelist", callback_data: "whitelist_remove" }]
        : []),
      { text: "Exit", callback_data: "exit_config" },
    ];

    const keyboard = new InlineKeyboard().row(...buttons);

    await ctx.reply("Please choose an option:", {
      reply_markup: keyboard,
    });
  };

  whitelistAddConfig = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);
    const nonWhitelistedMembers = await this.tgMemberRepo.getAllNonWhitelisted(
      group?.id!,
    );

    if (nonWhitelistedMembers.length === 0) {
      await ctx.reply("All members are already whitelisted.");
      return;
    }

    const keyboard = new InlineKeyboard();
    nonWhitelistedMembers.forEach((member) => {
      keyboard.row({
        text: member.externalUsername || String(member.externalUserId),
        callback_data: `whitelist_add_${member.id}`,
      });
    });
    keyboard.row({ text: "Exit", callback_data: "exit_config" });

    await ctx.reply("Select a member to add to the whitelist:", {
      reply_markup: keyboard,
    });
  };

  onWhitelistAdd = async (ctx: Context) => {
    if (ctx.match && ctx.match[1]) {
      const memberId = parseInt(ctx.match[1], 10);

      await this.tgMemberRepo.updateMember(memberId, {
        isWhitelisted: true,
      });

      await ctx.reply("Member has been added to the whitelist.");
      return await this.whitelistConfig(ctx);
    }
  };

  whitelistRemoveConfig = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);

    const whitelistedMembers = await this.tgMemberRepo.getAllWhitelisted(
      group?.id!,
    );

    if (whitelistedMembers.length === 0) {
      await ctx.reply("No members are currently whitelisted.");
      return;
    }

    const keyboard = new InlineKeyboard();
    whitelistedMembers.forEach((member) => {
      keyboard.row({
        text: member.externalUsername || String(member.externalUserId),
        callback_data: `whitelist_remove_${member.id}`,
      });
    });
    keyboard.row({ text: "Exit", callback_data: "exit_config" });

    await ctx.reply("Select a member to remove from the whitelist:", {
      reply_markup: keyboard,
    });
  };

  onWhitelistRemove = async (ctx: Context) => {
    if (ctx.match && ctx.match[1]) {
      const memberId = parseInt(ctx.match[1], 10);

      await this.tgMemberRepo.updateMember(memberId, {
        isWhitelisted: false,
      });

      await ctx.reply("Member has been removed from the whitelist.");
      return await this.whitelistConfig(ctx);
    }
  };

  usersConfig = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);

    const members = await this.tgMemberRepo.getAllByFilters({
      tgGroupId: group?.id,
    });

    if (members.length === 0) {
      await ctx.reply("No members found in this group.");
      return;
    }

    // Format all members' data into a single message
    let message = "Group Members:\n\n";
    members.forEach((member) => {
      message += `
      Username: ${member.externalUsername || String(member.externalUserId)}
      Suspicious Messages: ${member.susCounter}
      Blacklisted: ${member.isBlacklisted ? "Yes" : "No"}
      Created At: ${member.createdAt}
      
      `;
    });

    const keyboard = new InlineKeyboard()
      .row({ text: "Reset Sus Counter", callback_data: "reset_sus_counter" })
      .row({ text: "Exit", callback_data: "exit_config" });

    await ctx.reply(message.trim(), {
      reply_markup: keyboard,
    });
  };

  resetSusCounterConfig = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);
    const members = await this.tgMemberRepo.getAllByFilters({
      tgGroupId: group?.id,
      susCounter: { [Op.gt]: 0 },
    });

    if (members.length === 0) {
      await ctx.reply("No members available to reset.");
      return;
    }

    const keyboard = new InlineKeyboard();
    members.forEach((member) => {
      keyboard.row({
        text: member.externalUsername || String(member.externalUserId),
        callback_data: `reset_sus_${member.id}`,
      });
    });
    keyboard.row({ text: "Exit", callback_data: "exit_config" });

    await ctx.reply(
      "Select a user to reset their suspicious message counter:",
      {
        reply_markup: keyboard,
      },
    );
  };

  resetSusCounter = async (ctx: Context) => {
    if (ctx.match && ctx.match[1]) {
      const memberId = parseInt(ctx.match[1], 10);

      await this.tgMemberRepo.updateMember(memberId, {
        susCounter: 0,
      });

      await ctx.reply(
        "Suspicious message counter has been reset for the selected user.",
      );

      return await this.usersConfig(ctx);
    }
  };
}
