import { Context, NextFunction } from "grammy";
import { BadRequestError } from "./badRequestError";

export async function validateAdmin(
  ctx: Context,
  next: NextFunction,
): Promise<void> {
  const isValid = ctx.chat?.type === "group" || ctx.chat?.type === "supergroup";
  if (!isValid) {
    throw new BadRequestError("This command can only be used in a group.");
  }

  const userId = ctx.from?.id!;
  if (await isAdmin(ctx, userId)) {
    return await next();
  }
}

export const isAdmin = async (
  ctx: Context,
  userId: number,
): Promise<boolean> => {
  const chatMember = await ctx.getChatMember(userId);
  return (
    chatMember.status === "administrator" || chatMember.status === "creator"
  );
};
