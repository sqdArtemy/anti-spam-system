import { ICheckRequestRepository } from "../interfaces/repositories/checkRequest.interface";
import {
  CheckRequestAttrs,
  CheckRequestModel,
} from "../models/checkRequest.model";
import { CheckRequest, TgGroupMember } from "../models";

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
    params: CheckRequestAttrs,
  ): Promise<CheckRequestModel> {
    return await CheckRequest.create<CheckRequestModel>(params);
  }

  public async getById(id: number): Promise<CheckRequestModel | null> {
    return await CheckRequest.findByPk(id);
  }

  public async getAllSpamByGroup(
    groupId: number,
  ): Promise<CheckRequestModel[]> {
    return await CheckRequest.findAll({
      where: {
        isSus: true,
      },
      include: [
        {
          model: TgGroupMember,
          as: "member",
          where: {
            tgGroupId: groupId,
          },
        },
      ],
    });
  }
}
