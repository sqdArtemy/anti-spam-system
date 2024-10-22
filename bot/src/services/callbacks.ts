import { Context, InlineKeyboard } from "grammy";
import { ITgGroupRepository } from "../interfaces/repositories/tgGroup.interface";
import { TgGroupMemberRepository } from "../repositories/tgGroupMember.repository";
import { TgGroupRepository } from "../repositories/tgGroup.repository";
import { CommandService } from "./command.service";
import { ICommandService } from "../interfaces/services/commandService.interface";
type UserState = "ban_threshold" | "mute_threshold";

export class CallbackService {
  tgGroupRepo: ITgGroupRepository;
  tgMemberRepo: TgGroupMemberRepository;
  userStates: Map<number, UserState>;
  commandsService: ICommandService;

  public constructor() {
    this.tgGroupRepo = TgGroupRepository.getTgGroupRepository();
    this.tgMemberRepo = TgGroupMemberRepository.getTgGroupRepository();
    this.userStates = new Map();
    this.commandsService = new CommandService();
  }

  exitFromMenu = async (ctx: Context) => {
    await ctx.deleteMessage();
  };

  goToSettingsMenu = async (ctx: Context) => {
    await ctx.deleteMessage();
    return await this.commandsService.settingsCommand(ctx);
  };

  banAndMuteConfig = async (ctx: Context) => {
    const keyboard = new InlineKeyboard().row(
      { text: "Ban settings", callback_data: "ban_config" },
      { text: "Mute settings", callback_data: "mute_config" },
      { text: "Exit", callback_data: "go_to_settings" }
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
    Ban threshold: ${group?.banThreshold}
    `);

    const buttons = [
      {
        text: group?.banEnabled ? "Disable ban" : "Enable ban",
        callback_data: `ban_enable_config`,
      },
      { text: "Exit", callback_data: "go_to_settings" },
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
    Mute threshold: ${group?.muteThreshold}
    `);

    const buttons = [
      {
        text: group?.muteEnabled ? "Disable mute" : "Enable mute",
        callback_data: `mute_enable_config`,
      },
      { text: "Exit", callback_data: "go_to_settings" },
    ];

    if (group?.banEnabled) {
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
      "Please enter a number between 1 and 10 for the ban threshold:"
    );
    this.userStates.set(ctx.chat?.id!, "ban_threshold");
  };

  muteThresholdConfig = async (ctx: Context) => {
    await ctx.reply(
      "Please enter a number between 1 and 10 for the mute threshold:"
    );
    this.userStates.set(ctx.chat?.id!, "mute_threshold");
  };

  handleInput = async (ctx: Context) => {
    const userState = this.userStates.get(ctx.chat?.id!);
    if (userState) {
      const input = parseInt(ctx.message?.text || "", 10);
      const groupId = ctx.chat?.id!;

      if (isNaN(input) || input < 1 || input > 10) {
        await ctx.reply("Ebanmisan?");
        if (userState === "ban_threshold") return await this.banConfig(ctx);
        else return await this.muteConfig(ctx);
      }

      if (userState === "ban_threshold") {
        await this.tgGroupRepo.updateGroupParams(groupId, {
          banThreshold: input,
        });

        await ctx.reply(`Ban threshold updated to ${input}.`);
        return await this.banConfig(ctx);
      } else if (userState === "mute_threshold") {
        await this.tgGroupRepo.updateGroupParams(groupId, {
          muteThreshold: input,
        });

        await ctx.reply(`Mute threshold updated to ${input}.`);
        return await this.muteConfig(ctx);
      }

      this.userStates.delete(ctx.chat?.id!);
    }
  };
}
