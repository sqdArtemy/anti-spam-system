import { GroupedCountResultItem } from "sequelize";
import {
  CheckRequestAttrs,
  CheckRequestModel,
} from "../../models/checkRequest.model";

export interface ICheckRequestRepository {
  addCheckRequest(params: CheckRequestAttrs): Promise<CheckRequestModel>;
  getById(id: number): Promise<CheckRequestModel | null>;
  getAllSpamByGroup(groupId: number): Promise<CheckRequestModel[]>;
  getTopSpammersByGroup(groupId: number): Promise<GroupedCountResultItem[]>
}
