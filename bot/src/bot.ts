import { Bot } from "grammy";
import dotenv from "dotenv";
import { logger } from "./logger/logger";
import { databaseConfig } from "./models/config";
import { startService, stopService } from "./services/start.service";

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
bot.command("start", startService);
bot.command("stop", stopService);
bot.start();
