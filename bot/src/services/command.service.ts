import { Bot, Context, InlineKeyboard } from "grammy";
import { TgGroupRepository } from "../repositories/tgGroup.repository";
import { TgGroupMemberRepository } from "../repositories/tgGroupMember.repository";
import { ITgGroupRepository } from "../interfaces/repositories/tgGroup.interface";
import { ICommandService } from "../interfaces/services/commandService.interface";

export class CommandService implements ICommandService {
  tgGroupRepo: ITgGroupRepository;
  tgMemberRepo: TgGroupMemberRepository;

  public constructor() {
    this.tgGroupRepo = TgGroupRepository.getTgGroupRepository();
    this.tgMemberRepo = TgGroupMemberRepository.getTgGroupRepository();
  }

  startCommand = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    const userId = ctx.from?.id!;
    const username = ctx.from?.username!;

    let group = await this.tgGroupRepo.getByExternalGroupId(groupId);
    if (!group) {
      group = await this.tgGroupRepo.addGroup(groupId);
      await this.tgMemberRepo.addMember(group.id!, userId, username);

      const botInfo = await ctx.api.getMe();
      const botId = botInfo.id;
      const botUsername = botInfo.username;
      await this.tgMemberRepo.addMember(group.id!, botId, botUsername);
    }

    await this.tgGroupRepo.updateGroupParams(groupId, { botEnabled: true });
    await ctx.reply(`Bot is enabled for this group`);
  };

  stopCommand = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;

    let group = await this.tgGroupRepo.getByExternalGroupId(groupId);
    if (group) {
      await this.tgGroupRepo.updateGroupParams(groupId, { botEnabled: false });
    }
    await ctx.reply(`Bot is disabled for this group`);
  };

  settingsCommand = async (ctx: Context) => {
    const keyboard = new InlineKeyboard()
      .row(
        {
          text: "Model Confidence settings",
          callback_data: "confidence_config",
        },
        { text: "Whitelist settings", callback_data: "whitelist_config" }
      )
      .row(
        { text: "Ban/Mute settings", callback_data: "action_config" },
        { text: "User settings", callback_data: "users_config" }
      )
      .row({ text: "Exit", callback_data: "exit_config" });

    await ctx.reply("Please choose an option:", {
      reply_markup: keyboard,
    });
  };

  statsCommand = async (ctx: Context) => {
    const keyboard = new InlineKeyboard()
      .row(
        { text: "Stats by users", callback_data: "user_stats" },
        { text: "Stats by words", callback_data: "word_stats" }
      )
      .row(
        { text: "Stats by urls", callback_data: "url_stats" },
        { text: "Exit", callback_data: "exits_config" }
      );

    await ctx.reply("Please choose an option:", {
      reply_markup: keyboard,
    });
  };

  helpCommand = async (ctx: Context) => {};

  reportCommand = async (ctx: Context) => {};

  setAllCommands = async (bot: Bot) => {
    const commands = [
      { command: "start", description: "Enable the bot for the group" },
      { command: "stop", description: "Disable the bot for the group" },
      { command: "help", description: "Get help" },
      { command: "settings", description: "Configuration for the bot" },
      { command: "report", description: "Report spam message" },
      {
        command: "stats",
        description: "Get stats about spam detection in the group",
      },
    ];

    await bot.api.setMyCommands(commands);
  };
}
