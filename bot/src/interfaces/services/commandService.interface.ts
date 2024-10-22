import { Context } from "grammy";

export interface ICommandService {
  startCommand(ctx: Context): Promise<void>;
  stopCommand(ctx: Context): Promise<void>;
  settingsCommand(ctx: Context): Promise<void>;
  statsCommand(ctx: Context): Promise<void>;
  helpCommand(ctx: Context): Promise<void>;
  reportCommand(ctx: Context): Promise<void>;
}
