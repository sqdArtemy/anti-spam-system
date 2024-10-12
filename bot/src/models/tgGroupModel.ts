import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface TgGroupAttributes {
  id?: number;
  externalGroupId: number;
  botEnabled?: boolean;
  banEnabled?: boolean;
  muteEnabled?: boolean;
  banThreshold?: number;
  muteThreshold?: number;
  susMinConfidence?: number;
  spamMinConfidence?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface TgGroupModel
  extends Model<TgGroupAttributes>,
    TgGroupAttributes {}

export class TgGroup extends Model<TgGroupModel, TgGroupAttributes> {}

export type TgGroupStatic = typeof Model & {
  new (value?: object, options?: BuildOptions): TgGroupModel;
};

export function TgGroupFactory(sequelize: Sequelize): TgGroupStatic {
  return <TgGroupStatic>sequelize.define(
    "telegram_group",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      externalGroupId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "external_group_id",
      },
      botEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "bot_enabled",
      },
      banEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "ban_enabled",
      },
      muteEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "mute_enabled",
      },
      banThreshold: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "ban_threshold",
      },
      muteThreshold: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "ban_threshold",
      },
      susMinConfidence: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 80.0,
        field: "sus_min_confidence",
      },
      spamMinConfidence: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 90.0,
        field: "spam_min_confidence",
      },
    },
    {
      createdAt: true,
      updatedAt: true,
      freezeTableName: true,
    }
  );
}
