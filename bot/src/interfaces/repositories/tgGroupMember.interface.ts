import {
  TgGroupMemberAttrs,
  TgGroupMemberModel,
} from "../../models/tgGroupMember.model";
import { UpdateOptions, WhereOptions } from "sequelize";

export interface ITgGroupMemberRepository {
  addMember(
    tgGroupId: number,
    externalId: number,
    username: string
  ): Promise<TgGroupMemberModel>;
  getById(id: number): Promise<TgGroupMemberModel | null>;
  getByGroupIdAndUserId(
    tgGroupId: number,
    externalId: number
  ): Promise<TgGroupMemberModel | null>;
  getAll(tgGroupId: number): Promise<TgGroupMemberModel[]>;
  getAllWhitelisted(tgGroupId: number): Promise<TgGroupMemberModel[]>;
  getAllNonWhitelisted(tgGroupId: number): Promise<TgGroupMemberModel[]>;
  updateMember(
    id: number,
    params: TgGroupMemberAttrs
  ): Promise<TgGroupMemberModel | null>;
  getAllByFilters(
    filters: WhereOptions<TgGroupMemberAttrs>
  ): Promise<TgGroupMemberModel[]>;
}
