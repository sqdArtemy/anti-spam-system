import { Bot } from "grammy";
import dotenv from "dotenv";
import { logger } from "./logger/logger";
import { databaseConfig } from "./models/config";

dotenv.config({ path: "./.env" });

const bot = new Bot(process.env.TG_BOT_TOKEN!);
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

bot.on("message", (ctx) => ctx.reply("Hi there!"));
bot.start();
