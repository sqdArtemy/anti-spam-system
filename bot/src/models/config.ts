import * as sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
export const databaseConfig = new sequelize.Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    dialect: "mysql",
    timezone: "+05:00",
    logging: false,
    define: {
      timestamps: true,
    },
  }
);
