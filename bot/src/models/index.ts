import { databaseConfig } from "./config";

import { TgGroupFactory } from "./tgGroup.model";
import { TgGroupMemberFactory } from "./tgGroupMember.model";
import { CheckRequestFactory } from "./checkRequest.model";

export const TgGroup = TgGroupFactory(databaseConfig);
export const TgGroupMember = TgGroupMemberFactory(databaseConfig);
export const CheckRequest = CheckRequestFactory(databaseConfig);

TgGroup.sync();
TgGroupMember.sync();
CheckRequest.sync();

try {
  TgGroupMember.belongsTo(TgGroup, {
    as: "group",
    foreignKey: "telegram_group_id",
  });

  CheckRequest.belongsTo(TgGroupMember, {
    as: "tgGroupMember",
    foreignKey: "telegram_group_member_id",
  });

  TgGroupMember.hasMany(CheckRequest, {
    as: "checkRequests",
    foreignKey: "telegram_group_member_id",
  });

  TgGroup.hasMany(TgGroupMember, {
    as: "members",
    foreignKey: "telegram_group_id",
  });
} catch (e) {
  console.log(e);
}
