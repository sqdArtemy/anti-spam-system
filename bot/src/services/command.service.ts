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
        { text: "Whitelist settings", callback_data: "whitelist_config" },
      )
      .row(
        { text: "Ban/Mute settings", callback_data: "action_config" },
        { text: "User settings", callback_data: "users_config" },
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
        { text: "Stats by words", callback_data: "word_stats" },
      )
      .row(
        { text: "Stats by urls", callback_data: "url_stats" },
        { text: "Exit", callback_data: "exits_config" },
      );

    await ctx.reply("Please choose an option:", {
      reply_markup: keyboard,
    });
  };

  helpCommand = async (ctx: Context) => {
    const helpMessage = `
      <b>Bot Commands Guide</b>
      Welcome! Here’s an overview of what each command does:
      
      <b>/start</b> - <i>Enable the bot in this group.</i>
      Use this command to activate the bot's functionalities for your group. Once enabled, the bot will start monitoring and protecting the group according to its settings.
      
      <b>/stop</b> - <i>Disable the bot in this group.</i>
      This command deactivates the bot for the group, pausing all automated actions and settings temporarily. Use this if you want to stop the bot from operating without removing it from the group.
      
      <b>/help</b> - <i>Access a detailed guide of commands and bot features.</i>
      Displays this help message with details on each command. Use this to better understand what each command does.
      
      <b>/settings</b> - <i>Adjust bot configurations.</i>
      With this command, you can customize the bot’s settings, such as spam sensitivity, actions on detection, and other group-specific configurations.
      
      <b>/report</b> - <i>Report a message as spam.</i>
      If you see a spam or inappropriate message, use this command to alert the bot, which will evaluate the message and take appropriate action.
      
      <b>/stats</b> - <i>View spam detection statistics.</i>
      Get insights into the bot’s spam detection performance in the group. See stats like the number of messages flagged, spam messages handled, and more.
      
      <i>For more detailed information, please refer to the Telegraph page linked below.</i>
    `;

    const telegraphLink = "https://telegra.ph/Bot-Commands-Guide-11-11-3";

    await ctx.reply(
      helpMessage +
        `<a href="${telegraphLink}">Detailed Guide on Telegraph</a>`,
      {
        parse_mode: "HTML",
      },
    );
  };

  reportCommand = async (ctx: Context) => {
    const repliedMessage = ctx.message?.reply_to_message;
    await ctx.deleteMessage();
    if (repliedMessage) {
      await ctx.reply(
        `The message above has been reported as a spam. What would you like to do?`,
        {
          reply_to_message_id: repliedMessage?.message_id, // Reply to the original user's message
          reply_markup: new InlineKeyboard()
            .row({
              text: "Report",
              callback_data: `user_report_config_${repliedMessage.from?.id}`,
            })
            .row({
              text: "Ignore",
              callback_data: "exit_config",
            }),
        },
      );
    }
  };

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
