import { Context } from "grammy";
import { isAdmin, isGroupChat } from "../middleware/validators";
import { TgGroupRepository } from "../repositories/tgGroup.repository";
import { TgGroupMemberRepository } from "../repositories/tgGroupMember.repository";

const tgGroupRepo = TgGroupRepository.getTgGroupRepository();
const tgMemberRepo = TgGroupMemberRepository.getTgGroupRepository();

export const commands = async (ctx: Context) => {
  if (!(await isGroupChat(ctx))) return;

  const groupId = ctx.chat?.id!;
  const userId = ctx.from?.id!;
  const username = ctx.from?.username!;

  if (await isAdmin(ctx, userId)) {
    let group = await tgGroupRepo.getByExternalGroupId(groupId);
    if (!group) {
      group = await tgGroupRepo.addGroup(groupId);
      await tgMemberRepo.addMember(group.id!, userId, username);
    }

    await tgGroupRepo.updateGroupParams(groupId, { botEnabled: true });
    await ctx.reply(`Bot is enabled for this group`);
  }
};

export const stopService = async (ctx: Context) => {
  if (!(await isGroupChat(ctx))) return;

  const groupId = ctx.chat?.id!;
  const userId = ctx.from?.id!;

  if (await isAdmin(ctx, userId)) {
    let group = await tgGroupRepo.getByExternalGroupId(groupId);
    if (group) {
      await tgGroupRepo.updateGroupParams(groupId, { botEnabled: false });
    }
    await ctx.reply(`Bot is disabled for this group`);
  }
};
