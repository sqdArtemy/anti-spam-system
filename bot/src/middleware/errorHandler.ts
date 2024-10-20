import { BotError, Context } from "grammy";
import { logger } from "../logger/logger";

export const errorHandler = async (error: BotError<Context>) => {
  logger.bot.error("Error occurred:", error);
};
