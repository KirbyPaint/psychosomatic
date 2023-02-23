import { PrismaClient } from "@prisma/client";
import { fiveMinutes, getRandomArbitrary } from "../consts";
import chalk from "chalk";

const prisma = new PrismaClient();

export async function playerCount(): Promise<number> {
  const players = await prisma.player.findMany({
    where: { deletedAt: null },
  });
  return players.length;
}

export async function addPlayer(
  discordId: string,
  username: string,
  rest: string[],
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
  discordId: string,
  rest: string[],
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

export async function doot(discordId: string, rest: string[]): Promise<string> {
  // Command will be !doot <PlayerName> <Damage>
  // This should handle a username being multiple words
  const atk = rest[rest.length - 1];
  const defendingUsername = rest.slice(0, rest.length - 1).join(` `);
  const damage = Number(atk);
  if (!defendingUsername || !damage) {
    return `Invalid command, please post in !doot <PlayerName> <Damage> form (with no brackets)`;
  }

  // Get attacking player entity, make sure they're playing
  const attackingPlayer = await prisma.player.findFirst({
    where: { discordId, deletedAt: null },
  });
  if (!attackingPlayer) {
    return `You're not in the game!`;
  }

  // Check that the attacker hasn't attacked too recently
  const now = new Date();
  const lastDooted = new Date(attackingPlayer.lastDootedAt ?? 0);
  const timeDiff = now.getTime() - lastDooted.getTime();
  if (timeDiff < fiveMinutes) {
    return `You can only doot once every 5 minutes.\n  Next doot available in ${Math.round(
      300 - timeDiff / 1000,
    )} seconds!`;
  }

  // Check that the defender is in the database
  const defendingPlayer = await prisma.player.findFirst({
    where: { username: defendingUsername, deletedAt: null },
  });
  if (!defendingPlayer) {
    return `${defendingUsername} is not in the game!`;
  }

  // Check that the defender has enough doots to be attacked
  if (defendingPlayer.xp < 1) {
    return `${defendingPlayer.username} has too few doots to be attacked!`;
  }

  // Then check that the damage is a) a number
  // and b) between 0 and the XP amount of the current player
  if (!Number.isInteger(damage)) {
    return `${damage} is not a positive, whole number!`;
  } else if (damage < 1 || damage > Math.floor(attackingPlayer.xp / 2)) {
    return `${damage} is not a valid doot number for you! Must be between 1 and ${Math.floor(
      attackingPlayer.xp / 2,
    )}`;
  }

  // Check that the player is not attacking themselves
  if (attackingPlayer.username === defendingPlayer.username) {
    return `You can't doot yourself!`;
  }

  /*
   * Attacking!
   *
   * In order for an attack to happen:
   * The ATTACKER must have at least 1 xp
   * The DEFENDER must have at least 1 xp
   *
   * Attacker can doot up to half of their xp
   * Defender will take all doots damage
   *
   * Attacker will gain all of the xp lost by defender UP TO 100 xp
   *
   * Defending!
   *
   * A successful defend will net 1/4 of the damage
   * Attacker will not receive any additional damage, just the xp loss
   *
   * Attack Logic
   * we will do 2 d10 rolls
   * no buffs from either side until items are implemented
   * current rules are probably way imbalanced
   *
   */

  const attackerDice = Math.round(getRandomArbitrary(1, 10));
  const defenderDice = Math.round(getRandomArbitrary(1, 10));
  // Attack must EXCEED defend

  let outcome = ``;
  if (attackerDice <= defenderDice) {
    try {
      const result = await prisma.$transaction([
        prisma.player.update({
          where: { discordId: attackingPlayer.discordId },
          data: {
            xp: attackingPlayer.xp - damage,
            lastDootedAt: new Date(),
          },
        }),
        prisma.player.update({
          where: { discordId: defendingPlayer.discordId },
          data: {
            xp: defendingPlayer.xp + Math.floor(damage / 4) + 1,
          },
        }),
      ]);
      console.log(chalk.green(`${JSON.stringify(result)}`));
      if (result.length === 2) {
        outcome = `${
          defendingPlayer.username
        } rolled <${defenderDice}> and defended with a ${
          attackerDice === defenderDice ? `BETTER` : ``
        } <${attackerDice}> against ${
          attackingPlayer.username
        }'s ${damage} doots!`;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(chalk.red(`Error updating player: `, error));
        outcome = `Failed to complete doot: ${error.toString()}`;
      }
    }
  } else {
    // Attacker gains all xp lost by defender up to 100
    const attackerGains = Math.min(damage, 100);
    try {
      const result = await prisma.$transaction([
        prisma.player.update({
          where: { discordId: defendingPlayer.discordId },
          data: {
            xp: defendingPlayer.xp - damage,
          },
        }),
        prisma.player.update({
          where: { discordId: attackingPlayer.discordId },
          data: {
            xp: attackingPlayer.xp + attackerGains,
            lastDootedAt: new Date(),
          },
        }),
      ]);
      if (result.length === 2) {
        outcome = `${attackingPlayer.username} rolled a <${attackerDice}> and successfully defeated ${defendingPlayer.username}'s defense of <${defenderDice}>!`;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(chalk.red(`Error updating player: `, error));
        outcome = `Failed to complete doot: ${error.toString()}`;
      }
    }
  }
  return outcome;
}
