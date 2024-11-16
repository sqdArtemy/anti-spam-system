import { Context } from "grammy";

export interface ISpamCheckerService {
    checkSpam(ctx: Context, text: string, tgMemberId: number): Promise<void>
}