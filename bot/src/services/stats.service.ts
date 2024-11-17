import { IStatsService } from "../interfaces/services/statsService.interface";
import {Context, InputFile} from "grammy";
import { ICheckRequestRepository } from "../interfaces/repositories/checkRequest.interface";
import { ITgGroupRepository } from "../interfaces/repositories/tgGroup.interface";
import { ITgGroupMemberRepository } from "../interfaces/repositories/tgGroupMember.interface";
import { CheckRequestRepository } from "../repositories/checkRequest.repository";
import { TgGroupRepository } from "../repositories/tgGroup.repository";
import { TgGroupMemberRepository } from "../repositories/tgGroupMember.repository";
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

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
    const spammers = await this.getTopSpammers(ctx);
    const chartBuffer = await this.createBarChart(spammers as any);

    await ctx.replyWithPhoto(new InputFile(chartBuffer, 'chart.png'), {
      caption: 'Top Spammers of the group!',
    });

    return Promise.resolve(undefined);
  };

  public getWordStats = async (ctx: Context): Promise<unknown> => {
    return Promise.resolve(undefined);
  };

  private getAllSpamMessages = async (ctx: Context)=> {
    const groupId = ctx.chat?.id;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId!);

    return await this.checkRequestRepo.getAllSpamByGroup(group?.id!);
  };

  private getTopSpammers = async (ctx: Context)=> {
    const groupId = ctx.chat?.id;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId!);

    return await this.checkRequestRepo.getTopSpammersByGroup(group?.id!);
  };

  async createBarChart(data: { external_username: string; count: number }[]): Promise<Buffer> {
    const chartCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });

    const labels = data.map(item => item.external_username);
    const counts = data.map(item => item.count);

    const configuration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Spam Messages Count',
            data: counts,
            backgroundColor: ['#4CAF50', '#FF5733'], // Custom colors
            borderColor: ['#4CAF50', '#FF5733'], // Border colors
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
}
