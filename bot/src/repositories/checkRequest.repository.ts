import {ICheckRequestRepository} from "../interfaces/repositories/checkRequest.interface";
import {CheckRequestAttrs, CheckRequestModel,} from "../models/checkRequest.model";
import {CheckRequest, TgGroupMember} from "../models";
import {col, GroupedCountResultItem, literal, Sequelize} from "sequelize";
import {fn} from "moment";

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
          as: "tgGroupMember",
          where: {
            tgGroupId: groupId,
          },
        },
      ],
    });
  }

  public async getTopSpammersByGroup(groupId: number): Promise<GroupedCountResultItem[]> {
    return await CheckRequest.count({
      where: {
        isSus: true,
      },
      include: [
        {
          model: TgGroupMember,
          as: "tgGroupMember",
          where: {
            tgGroupId: groupId,
          },
        },
      ],
      group: ["tgGroupMemberId", "tgGroupMember.external_username"],
    });
  }

  public async getDetailsAboutSpammers(groupId: number): Promise<{ total: number; average: number; averageConfidence: number }> {
    const data = await CheckRequest.findAll({
      attributes: [
        [Sequelize.fn('COUNT', '*'), 'total'],
        [
          Sequelize.literal('ROUND(COUNT(*) / COUNT(DISTINCT telegram_group_member_id), 2)'),
          'average',
        ],
        [Sequelize.literal('ROUND(AVG(confidence), 2)'), 'averageConfidence'],
      ],
    });

    return JSON.parse(JSON.stringify(data))[0] as unknown as { total: number; average: number; averageConfidence: number };
  }
}

