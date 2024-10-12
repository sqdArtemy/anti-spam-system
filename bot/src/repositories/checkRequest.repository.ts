import { ICheckRequestRepository } from "../interfaces/repositories/checkRequestRepository.interface";
import {
  CheckRequestAttributes,
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
    params: CheckRequestAttributes
  ): Promise<CheckRequestModel> {
    return await CheckRequest.create(params);
  }
}
