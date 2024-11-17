import { IStatsService } from "../interfaces/services/statsService.interface";
import { Context, InputFile } from "grammy";
import { ICheckRequestRepository } from "../interfaces/repositories/checkRequest.interface";
import { ITgGroupRepository } from "../interfaces/repositories/tgGroup.interface";
import { ITgGroupMemberRepository } from "../interfaces/repositories/tgGroupMember.interface";
import { CheckRequestRepository } from "../repositories/checkRequest.repository";
import { TgGroupRepository } from "../repositories/tgGroup.repository";
import { TgGroupMemberRepository } from "../repositories/tgGroupMember.repository";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { GroupedCountResultItem } from "sequelize";

export class StatsService implements IStatsService {
  checkRequestRepo: ICheckRequestRepository;
  tgGroupRepo: ITgGroupRepository;
  tgMemberRepo: ITgGroupMemberRepository;

  constructor() {
    this.checkRequestRepo = CheckRequestRepository.getCheckRequestRepository();
    this.tgGroupRepo = TgGroupRepository.getTgGroupRepository();
    this.tgMemberRepo = TgGroupMemberRepository.getTgGroupRepository();
  }

  public getUrlStats = async (ctx: Context): Promise<unknown> => {
    return Promise.resolve(undefined);
  };

  public getUserStats = async (ctx: Context): Promise<unknown> => {
    let spammers = await this.getTopSpammers(ctx);
    spammers = spammers.sort((a, b) => b.count - a.count);

    let totalCount = spammers.reduce((count, spammer) => {
      return (count += spammer.count);
    }, 0);

    let average = Math.round((totalCount / spammers.length) * 100) / 100;

    const mainLabel = "Top spammers of the group";
    const rowLabel = "external_username";

    const chartBuffer = await this.createBarChart(
      spammers,
      mainLabel,
      rowLabel,
    );

    await ctx.replyWithPhoto(new InputFile(chartBuffer, "chart.png"), {
      caption: `
      Top Spammers of the group.
      - Total spam messages: ${totalCount}
      - Average: ${average}
      - Top spammer: ${
        spammers.length > 0
          ? spammers[0]["external_username"] + " with " + spammers[0].count + " spam messages"
          : "None"
      }
      `,
    });

    return Promise.resolve(undefined);
  };

  public getWordStats = async (ctx: Context): Promise<unknown> => {
    return Promise.resolve(undefined);
  };

  private getAllSpamMessages = async (ctx: Context) => {
    const groupId = ctx.chat?.id;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId!);

    return await this.checkRequestRepo.getAllSpamByGroup(group?.id!);
  };

  private getTopSpammers = async (ctx: Context) => {
    const groupId = ctx.chat?.id;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId!);

    return await this.checkRequestRepo.getTopSpammersByGroup(group?.id!);
  };

  async createBarChart(
    data: GroupedCountResultItem[],
    mainLabelName: string,
    rowLabelName: string,
  ): Promise<Buffer> {
    const chartCanvas = new ChartJSNodeCanvas({ width: 1000, height: 800 });

    const labels = data.map((item) => item[rowLabelName]);
    const counts = data.map((item) => item.count);
    const colors = this.generateColors(data.length);

    const configuration = {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: mainLabelName,
            data: counts,
            backgroundColor: colors, // Custom colors
            borderColor: colors, // Border colors
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    return chartCanvas.renderToBuffer(configuration as any);
  }

  generateColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${(i * 360) / count}, 70%, 50%)`); // HSL for diverse hues
    }
    return colors;
  }
}
