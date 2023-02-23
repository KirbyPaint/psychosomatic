import { PrismaClient } from "@prisma/client";
import { getRandomArbitrary, isGameAllowedChannel } from "../consts";
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

// // Rename
// if (msg.content.toLowerCase().startsWith(`!rename`)) {
//   const [, ...rest] = msg.content.split(` `);
//   const newName = rest.join(` `);
//   if (!newName) {
//     msg.channel.send(`You need to provide a new name!`);
//     return;
//   }
//   if (newName.length > 32) {
//     msg.channel.send(`That nickname is too long!`);
//     return;
//   }
//   try {
//     const db = await prisma.player.update({
//       where: {
//         discordId: msg.author.id,
//       },
//       data: {
//         username: newName,
//       },
//     });
//     console.log(chalk.green(`Renamed to ${JSON.stringify(db.username)}!`));
//     msg.channel.send(`Renamed player to ${JSON.stringify(db.username)}`);
//   } catch (error) {
//     console.log(chalk.red(`Error renaming player: `, error));
//     msg.channel.send(
//       `Failed to rename player, ask KirbyPaint to see what happened`,
//     );
//   }
// }

// // List all participating players
// if (msg.content.toLowerCase().startsWith(`!players`)) {
//   const players = await prisma.player.findMany({
//     where: { deletedAt: null },
//   });
//   const playerList = players.map((player) => player.username);
//   msg.channel.send(`Players: ${playerList.join(`, `)}\n`);
// }
// // Hard delete player (remove from db altogether)
// if (msg.content === `!deletePlayer`) {
//   const playerExists = await prisma.player.findFirst({
//     where: { discordId: msg.author.id, deletedAt: null },
//   });
//   if (!playerExists) {
//     msg.channel.send(`You're already not in the game!`);
//     return;
//   }
//   try {
//     const db = await prisma.player.delete({
//       where: {
//         discordId: msg.author.id,
//       },
//     });
//     console.log(chalk.green(`Deleted ${JSON.stringify(db.username)}!`));
//     msg.channel.send(`Deleted player ${JSON.stringify(db.username)}`);
//   } catch (error) {
//     console.log(chalk.red(`Error deleting player: `, error));
//     msg.channel.send(
//       `Failed to delete player, ask KirbyPaint to see what happened`,
//     );
//   }
// }

// // Attack
// if (msg.content.toLowerCase().startsWith(`!doot`)) {
//   // Command will be !doot <PlayerName> <Damage>
//   const [, ...rest] = msg.content.split(` `);
//   // This should handle a username being multiple words
//   const atk = rest[rest.length - 1];
//   const defendingUsername = rest.slice(0, rest.length - 1).join(` `);
//   const damage = Number(atk);
//   if (!defendingUsername || !damage) {
//     msg.channel.send(
//       `Invalid command, please post in !doot <PlayerName> <Damage> form (with no brackets)`,
//     );
//     return;
//   }

//   // Get attacking player entity, make sure they're playing
//   const attackingPlayer = await prisma.player.findFirst({
//     where: { discordId: msg.author.id, deletedAt: null },
//   });
//   if (!attackingPlayer) {
//     msg.channel.send(`You're not in the game!`);
//     return;
//   }

//   // Check that the attacker hasn't attacked too recently
//   const now = new Date();
//   const lastDooted = new Date(attackingPlayer.lastDootedAt ?? 0);
//   const timeDiff = now.getTime() - lastDooted.getTime();
//   if (timeDiff < fiveMinutes) {
//     msg.channel.send(
//       `You can only doot once every 5 minutes.\n  Next doot available in ${Math.round(
//         300 - timeDiff / 1000,
//       )} seconds!`,
//     );
//     return;
//   }

//   // Check that the defender is in the database
//   const defendingPlayer = await prisma.player.findFirst({
//     where: { username: defendingUsername, deletedAt: null },
//   });
//   if (!defendingPlayer) {
//     msg.channel.send(`${defendingUsername} is not in the game!`);
//     return;
//   }

//   // Check that the defender has enough doots to be attacked
//   if (defendingPlayer.xp < 1) {
//     msg.channel.send(
//       `${defendingPlayer.username} has too few doots to be attacked!`,
//     );
//     return;
//   }

//   // Then check that the damage is a) a number
//   // and b) between 0 and the XP amount of the current player
//   if (!Number.isInteger(damage)) {
//     msg.channel.send(`${damage} is not a positive, whole number!`);
//     return;
//   } else if (damage < 1 || damage > Math.floor(attackingPlayer.xp / 2)) {
//     msg.channel.send(
//       `${damage} is not a valid doot number for you! Must be between 1 and ${Math.floor(
//         attackingPlayer.xp / 2,
//       )}`,
//     );
//     return;
//   }

//   // Check that the player is not attacking themselves
//   if (attackingPlayer.username === defendingPlayer.username) {
//     msg.channel.send(`You can't doot yourself!`);
//     return;
//   }

//   /*
//    * Attacking!
//    *
//    * In order for an attack to happen:
//    * The ATTACKER must have at least 1 xp
//    * The DEFENDER must have at least 1 xp
//    *
//    * Attacker can doot up to half of their xp
//    * Defender will take all doots damage
//    *
//    * Attacker will gain all of the xp lost by defender UP TO 100 xp
//    *
//    * Defending!
//    *
//    * A successful defend will net 1/4 of the damage
//    * Attacker will not receive any additional damage, just the xp loss
//    *
//    * Attack Logic
//    * we will do 2 d10 rolls
//    * no buffs from either side until items are implemented
//    * current rules are probably way imbalanced
//    *
//    */

//   const attackerDice = getRandomArbitrary(1, 10);
//   const defenderDice = getRandomArbitrary(1, 10);
//   // Attack must EXCEED defend
//   if (attackerDice <= defenderDice) {
//     try {
//       const result = await prisma.$transaction([
//         prisma.player.update({
//           where: { discordId: attackingPlayer.discordId },
//           data: {
//             xp: attackingPlayer.xp - damage,
//             lastDootedAt: new Date(),
//           },
//         }),
//         prisma.player.update({
//           where: { discordId: defendingPlayer.discordId },
//           data: {
//             xp: defendingPlayer.xp + Math.floor(damage / 4) + 1,
//           },
//         }),
//       ]);
//       console.log(chalk.green(`${JSON.stringify(result)}`));
//       if (result.length === 2) {
//         msg.channel.send(
//           `${defendingPlayer.username} defended against ${attackingPlayer.username}'s ${damage} doots!`,
//         );
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         console.log(chalk.red(`Error updating player: `, error));
//         msg.channel.send(`Failed to complete doot: `);
//         msg.channel.send(error.toString());
//       }
//     }
//   } else {
//     // Attacker gains all xp lost by defender up to 100
//     const attackerGains = Math.min(damage, 100);
//     try {
//       const result = await prisma.$transaction([
//         prisma.player.update({
//           where: { discordId: defendingPlayer.discordId },
//           data: {
//             xp: defendingPlayer.xp - damage,
//           },
//         }),
//         prisma.player.update({
//           where: { discordId: attackingPlayer.discordId },
//           data: {
//             xp: attackingPlayer.xp + attackerGains,
//             lastDootedAt: new Date(),
//           },
//         }),
//       ]);
//       if (result.length === 2) {
//         msg.channel.send(
//           `${attackingPlayer.username} successfully attacked ${defendingPlayer.username}!`,
//         );
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         console.log(chalk.red(`Error updating player: `, error));
//         msg.channel.send(`Failed to complete doot: `);
//         msg.channel.send(error.toString());
//       }
//     }
//   }
// }

// // Completely reset all active players
// if (msg.content === `!resetall` && msg.author.id === process.env.MY_ID) {
//   console.log(chalk.red(`FULL RESET`));
//   const playersToUpdate = await prisma.player.findMany({
//     where: { deletedAt: null },
//   });
//   // iterate through each player and reset them to defaults
//   for (const player of playersToUpdate) {
//     await prisma.player.update({
//       where: {
//         discordId: player.discordId,
//       },
//       data: {
//         xp: 50,
//         lastDootedAt: new Date(new Date().getTime() - fiveMinutes),
//       },
//     });
//     console.log(`${player.username} updated`);
//   }
//   msg.channel.send(
//     `All currently active players have been restored to default values.`,
//   );
// }

// // Count one's own doots
// if (msg.content.toLowerCase().startsWith(`!count`)) {
//   const currentPlayer = await prisma.player.findFirst({
//     where: { discordId: msg.author.id, deletedAt: null },
//   });
//   if (!currentPlayer) {
//     msg.channel.send(`You're not in the game!`);
//     return;
//   }
//   msg.channel.send(`${currentPlayer.username} has ${currentPlayer.xp} doots!`);
// }

// // Restore a player to default values
// if (msg.content.toLowerCase().startsWith(`!restore`)) {
//   await prisma.player.update({
//     where: { discordId: msg.author.id },
//     data: {
//       deletedAt: null,
//       xp: 50,
//       lastDootedAt: null,
//     },
//   });
//   msg.channel.send(`Restored ${msg.author.username}!`);
// }

// // Stats
// if (msg.content.toLowerCase().startsWith(`!stats`)) {
//   const player = await prisma.player.findFirst({
//     where: { discordId: msg.author.id, deletedAt: null },
//   });
//   if (!player) {
//     msg.channel.send(`You're not in the game!`);
//     return;
//   }
//   const output = `\`\`\`Username:   ${player.username}\nDoots:      ${player.xp}\`\`\``;
//   msg.channel.send(output);
// }
