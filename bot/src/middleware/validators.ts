import { Context } from "grammy";

export const isGroupChat = async (ctx: Context): Promise<boolean> => {
  const isValid = ctx.chat?.type === "group" || ctx.chat?.type === "supergroup";
  if (!isValid) {
    await ctx.reply("This command can only be used in a group.");
  }
  return isValid;
};

export const isAdmin = async (
  ctx: Context,
  userId: number
): Promise<boolean> => {
  const chatMember = await ctx.getChatMember(userId);
  return (
    chatMember.status === "administrator" || chatMember.status === "creator"
  );
};
