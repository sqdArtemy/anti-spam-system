import { Bot, BotError, Context } from "grammy";
import dotenv from "dotenv";
import { logger } from "./logger/logger";
import { databaseConfig } from "./models/config";
import { CommandService } from "./services/command.service";
import { errorHandler } from "./middleware/errorHandler";
import { validateAdmin } from "./middleware/validators";
import { SettingsService } from "./services/settings.service";
import { SpamCheckerService } from "./services/spamChecker.service";
import {StatsService} from "./services/stats.service";

dotenv.config({ path: "./.env" });

export const bot = new Bot(process.env.TG_BOT_TOKEN!);
logger.bot.info("Bot is running");

process.on("unhandledRejection", (err: Error): void => {
  logger.system.error("Unhandled Rejection", err);
});

// bot.on("message", (ctx) => ctx.reply("Hi there!"));

const commandService = new CommandService();
commandService.setAllCommands(bot);

bot.command("help", commandService.helpCommand);
bot.command("report", commandService.reportCommand);

bot.command("start", validateAdmin, commandService.startCommand);
bot.command("stop", validateAdmin, commandService.stopCommand);
bot.command("settings", validateAdmin, commandService.settingsCommand);
bot.command("stats", validateAdmin, commandService.statsCommand);

const callbackService = new SettingsService();
const spamCheckerService = new SpamCheckerService();
const statsService = new StatsService();

bot.callbackQuery("exit_config", validateAdmin, callbackService.exitFromMenu);

bot.callbackQuery("users_config", validateAdmin, callbackService.usersConfig);
bot.callbackQuery("reset_sus_counter", validateAdmin, callbackService.resetSusCounterConfig);
bot.callbackQuery(/reset_sus_(\d+)/, validateAdmin, callbackService.resetSusCounter);

bot.callbackQuery("whitelist_config", validateAdmin, callbackService.whitelistConfig);
bot.callbackQuery("whitelist_add", validateAdmin, callbackService.whitelistAddConfig);
bot.callbackQuery(/whitelist_add_(\d+)/, validateAdmin, callbackService.onWhitelistAdd);
bot.callbackQuery("whitelist_remove", validateAdmin, callbackService.whitelistRemoveConfig);
bot.callbackQuery(/whitelist_remove_(\d+)/, validateAdmin, callbackService.onWhitelistRemove);

bot.callbackQuery("action_config", validateAdmin, callbackService.banAndMuteConfig);
bot.callbackQuery("ban_config", validateAdmin, callbackService.banConfig);
bot.callbackQuery("ban_enable_config", validateAdmin, callbackService.banEnableConfig);
bot.callbackQuery("ban_threshold_config", validateAdmin, callbackService.banThresholdConfig);
bot.callbackQuery("mute_config", validateAdmin, callbackService.muteConfig);
bot.callbackQuery("mute_enable_config", validateAdmin, callbackService.muteEnableConfig);
bot.callbackQuery("mute_threshold_config", validateAdmin, callbackService.muteThresholdConfig);

bot.callbackQuery("confidence_config", validateAdmin, callbackService.confidenceConfig);
bot.callbackQuery("sus_confidence", validateAdmin, callbackService.updateSusThreshold);
bot.callbackQuery("spam_confidence", validateAdmin, callbackService.updateSpamThreshold);

bot.callbackQuery("url_stats", validateAdmin, statsService.getUrlStats);
bot.callbackQuery("user_stats", validateAdmin, statsService.getUserStats);
bot.callbackQuery("word_stats", validateAdmin, statsService.getWordStats);

bot.callbackQuery(
  /manual_report_config_(\d+)/,
    validateAdmin,
    spamCheckerService.manualReportConfig,
);
bot.callbackQuery(
  /user_report_config_(\d+)/,
    validateAdmin,
    spamCheckerService.userReportConfig,
);

bot.on("message:text", async (ctx) => {
  await callbackService.handleInput(ctx);
});

bot.catch(async (err: BotError<Context>) => {
  await errorHandler(err);
});

bot.start();

databaseConfig
  .authenticate()
  .then(() => {
    logger.system.info("Connected to Database");
  })
  .catch((err) => {
    logger.system.error(err);
    throw Error;
  });
