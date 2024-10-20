import { Bot, BotError, Context } from "grammy";
import dotenv from "dotenv";
import { logger } from "./logger/logger";
import { databaseConfig } from "./models/config";
import { commands, stopService } from "./services/commands";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config({ path: "./.env" });

export const bot = new Bot(process.env.TG_BOT_TOKEN!);
logger.bot.info("Bot is running");

databaseConfig
  .authenticate()
  .then(() => {
    logger.system.info("Connected to Database");
  })
  .catch((err) => {
    logger.system.error(err);
    throw Error;
  });

process.on("unhandledRejection", (err: Error): void => {
  logger.system.error("Unhandled Rejection", err);
});

// bot.on("message", (ctx) => ctx.reply("Hi there!"));
bot.command("start", commands);
bot.command("stop", stopService);
bot.catch(async (err: BotError<Context>) => {
  await errorHandler(err);
});

bot.start();
