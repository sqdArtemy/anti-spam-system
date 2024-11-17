import { Context, InlineKeyboard } from "grammy";
import { ITgGroupRepository } from "../../interfaces/repositories/tgGroup.interface";
import { TgGroupMemberRepository } from "../../repositories/tgGroupMember.repository";
import { TgGroupRepository } from "../../repositories/tgGroup.repository";

export class WhitelistSettingsService {
  tgGroupRepo: ITgGroupRepository;
  tgMemberRepo: TgGroupMemberRepository;

  public constructor() {
    this.tgGroupRepo = TgGroupRepository.getTgGroupRepository();
    this.tgMemberRepo = TgGroupMemberRepository.getTgGroupRepository();
  }

  whitelistConfig = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);

    const whitelistedMembers = await this.tgMemberRepo.getAllWhitelisted(
      group?.id!,
    );
    const nonWhitelistedMembers = await this.tgMemberRepo.getAllNonWhitelisted(
      group?.id!,
    );

    let message = "Current Whitelisted Members:\n";
    if (whitelistedMembers.length > 0) {
      message += whitelistedMembers
        .map(
          (member) => `- ${member.externalUsername || member.externalUserId}`,
        )
        .join("\n");
    } else {
      message += "No members are currently whitelisted.";
    }

    await ctx.reply(message);

    const buttons = [
      ...(nonWhitelistedMembers.length > 0
        ? [{ text: "Add to whitelist", callback_data: "whitelist_add" }]
        : []),
      ...(whitelistedMembers.length > 0
        ? [{ text: "Remove from whitelist", callback_data: "whitelist_remove" }]
        : []),
      { text: "Exit", callback_data: "exit_config" },
    ];

    const keyboard = new InlineKeyboard().row(...buttons);

    await ctx.reply("Please choose an option:", {
      reply_markup: keyboard,
    });
  };

  whitelistAddConfig = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);
    const nonWhitelistedMembers = await this.tgMemberRepo.getAllNonWhitelisted(
      group?.id!,
    );

    if (nonWhitelistedMembers.length === 0) {
      await ctx.reply("All members are already whitelisted.");
      return;
    }

    const keyboard = new InlineKeyboard();
    nonWhitelistedMembers.forEach((member) => {
      keyboard.row({
        text: member.externalUsername || String(member.externalUserId),
        callback_data: `whitelist_add_${member.id}`,
      });
    });
    keyboard.row({ text: "Exit", callback_data: "exit_config" });

    await ctx.reply("Select a member to add to the whitelist:", {
      reply_markup: keyboard,
    });
  };

  onWhitelistAdd = async (ctx: Context) => {
    if (ctx.match && ctx.match[1]) {
      const memberId = parseInt(ctx.match[1], 10);

      await this.tgMemberRepo.updateMember(memberId, {
        isWhitelisted: true,
      });

      await ctx.reply("Member has been added to the whitelist.");
      return await this.whitelistConfig(ctx);
    }
  };

  whitelistRemoveConfig = async (ctx: Context) => {
    const groupId = ctx.chat?.id!;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId);

    const whitelistedMembers = await this.tgMemberRepo.getAllWhitelisted(
      group?.id!,
    );

    if (whitelistedMembers.length === 0) {
      await ctx.reply("No members are currently whitelisted.");
      return;
    }

    const keyboard = new InlineKeyboard();
    whitelistedMembers.forEach((member) => {
      keyboard.row({
        text: member.externalUsername || String(member.externalUserId),
        callback_data: `whitelist_remove_${member.id}`,
      });
    });
    keyboard.row({ text: "Exit", callback_data: "exit_config" });

    await ctx.reply("Select a member to remove from the whitelist:", {
      reply_markup: keyboard,
    });
  };

  onWhitelistRemove = async (ctx: Context) => {
    if (ctx.match && ctx.match[1]) {
      const memberId = parseInt(ctx.match[1], 10);

      await this.tgMemberRepo.updateMember(memberId, {
        isWhitelisted: false,
      });

      await ctx.reply("Member has been removed from the whitelist.");
      return await this.whitelistConfig(ctx);
    }
  };
}
