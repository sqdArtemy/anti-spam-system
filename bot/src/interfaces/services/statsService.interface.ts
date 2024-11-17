import { Context } from "grammy";

export interface IStatsService {
    getUserStats(ctx: Context): Promise<unknown>;
    getUrlStats(ctx: Context): Promise<unknown>;
    getWordStats(ctx: Context): Promise<unknown>;
}