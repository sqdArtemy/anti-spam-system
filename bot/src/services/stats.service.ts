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
import { ICommandService } from "../interfaces/services/commandService.interface";
import { CommandService } from "./command.service";
import { IAiModelResponse } from "../interfaces/aiModelResponse.interfance";
import QuickChart from "quickchart-js";

export class StatsService implements IStatsService {
  checkRequestRepo: ICheckRequestRepository;
  tgGroupRepo: ITgGroupRepository;
  tgMemberRepo: ITgGroupMemberRepository;
  commandsService: ICommandService;

  constructor() {
    this.checkRequestRepo = CheckRequestRepository.getCheckRequestRepository();
    this.tgGroupRepo = TgGroupRepository.getTgGroupRepository();
    this.tgMemberRepo = TgGroupMemberRepository.getTgGroupRepository();
    this.commandsService = new CommandService();
  }

  public getUrlStats = async (ctx: Context): Promise<void> => {
    await ctx.deleteMessage();
    const allMessages = await this.getAllSpamMessages(ctx);
    const inputsOnly = allMessages.map((message) => message.input);

    let urlsCount = this.countUrls(inputsOnly);
    urlsCount = urlsCount.sort((a, b) => b.count - a.count);

    if (!urlsCount.length) {
      await ctx.reply("No urls have been found in spam");
      return await this.commandsService.statsCommand(ctx);
    }

    const mainLabel = "Most used url as spam";
    const rowLabel = "url";

    const chartBuffer = await this.createBarChart(
      urlsCount,
      mainLabel,
      rowLabel,
    );

    const total = urlsCount.reduce((count, url) => {
      return (count += url.count);
    }, 0);

    const average = total / allMessages.length;
    await ctx.replyWithPhoto(new InputFile(chartBuffer, "url.png"), {
      caption: `
        Url stats:
        - Total urls found: ${total}
        - Average urls per spam message: ${average}
        - Most commonly used url: ${
          urlsCount.length ? urlsCount[0].url : "None"
        }
      `,
    });
    return await this.commandsService.statsCommand(ctx);
  };

  public getUserStats = async (ctx: Context): Promise<void> => {
    await ctx.deleteMessage();
    let { spammers, details } = await this.getTopSpammers(ctx);
    spammers = spammers.sort((a, b) => b.count - a.count);

    if (!spammers.length) {
      await ctx.reply("No spammers have been found");
      return await this.commandsService.statsCommand(ctx);
    }

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
      - Total spam messages: ${details.total}
      - Average: ${details.average}
      - Average confidence: ${details.averageConfidence}%
      - Top spammer: ${
        spammers.length > 0
          ? spammers[0]["external_username"] +
            " with " +
            spammers[0].count +
            " spam messages"
          : "None"
      }
      `,
    });

    return await this.commandsService.statsCommand(ctx);
  };

  public getWordStats = async (ctx: Context): Promise<void> => {
    await ctx.deleteMessage();
    const allMessages = await this.getAllSpamMessages(ctx);

    const outputsOnly = allMessages.map((message) => {
      const output: IAiModelResponse = JSON.parse(message.output);

      return output.important_words;
    });


    const wordsCount = this.aggregateWords(outputsOnly);
    const mainLabel = "Top spam words";
    const rowLabel = "word";

    const chartBuffer = await this.createBarChart(
        wordsCount,
        mainLabel,
        rowLabel,
    );

    await ctx.replyWithPhoto(new InputFile(chartBuffer, "words.png"), {
      caption: 'Top used words in spam messages'
    });

    return await this.commandsService.statsCommand(ctx);
  };

  private getAllSpamMessages = async (ctx: Context) => {
    const groupId = ctx.chat?.id;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId!);

    return await this.checkRequestRepo.getAllSpamByGroup(group?.id!);
  };

  private getTopSpammers = async (ctx: Context) => {
    const groupId = ctx.chat?.id;
    const group = await this.tgGroupRepo.getByExternalGroupId(groupId!);

    const spammers = await this.checkRequestRepo.getTopSpammersByGroup(
      group?.id!,
    );

    console.log(spammers);
    const details = await this.checkRequestRepo.getDetailsAboutSpammers(
      group?.id!,
    );

    return { spammers, details };
  };

  private async createBarChart(
      data: GroupedCountResultItem[],
      mainLabelName: string,
      rowLabelName: string
  ): Promise<Buffer> {
    const labels = data.map((item) => item[rowLabelName]);
    const counts = data.map((item) => item.count);
    const colors = this.generateColors(data.length);

    const chart = new QuickChart();
    chart.setConfig({
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: mainLabelName,
            data: counts,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            suggestedMin: 0
          },
        },
      },
    });
    chart.setWidth(1000).setHeight(800);

    // Fetch chart as a buffer
    const chartBinary = await chart.toBinary();
    return Buffer.from(chartBinary);
  }

  generateColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${(i * 360) / count}, 70%, 50%)`); // HSL for diverse hues
    }
    return colors;
  }

  countUrls(strings: string[]): { url: string; count: number }[] {
    const urlRegex =
      /\b(?:https?:\/\/|www\.)?[^\s/"'<>()]+(?:\.[^\s/"'<>()]+)+(?:\/[^\s"'<>()]*)?\b/g;
    const urlCounts = new Map<string, number>();

    strings.forEach((str) => {
      const matches = str.match(urlRegex);
      if (matches) {
        matches.forEach((url) => {
          urlCounts.set(url, (urlCounts.get(url) || 0) + 1);
        });
      }
    });

    return Array.from(urlCounts, ([url, count]) => ({ url, count }));
  }

  aggregateWords(
    data: [string, number][][],
  ): { word: string; count: number }[] {
    const wordCounts = new Map<string, number>();

    data.forEach((subArray) => {
      subArray.forEach(([word, count]) => {
        // Accumulate the count for each word
        wordCounts.set(word, (wordCounts.get(word) || 0) + count);
      });
    });

    return Array.from(wordCounts, ([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}
