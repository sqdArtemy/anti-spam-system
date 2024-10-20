"use strict";

const { DataTypes } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tgGroupMemberExists = await queryInterface.sequelize.query(
      `SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'telegram_group_member'`
    );

    if (tgGroupMemberExists[0][0]["COUNT(*)"] > 0) {
      await queryInterface.dropTable("telegram_group_member");
    }

    const tgGroupExists = await queryInterface.sequelize.query(
      `SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'telegram_group'`
    );

    if (tgGroupExists[0][0]["COUNT(*)"] > 0) {
      await queryInterface.dropTable("telegram_group");
    }

    await queryInterface.createTable("telegram_group", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      externalGroupId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        field: "external_group_id",
      },
      botEnabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "bot_enabled",
      },
      banEnabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "ban_enabled",
      },
      muteEnabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "mute_enabled",
      },
      banThreshold: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: "ban_threshold",
      },
      muteThreshold: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: "mute_threshold",
      },
      susMinConfidence: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 80.0,
        field: "sus_min_confidence",
      },
      spamMinConfidence: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 90.0,
        field: "spam_min_confidence",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        field: "created_at",
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        field: "updated_at",
      },
    });

    // Create the `telegram_group_member` table
    await queryInterface.createTable("telegram_group_member", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      tgGroupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "telegram_group",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        field: "telegram_group_id",
      },
      externalUserId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        field: "external_user_id",
      },
      externalUsername: {
        type: Sequelize.STRING(50),
        allowNull: true,
        field: "external_username",
      },
      susCounter: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "sus_counter",
      },
      isBlacklisted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_blacklisted",
      },
      isWhitelisted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_whitelisted",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        field: "created_at",
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        field: "updated_at",
      },
    });

    const checkRequestExists = await queryInterface.sequelize.query(
      `SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'check_request'`
    );

    if (!checkRequestExists[0][0]["COUNT(*)"]) {
      await queryInterface.createTable("check_request", {
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
          type: DataTypes.BIGINT,
          allowNull: true,
          field: "user_id",
        },
        tgGroupMemberId: {
          type: DataTypes.BIGINT,
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
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tgGroupMemberExists = await queryInterface.sequelize.query(
      `SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'telegram_group_member'`
    );

    if (tgGroupMemberExists[0][0]["COUNT(*)"] > 0) {
      await queryInterface.dropTable("telegram_group_member");
    }

    const tgGroupExists = await queryInterface.sequelize.query(
      `SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'telegram_group'`
    );

    if (tgGroupExists[0][0]["COUNT(*)"] > 0) {
      await queryInterface.dropTable("telegram_group");
    }
  },
};
