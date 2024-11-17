import { ITgGroupRepository } from "../../interfaces/repositories/tgGroup.interface";
import { TgGroupMemberRepository } from "../../repositories/tgGroupMember.repository";
import { TgGroupRepository } from "../../repositories/tgGroup.repository";
import { Context, InlineKeyboard } from "grammy";
import { UserState } from "../settings.service";

export class BanSettingsService {
  tgGroupRepo: ITgGroupRepository;
  tgMemberRepo: TgGroupMemberRepository;
  userStates: Map<number, UserState>;

  public constructor(userStates: Map<number, UserState>) {
    this.tgGroupRepo = TgGroupRepository.getTgGroupRepository();
    this.tgMemberRepo = TgGroupMemberRepository.getTgGroupRepository();
    this.userStates = userStates;
  }

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
}
