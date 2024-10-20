import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { CheckRequestModel } from "./checkRequest.model";
import { TgGroupModel } from "./tgGroup.model";

export interface TgGroupMemberAttrs {
  id?: number;
  tgGroupId: number;
  externalUserId: number;
  externalUsername: string;
  susCounter?: number;
  isWhitelisted?: boolean;
  isBlacklisted?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  checkRequests?: CheckRequestModel[];
  group?: TgGroupModel | null;
}

export interface TgGroupMemberModel
  extends Model<TgGroupMemberAttrs>,
    TgGroupMemberAttrs {}

export type TgGroupMemberStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): TgGroupMemberModel;
};

export function TgGroupMemberFactory(
  sequelize: Sequelize
): TgGroupMemberStatic {
  return <TgGroupMemberStatic>sequelize.define(
    "telegram_group_member",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      tgGroupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "telegram_group_id",
      },
      externalUserId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "external_user_id",
      },
      externalUsername: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "external_username",
      },
      susCounter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "sus_counter",
      },
      isBlacklisted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_blacklisted",
      },
      isWhitelisted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_whitelisted",
      },
    },
    {
      createdAt: true,
      updatedAt: true,
      freezeTableName: true,
    }
  );
}
