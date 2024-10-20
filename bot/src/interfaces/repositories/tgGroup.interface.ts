import { TgGroupAttrs, TgGroupModel } from "../../models/tgGroup.model";
import { UpdateOptions } from "sequelize";

export interface ITgGroupRepository {
  addGroup(externalGroupId: number): Promise<TgGroupModel>;
  getById(id: number): Promise<TgGroupModel | null>;
  getByExternalGroupId(externalGroupId: number): Promise<TgGroupModel | null>;
  updateGroupParams(
    externalGroupId: number,
    params: UpdateOptions<TgGroupAttrs>
  ): Promise<TgGroupModel | null>;
}
