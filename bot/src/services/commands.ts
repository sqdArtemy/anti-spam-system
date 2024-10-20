import { Context, InlineKeyboard } from "grammy";
import { TgGroupRepository } from "../repositories/tgGroup.repository";
import { TgGroupMemberRepository } from "../repositories/tgGroupMember.repository";

const tgGroupRepo = TgGroupRepository.getTgGroupRepository();
const tgMemberRepo = TgGroupMemberRepository.getTgGroupRepository();

export const commands = async (ctx: Context) => {
  const groupId = ctx.chat?.id!;
  const userId = ctx.from?.id!;
  const username = ctx.from?.username!;

  let group = await tgGroupRepo.getByExternalGroupId(groupId);
  if (!group) {
    group = await tgGroupRepo.addGroup(groupId);
    await tgMemberRepo.addMember(group.id!, userId, username);
  }

  await tgGroupRepo.updateGroupParams(groupId, { botEnabled: true });
  await ctx.reply(`Bot is enabled for this group`);
};

export const stopService = async (ctx: Context) => {
  const groupId = ctx.chat?.id!;

  let group = await tgGroupRepo.getByExternalGroupId(groupId);
  if (group) {
    await tgGroupRepo.updateGroupParams(groupId, { botEnabled: false });
  }
  await ctx.reply(`Bot is disabled for this group`);
};

export const settingsService = async (ctx: Context) => {
  const keyboard = new InlineKeyboard()
    .row(
      { text: "Model Confidence settings", callback_data: "confidence_config" },
      { text: "Whitelist settings", callback_data: "whitelist_config" }
    )
    .row(
      { text: "Ban/Mute settings", callback_data: "action_config" },
      { text: "User settings", callback_data: "users_config" }
    )
    .row({ text: "Exit", callback_data: "exit_config" });

  await ctx.reply("Please choose an option:", {
    reply_markup: keyboard,
  });
};
