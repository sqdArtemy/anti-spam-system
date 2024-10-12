import { Bot } from "grammy";
import dotenv from "dotenv";
import { logger } from "./logger/logger";

dotenv.config({ path: "./.env" });

const bot = new Bot(process.env.TG_BOT_TOKEN!);
logger.bot.info("Bot is running");
bot.on("message", (ctx) => ctx.reply("Hi there!"));

bot.start();
