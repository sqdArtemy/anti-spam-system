import { ICheckRequestRepository } from "../interfaces/repositories/checkRequest.interface";
import {
  CheckRequestAttrs,
  CheckRequestModel,
} from "../models/checkRequest.model";
import { CheckRequest } from "../models";

export class CheckRequestRepository implements ICheckRequestRepository {
  static #instance: CheckRequestRepository;
  private constructor() {}

  static getCheckRequestRepository(): CheckRequestRepository {
    if (!CheckRequestRepository.#instance) {
      CheckRequestRepository.#instance = new CheckRequestRepository();
    }

    return CheckRequestRepository.#instance;
  }

  public async addCheckRequest(
    params: CheckRequestAttrs
  ): Promise<CheckRequestModel> {
    return await CheckRequest.create<CheckRequestModel>(params);
  }
}
