import { Context } from "grammy";

export interface ISettingsService {
  exitFromMenu(ctx: Context): Promise<void>;
  banAndMuteConfig(ctx: Context): Promise<void>;
  banConfig(ctx: Context): Promise<void>;
  banEnableConfig(ctx: Context): Promise<void>;
  banThresholdConfig(ctx: Context): Promise<void>;
  muteConfig(ctx: Context): Promise<void>;
  muteEnableConfig(ctx: Context): Promise<void>;
  muteThresholdConfig(ctx: Context): Promise<void>;
  handleInput(ctx: Context): Promise<void>;
  confidenceConfig(ctx: Context): Promise<void>;
  updateSusThreshold(ctx: Context): Promise<void>;
  updateSpamThreshold(ctx: Context): Promise<void>;
  whitelistConfig(ctx: Context): Promise<void>;
  whitelistAddConfig(ctx: Context): Promise<void>;
  onWhitelistAdd(ctx: Context): Promise<void>;
  whitelistRemoveConfig(ctx: Context): Promise<void>;
  onWhitelistRemove(ctx: Context): Promise<void>;
  usersConfig(ctx: Context): Promise<void>;
  resetSusCounterConfig(ctx: Context): Promise<void>;
  resetSusCounter(ctx: Context): Promise<void>;
}
