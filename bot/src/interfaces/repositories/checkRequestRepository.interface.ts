import {
  CheckRequestAttrs,
  CheckRequestModel,
} from "../../models/checkRequest.model";

export interface ICheckRequestRepository {
  addCheckRequest(params: CheckRequestAttrs): Promise<CheckRequestModel>;
}
