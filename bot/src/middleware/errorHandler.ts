import { BotError, Context } from "grammy";
import { logger } from "../logger/logger";
import { BadRequestError } from "./badRequestError";

export const errorHandler = async (error: BotError<Context>) => {
  if (error.error instanceof BadRequestError) {
    await error.ctx.reply(error.error.message);
  } else {
    logger.bot.error("Error occurred:", error);
  }
};
