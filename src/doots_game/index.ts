import { PrismaClient } from "@prisma/client";
import {
  fiveMinutes,
  getRandomArbitrary,
  isGameAllowedChannel,
} from "../consts";
import chalk from "chalk";

const prisma = new PrismaClient();

export async function addPlayer(
  rest: string[],
  discordId: string,
  username: string,
): Promise<string> {
  const playerNickname = rest.join(` `);
  const playerExists = await prisma.player.findFirst({
    where: { discordId },
  });
  if (playerExists) {
    if (playerExists.deletedAt) {
      await prisma.player.update({
        where: { discordId },
        data: { deletedAt: null },
      });
      console.log(chalk.green(`Restored ${playerExists.username}!`));
      return `${playerExists.username} has been restored!`;
    }
    return `You're already in the game!`;
  }
  try {
    const db = await prisma.player.create({
      data: {
        username: playerNickname ? playerNickname : username,
        discordId,
        xp: 50,
      },
    });
    console.log(chalk.green(`Added ${JSON.stringify(db.username)}!`));
    return `Added player ${JSON.stringify(db.username)}`;
  } catch (error) {
    console.log(chalk.red(`Error adding player: `, error));
    return `Failed to add player, ask KirbyPaint to see what happened`;
  }
}

export async function removePlayer(discordId: string): Promise<string> {
  const playerExists = await prisma.player.findFirst({
    where: { discordId, deletedAt: null },
  });
  if (!playerExists) {
    return `You're already not in the game!`;
  }
  try {
    const db = await prisma.player.update({
      where: {
        discordId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    console.log(chalk.green(`Removed ${db.username}!`));
    return `Removed player ${JSON.stringify(db.username)}`;
  } catch (error) {
    console.log(chalk.red(`Error removing player: `, error));
    return `Failed to remove player, ask KirbyPaint to see what happened`;
  }
}

export async function renamePlayer(
  rest: string[],
  discordId: string,
): Promise<string> {
  const newName = rest.join(` `);
  if (!newName) {
    return `You need to provide a new name!`;
  }
  if (newName.length > 32) {
    return `That nickname is too long!`;
  }
  try {
    const db = await prisma.player.update({
      where: {
        discordId,
      },
      data: {
        username: newName,
      },
    });
    console.log(chalk.green(`Renamed to ${JSON.stringify(db.username)}!`));
    return `Renamed player to ${JSON.stringify(db.username)}`;
  } catch (error) {
    console.log(chalk.red(`Error renaming player: `, error));
    return `Failed to rename player, ask KirbyPaint to see what happened`;
  }
}

export async function listPlayers(): Promise<string> {
  const players = await prisma.player.findMany({
    where: { deletedAt: null },
  });
  // Make array of all players with their scores and sort by score
  const playerList = players
    .map((player) => `${player.username} (${player.xp})`)
    .sort((a, b) => {
      const [, aScore] = a.split(`(`);
      const [, bScore] = b.split(`(`);
      return (
        Number(bScore.slice(0, bScore.length - 1)) -
        Number(aScore.slice(0, aScore.length - 1))
      );
    });
  return `\`\`\`${playerList.join(`
`)}\`\`\``;
}

export async function deletePlayer(discordId: string): Promise<string> {
  const playerExists = await prisma.player.findFirst({
    where: { discordId, deletedAt: null },
  });
  if (!playerExists) {
    return `You're already not in the game!`;
  }
  try {
    const db = await prisma.player.delete({
      where: {
        discordId,
      },
    });
    console.log(chalk.green(`Deleted ${JSON.stringify(db.username)}!`));
    return `Deleted player ${JSON.stringify(db.username)}`;
  } catch (error) {
    console.log(chalk.red(`Error deleting player: `, error));
    return `Failed to delete player, ask KirbyPaint to see what happened`;
  }
}

export async function stats(discordId: string) {
  const player = await prisma.player.findFirst({
    where: { discordId, deletedAt: null },
  });
  if (!player) {
    return `You're not in the game!`;
  }
  const output = `\`\`\`Username:   ${player.username}\nDoots:      ${player.xp}\`\`\``;
  return output;
}

export async function restore(discordId: string): Promise<string> {
  const player = await prisma.player.update({
    where: { discordId },
    data: {
      deletedAt: null,
      xp: 50,
      lastDootedAt: null,
    },
  });
  return `Restored ${player.username}!`;
}

export async function resetAll(discordId: string): Promise<string> {
  // only admin can run this command
  if (discordId === process.env.MY_ID) {
    console.log(chalk.red(`FULL RESET`));
    const playersToUpdate = await prisma.player.findMany({
      where: { deletedAt: null },
    });
    // iterate through each active player and reset them to defaults
    for (const player of playersToUpdate) {
      await prisma.player.update({
        where: {
          discordId: player.discordId,
        },
        data: {
          xp: 50,
          lastDootedAt: new Date(new Date().getTime() - fiveMinutes),
        },
      });
      console.log(`${player.username} updated`);
    }
    return `All currently active players have been restored to default values.`;
  }
  return `You don't have permission to do that!`;
}
