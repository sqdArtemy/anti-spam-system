import { Bot, BotError, Context } from "grammy";
import dotenv from "dotenv";
import { logger } from "./logger/logger";
import { databaseConfig } from "./models/config";
import { CommandService } from "./services/command.service";
import { errorHandler } from "./middleware/errorHandler";
import { validateAdmin } from "./middleware/validators";
import { SettingsService } from "./services/settings.service";
import { SpamCheckerService } from "./services/spamChecker.service";

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

// for all other commands allow access only for admin
bot.use(validateAdmin);
bot.command("start", commandService.startCommand);
bot.command("stop", commandService.stopCommand);
bot.command("settings", commandService.settingsCommand);
bot.command("stats", commandService.statsCommand);

const callbackService = new SettingsService();
const spamCheckerService = new SpamCheckerService();

bot.callbackQuery("exit_config", callbackService.exitFromMenu);

bot.callbackQuery("users_config", callbackService.usersConfig);
bot.callbackQuery("reset_sus_counter", callbackService.resetSusCounterConfig);
bot.callbackQuery(/reset_sus_(\d+)/, callbackService.resetSusCounter);

bot.callbackQuery("whitelist_config", callbackService.whitelistConfig);
bot.callbackQuery("whitelist_add", callbackService.whitelistAddConfig);
bot.callbackQuery(/whitelist_add_(\d+)/, callbackService.onWhitelistAdd);
bot.callbackQuery("whitelist_remove", callbackService.whitelistRemoveConfig);
bot.callbackQuery(/whitelist_remove_(\d+)/, callbackService.onWhitelistRemove);

bot.callbackQuery("action_config", callbackService.banAndMuteConfig);
bot.callbackQuery("ban_config", callbackService.banConfig);
bot.callbackQuery("ban_enable_config", callbackService.banEnableConfig);
bot.callbackQuery("ban_threshold_config", callbackService.banThresholdConfig);
bot.callbackQuery("mute_config", callbackService.muteConfig);
bot.callbackQuery("mute_enable_config", callbackService.muteEnableConfig);
bot.callbackQuery("mute_threshold_config", callbackService.muteThresholdConfig);

bot.callbackQuery("confidence_config", callbackService.confidenceConfig);
bot.callbackQuery("sus_confidence", callbackService.updateSusThreshold);
bot.callbackQuery("spam_confidence", callbackService.updateSpamThreshold);

bot.callbackQuery(
  /manual_report_config_(\d+)/,
  spamCheckerService.manualReportConfig,
);
bot.callbackQuery(
  /user_report_config_(\d+)/,
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
