import { Bot, Context, session } from "grammy";
import { TgGroupRepository } from "../repositories/tgGroup.repository";
import { TgGroupMemberRepository } from "../repositories/tgGroupMember.repository";

const tgGroupRepo = TgGroupRepository.getTgGroupRepository();
const tgMemberRepo = TgGroupMemberRepository.getTgGroupRepository();

export const startService = async (ctx: Context) => {
  if (ctx.chat?.type === "group" || ctx.chat?.type === "supergroup") {
    const groupId = ctx.chat?.id!;
    const userId = ctx.from?.id!;
    const username = ctx.from?.username!;

    const chatMember = await ctx.getChatMember(userId);

    if (
      chatMember.status === "administrator" ||
      chatMember.status === "creator"
    ) {
      let group = await tgGroupRepo.getByExternalGroupId(groupId);
      if (!group) {
        group = await tgGroupRepo.addGroup(groupId);
        await tgMemberRepo.addMember(group.id!, userId, username);
      }

      await tgGroupRepo.updateGroupParams(groupId, { botEnabled: true });
      await ctx.reply(`Bot is enabled for this group`);
    }
  } else {
    await ctx.reply("This command can only be used in a group.");
  }
};

export const stopService = async (ctx: Context) => {
  if (ctx.chat?.type === "group" || ctx.chat?.type === "supergroup") {
    const groupId = ctx.chat?.id!;
    const userId = ctx.from?.id!;

    const chatMember = await ctx.getChatMember(userId);

    if (
      chatMember.status === "administrator" ||
      chatMember.status === "creator"
    ) {
      let group = await tgGroupRepo.getByExternalGroupId(groupId);
      if (group) {
        await tgGroupRepo.updateGroupParams(groupId, { botEnabled: false });
      }
      await ctx.reply(`Bot is disabled for this group`);
    }
  } else {
    await ctx.reply("This command can only be used in a group.");
  }
};
