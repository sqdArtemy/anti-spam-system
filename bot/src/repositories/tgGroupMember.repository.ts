import {ITgGroupMemberRepository, IUpdateMember} from "../interfaces/repositories/tgGroupMember.interface";
import {
  TgGroupMemberAttrs,
  TgGroupMemberModel,
} from "../models/tgGroupMember.model";
import { WhereOptions } from "sequelize";
import { TgGroupMember } from "../models";

export class TgGroupMemberRepository implements ITgGroupMemberRepository {
  static #instance: TgGroupMemberRepository;

  private constructor() {}

  static getTgGroupRepository(): TgGroupMemberRepository {
    if (!TgGroupMemberRepository.#instance) {
      TgGroupMemberRepository.#instance = new TgGroupMemberRepository();
    }

    return TgGroupMemberRepository.#instance;
  }

  public async addMember(
    tgGroupId: number,
    externalId: number,
    username: string
  ): Promise<TgGroupMemberModel> {
    return await TgGroupMember.create({
      tgGroupId,
      externalUserId: externalId,
      externalUsername: username,
    });
  }

  public async getAll(tgGroupId: number): Promise<TgGroupMemberModel[]> {
    return await TgGroupMember.findAll({
      where: { tgGroupId },
    });
  }

  public async getAllByFilters(
    filters: WhereOptions<TgGroupMemberAttrs>
  ): Promise<TgGroupMemberModel[]> {
    return await TgGroupMember.findAll({
      where: filters,
    });
  }

  public async getAllNonWhitelisted(
    tgGroupId: number
  ): Promise<TgGroupMemberModel[]> {
    return await TgGroupMember.findAll({
      where: { tgGroupId, isWhitelisted: false },
    });
  }

  public async getAllWhitelisted(
    tgGroupId: number
  ): Promise<TgGroupMemberModel[]> {
    return await TgGroupMember.findAll({
      where: { tgGroupId, isWhitelisted: true },
    });
  }

  public async getByGroupIdAndUserId(
    tgGroupId: number,
    externalId: number
  ): Promise<TgGroupMemberModel | null> {
    return await TgGroupMember.findOne({
      where: {
        tgGroupId,
        externalUserId: externalId,
      },
      logging: console.log
    });
  }

  public async getById(id: number): Promise<TgGroupMemberModel | null> {
    return await TgGroupMember.findByPk(id);
  }

  public async updateMember(
    id: number,
    params: IUpdateMember
  ): Promise<TgGroupMemberModel | null> {
    await TgGroupMember.update(params, {
      where: { id },
    });

    return await this.getById(id);
  }
}
