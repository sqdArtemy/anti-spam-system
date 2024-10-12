import {
  CheckRequestAttributes,
  CheckRequestModel,
} from "../../models/checkRequest.model";

export interface ICheckRequestRepository {
  addCheckRequest(params: CheckRequestAttributes): Promise<CheckRequestModel>;
}
