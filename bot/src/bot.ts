import { Bot } from "grammy";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const bot = new Bot(process.env.TG_BOT_TOKEN!);

bot.on("message", (ctx) => ctx.reply("Hi there!"));

bot.start();