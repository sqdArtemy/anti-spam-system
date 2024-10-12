import { ITgGroupRepository } from "../interfaces/repositories/tgGroupRepository.interface";
import { TgGroupAttributes, TgGroupModel } from "../models/tgGroup.model";
import { UpdateOptions } from "sequelize";
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
    });
  }

  public async getByExternalGroupId(
    externalGroupId: number
  ): Promise<TgGroupModel | null> {
    return await TgGroup.findOne({
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
    params: UpdateOptions<TgGroupAttributes>
  ): Promise<TgGroupModel | null> {
    await TgGroup.update(params, { where: { externalGroupId } });
    return await this.getByExternalGroupId(externalGroupId);
  }
}
