import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { TgGroupMemberModel } from "./tgGroupMember.model";

export interface CheckRequestAttrs {
  id?: number;
  input: string;
  output: string;
  isSus: boolean;
  confidence: number;
  userId?: number | null;
  tgGroupMemberId?: number | null;
  checkTime: number;
  wordsCount: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  tgGroupMember?: TgGroupMemberModel | null;
}

export interface CheckRequestModel
  extends Model<CheckRequestAttrs>,
    CheckRequestAttrs {}

export type CheckRequestStatic = typeof Model & {
  new (value?: object, options?: BuildOptions): CheckRequestModel;
};

export function CheckRequestFactory(sequelize: Sequelize): CheckRequestStatic {
  return <CheckRequestStatic>sequelize.define(
    "check_request",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      input: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      output: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      isSus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "is_sus",
      },
      confidence: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "user_id",
      },
      tgGroupMemberId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "telegram_group_member_id",
      },
      checkTime: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        field: "check_time",
      },
      wordsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "words_count",
      },
    },
    {
      createdAt: false,
      updatedAt: false,
      freezeTableName: true,
    }
  );
}
