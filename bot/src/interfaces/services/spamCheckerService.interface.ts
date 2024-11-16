import { CheckRequestModel } from "../../models/checkRequest.model";

export interface ISpamCheckerService {
    checkSpam(text: string, tgMemberId: number): Promise<CheckRequestModel>
}