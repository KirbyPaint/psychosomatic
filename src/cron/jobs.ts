import { CronJob } from "cron";
import chalk from "chalk";
import { PrismaClient } from "@prisma/client";
import { weaponGenerator } from "../doots_game/item-generator";

const every5Minutes = `*/5 * * * *`;
const daily = `30 18 * * *`;
const testing = `*/1 * * * *`;
const every30Minutes = `*/30 * * * *`;

const prisma = new PrismaClient();

export const redootJob = new CronJob(
  every5Minutes,
  async () => {
    console.log(chalk.blueBright(`Add Doots`));
    const playersToUpdate = await prisma.player.findMany({
      where: {
        deletedAt: null,
      },
    });
    // iterate through each player and add 5 to their xp
    for (const player of playersToUpdate) {
      await prisma.player.update({
        where: {
          discordId: player.discordId,
        },
        data: {
          xp: player.xp + 5,
        },
      });
    }
  },
  null,
  true,
);

export const dailyJob = new CronJob(
  daily,
  async () => {
    const playersToScore = await prisma.player.findMany({
      where: {
        deletedAt: null,
      },
    });
    const sorted = playersToScore.sort((a, b) => b.xp - a.xp);
    console.log(chalk.blueBright(`Scores:`));
    for (let i = 0; i < sorted.length; i++) {
      const player = sorted[i];
      console.log(
        chalk.blueBright(`${i + 1}. ${player.username} - ${player.xp} XP`),
      );
    }
  },
  null,
  true,
);

export const itemJob = new CronJob(
  every30Minutes,
  async () => {
    const items = await prisma.item.findMany({
      where: {
        Owner: {
          is: null,
        },
      },
    });
    if (items.length > 10) {
      return;
    }
    const itemsToCreate = weaponGenerator(10 - items.length);
    for (const item of itemsToCreate) {
      await prisma.item.create({
        data: item,
      });
    }
    console.log(
      chalk.blueBright(`Generated ${itemsToCreate.length} new items.`),
    );
  },
  null,
  true,
);
