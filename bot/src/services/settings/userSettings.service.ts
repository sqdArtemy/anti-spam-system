import { Context, InlineKeyboard } from "grammy";
import { TgGroupRepository } from "../../repositories/tgGroup.repository";
import { TgGroupMemberRepository } from "../../repositories/tgGroupMember.repository";
import { ITgGroupRepository } from "../../interfaces/repositories/tgGroup.interface";
import { Op } from "sequelize";

export class UserSettingsService {
  tgGroupRepo: ITgGroupRepository;
  tgMemberRepo: TgGroupMemberRepository;

  public constructor() {
    this.tgGroupRepo = TgGroupRepository.getTgGroupRepository();
    this.tgMemberRepo = TgGroupMemberRepository.getTgGroupRepository();
  }

  usersConfig = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);

    const members = await this.tgMemberRepo.getAllByFilters({
      tgGroupId: group?.id,
    });

    if (members.length === 0) {
      await ctx.reply("No members found in this group.");
      return;
    }

    // Format all members' data into a single message
    let message = "Group Members:\n\n";
    members.forEach((member) => {
      message += `
      Username: ${member.externalUsername || String(member.externalUserId)}
      Suspicious Messages: ${member.susCounter}
      Blacklisted: ${member.isBlacklisted ? "Yes" : "No"}
      Created At: ${member.createdAt}
      
      `;
    });

    const keyboard = new InlineKeyboard()
      .row({ text: "Reset Sus Counter", callback_data: "reset_sus_counter" })
      .row({ text: "Exit", callback_data: "exit_config" });

    await ctx.reply(message.trim(), {
      reply_markup: keyboard,
    });
  };

  resetSusCounterConfig = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);
    const members = await this.tgMemberRepo.getAllByFilters({
      tgGroupId: group?.id,
      susCounter: { [Op.gt]: 0 },
    });

    if (members.length === 0) {
      await ctx.reply("No members available to reset.");
      return;
    }

    const keyboard = new InlineKeyboard();
    members.forEach((member) => {
      keyboard.row({
        text: member.externalUsername || String(member.externalUserId),
        callback_data: `reset_sus_${member.id}`,
      });
    });
    keyboard.row({ text: "Exit", callback_data: "exit_config" });

    await ctx.reply(
      "Select a user to reset their suspicious message counter:",
      {
        reply_markup: keyboard,
      },
    );
  };

  resetSusCounter = async (ctx: Context) => {
    if (ctx.match && ctx.match[1]) {
      const memberId = parseInt(ctx.match[1], 10);

      await this.tgMemberRepo.updateMember(memberId, {
        susCounter: 0,
      });

      await ctx.reply(
        "Suspicious message counter has been reset for the selected user.",
      );

      return await this.usersConfig(ctx);
    }
  };
}
