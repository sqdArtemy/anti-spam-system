import { ITgGroupRepository } from "../interfaces/repositories/tgGroup.interface";
import { TgGroupAttrs, TgGroupModel } from "../models/tgGroup.model";
import { TgGroup } from "../models";

export class TgGroupRepository implements ITgGroupRepository {
  static #instance: TgGroupRepository;
  private constructor() {}

  static getTgGroupRepository(): TgGroupRepository {
    if (!TgGroupRepository.#instance) {
      TgGroupRepository.#instance = new TgGroupRepository();
    }

    return TgGroupRepository.#instance;
  }

  public async addGroup(externalGroupId: number): Promise<TgGroupModel> {
    return await TgGroup.create({
      externalGroupId,
      banEnabled: true,
      banThreshold: 10,
      muteEnabled: false,
      muteThreshold: 10,
    });
  }

  public async getByExternalGroupId(
    externalGroupId: number,
  ): Promise<TgGroupModel | null> {
    return await TgGroup.findOne<TgGroupModel>({
      where: {
        externalGroupId,
      },
    });
  }

  public async getById(id: number): Promise<TgGroupModel | null> {
    return await TgGroup.findByPk(id);
  }

  public async updateGroupParams(
    externalGroupId: number,
    params: TgGroupAttrs,
  ): Promise<TgGroupModel | null> {
    await TgGroup.update(params, {
      where: { externalGroupId },
    });

    return await this.getByExternalGroupId(externalGroupId);
  }
}
