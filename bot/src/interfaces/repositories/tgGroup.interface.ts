import { TgGroupAttrs, TgGroupModel } from "../../models/tgGroup.model";

export interface ITgGroupRepository {
  addGroup(externalGroupId: number): Promise<TgGroupModel>;
  getById(id: number): Promise<TgGroupModel | null>;
  getByExternalGroupId(externalGroupId: number): Promise<TgGroupModel | null>;
  updateGroupParams(
    externalGroupId: number,
    params: TgGroupAttrs,
  ): Promise<TgGroupModel | null>;
}
