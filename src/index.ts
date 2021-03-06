import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import { vicPic, vicQuote } from "./reactions/victoria";
import {
  alanisReactions,
  blacklist,
  BRAIN_CELL_ID,
  channelBlacklist,
  CONCH_ID,
  fiveMinutes,
  gameAllowedChannels,
  getRandomArbitrary,
  help,
  jpegReactions,
  jpegRegex,
  MANIFEST_ID,
  SHEEV_ID,
  weepRegex,
} from "./consts";
import { get8Ball } from "./gets/8ball";
import { vicLogic } from "./reactions/victoria.logic";
import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import { redootJob } from "./cron/jobs";

dotenv.config();

const prisma = new PrismaClient();

//create new client
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

// I will come back to this
// interface IError {
//   code: string;
//   clientVersion: string;
//   meta: {
//     code: string;
//     message: string;
//   };
// }

// this array has to stay in this file because otherwise it can't read the .env
// can probably move the config line but nah
// const BRAIN_CELL_OWNERS = [process.env.MY_ID, process.env.HER_ID];
// let whoHasTheBrainCell = BRAIN_CELL_OWNERS[1];

client.on(`messageCreate`, async (msg) => {
  const isPostedByBot = msg.author.id === process.env.BOT_ID;
  const currentGuildId = msg.guildId;

  if (gameAllowedChannels.includes(msg.channel.id)) {
    // Game channel
    if (msg.content.toLowerCase().startsWith(`!addplayer`)) {
      // Add Player
      const [, ...rest] = msg.content.split(` `);
      const playerNickname = rest.join(` `);
      const playerExists = await prisma.player.findFirst({
        where: { discordId: msg.author.id },
      });
      if (playerExists) {
        if (playerExists.deletedAt) {
          await prisma.player.update({
            where: { discordId: msg.author.id },
            data: { deletedAt: null },
          });
          console.log(chalk.green(`Restored ${playerExists.username}!`));
          msg.channel.send(`${playerExists.username} has been restored!`);
          return;
        }
        msg.channel.send(`You're already in the game!`);
        return;
      }
      try {
        const db = await prisma.player.create({
          data: {
            username: playerNickname ? playerNickname : msg.author.username,
            discordId: msg.author.id,
            xp: 50,
          },
        });
        console.log(chalk.green(`Added ${JSON.stringify(db.username)}!`));
        msg.channel.send(`Added player ${JSON.stringify(db.username)}`);
      } catch (error) {
        console.log(chalk.red(`Error adding player: `, error));
        msg.channel.send(
          `Failed to add player, ask KirbyPaint to see what happened`,
        );
      }
    }
    // Remove Player (soft delete)
    if (msg.content.toLowerCase().startsWith(`!removeplayer`)) {
      const playerExists = await prisma.player.findFirst({
        where: { discordId: msg.author.id, deletedAt: null },
      });
      if (!playerExists) {
        msg.channel.send(`You're already not in the game!`);
        return;
      }
      try {
        const db = await prisma.player.update({
          where: {
            discordId: msg.author.id,
          },
          data: {
            deletedAt: new Date(),
          },
        });
        console.log(chalk.green(`Removed ${db.username}!`));
        msg.channel.send(`Removed player ${JSON.stringify(db.username)}`);
      } catch (error) {
        console.log(chalk.red(`Error removing player: `, error));
        msg.channel.send(
          `Failed to remove player, ask KirbyPaint to see what happened`,
        );
      }
    }
    // Rename
    if (msg.content.toLowerCase().startsWith(`!rename`)) {
      const [, ...rest] = msg.content.split(` `);
      const newName = rest.join(` `);
      if (!newName) {
        msg.channel.send(`You need to provide a new name!`);
        return;
      }
      if (newName.length > 32) {
        msg.channel.send(`That nickname is too long!`);
        return;
      }
      try {
        const db = await prisma.player.update({
          where: {
            discordId: msg.author.id,
          },
          data: {
            username: newName,
          },
        });
        console.log(chalk.green(`Renamed to ${JSON.stringify(db.username)}!`));
        msg.channel.send(`Renamed player to ${JSON.stringify(db.username)}`);
      } catch (error) {
        console.log(chalk.red(`Error renaming player: `, error));
        msg.channel.send(
          `Failed to rename player, ask KirbyPaint to see what happened`,
        );
      }
    }
    // List all participating players
    if (msg.content.toLowerCase().startsWith(`!players`)) {
      const players = await prisma.player.findMany({
        where: { deletedAt: null },
      });
      const playerList = players.map((player) => player.username);
      msg.channel.send(`Players: ${playerList.join(`, `)}\n`);
    }
    // Hard delete player (remove from db altogether)
    if (msg.content === `!deletePlayer`) {
      const playerExists = await prisma.player.findFirst({
        where: { discordId: msg.author.id, deletedAt: null },
      });
      if (!playerExists) {
        msg.channel.send(`You're already not in the game!`);
        return;
      }
      try {
        const db = await prisma.player.delete({
          where: {
            discordId: msg.author.id,
          },
        });
        console.log(chalk.green(`Deleted ${JSON.stringify(db.username)}!`));
        msg.channel.send(`Deleted player ${JSON.stringify(db.username)}`);
      } catch (error) {
        console.log(chalk.red(`Error deleting player: `, error));
        msg.channel.send(
          `Failed to delete player, ask KirbyPaint to see what happened`,
        );
      }
    }
    // Attack
    if (msg.content.toLowerCase().startsWith(`!doot`)) {
      // Command will be !doot <PlayerName> <Damage>
      const [, ...rest] = msg.content.split(` `);
      // This should handle a username being multiple words
      const atk = rest[rest.length - 1];
      const defendingUsername = rest.slice(0, rest.length - 1).join(` `);
      const damage = Number(atk);
      if (!defendingUsername || !damage) {
        msg.channel.send(
          `Invalid command, please post in !doot <PlayerName> <Damage> form (with no brackets)`,
        );
        return;
      }

      // Get attacking player entity, make sure they're playing
      const attackingPlayer = await prisma.player.findFirst({
        where: { discordId: msg.author.id, deletedAt: null },
      });
      if (!attackingPlayer) {
        msg.channel.send(`You're not in the game!`);
        return;
      }

      // Check that the attacker hasn't attacked too recently
      const now = new Date();
      const lastDooted = new Date(attackingPlayer.lastDootedAt ?? 0);
      const timeDiff = now.getTime() - lastDooted.getTime();
      if (timeDiff < fiveMinutes) {
        msg.channel.send(
          `You can only doot once every 5 minutes.\n  Next doot available in ${Math.round(
            300 - timeDiff / 1000,
          )} seconds!`,
        );
        return;
      }

      // Check that the defender is in the database
      const defendingPlayer = await prisma.player.findFirst({
        where: { username: defendingUsername, deletedAt: null },
      });
      if (!defendingPlayer) {
        msg.channel.send(`${defendingUsername} is not in the game!`);
        return;
      }

      // Check that the defender has enough doots to be attacked
      if (defendingPlayer.xp < 1) {
        msg.channel.send(
          `${defendingPlayer.username} has too few doots to be attacked!`,
        );
        return;
      }

      // Then check that the damage is a) a number
      // and b) between 0 and the XP amount of the current player
      if (!Number.isInteger(damage)) {
        msg.channel.send(`${damage} is not a positive, whole number!`);
        return;
      } else if (damage < 1 || damage > Math.floor(attackingPlayer.xp / 2)) {
        msg.channel.send(
          `${damage} is not a valid doot number for you! Must be between 1 and ${Math.floor(
            attackingPlayer.xp / 2,
          )}`,
        );
        return;
      }

      // Check that the player is not attacking themselves
      if (attackingPlayer.username === defendingPlayer.username) {
        msg.channel.send(`You can't doot yourself!`);
        return;
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
       * we will do 2d10 rolls
       * no buffs from either side until items are implemented
       * current rules are probably way imbalanced
       *
       */

      const attackerDice = getRandomArbitrary(1, 10);
      const defenderDice = getRandomArbitrary(1, 10);
      // Attack must EXCEED defend
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
            msg.channel.send(
              `${defendingPlayer.username} defended against ${attackingPlayer.username}'s ${damage} doots!`,
            );
          }
        } catch (error) {
          if (error instanceof Error) {
            console.log(chalk.red(`Error updating player: `, error));
            msg.channel.send(`Failed to complete doot: `);
            msg.channel.send(error.toString());
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
            msg.channel.send(
              `${attackingPlayer.username} successfully attacked ${defendingPlayer.username}!`,
            );
          }
        } catch (error) {
          if (error instanceof Error) {
            console.log(chalk.red(`Error updating player: `, error));
            msg.channel.send(`Failed to complete doot: `);
            msg.channel.send(error.toString());
          }
        }
      }
    }
    // Completely reset all active players
    if (msg.content === `!resetall` && msg.author.id === process.env.MY_ID) {
      console.log(chalk.red(`FULL RESET`));
      const playersToUpdate = await prisma.player.findMany({
        where: { deletedAt: null },
      });
      // iterate through each player and reset them to defaults
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
      msg.channel.send(
        `All currently active players have been restored to default values.`,
      );
    }
    // Count one's own doots
    if (msg.content.toLowerCase().startsWith(`!count`)) {
      const currentPlayer = await prisma.player.findFirst({
        where: { discordId: msg.author.id, deletedAt: null },
      });
      if (!currentPlayer) {
        msg.channel.send(`You're not in the game!`);
        return;
      }
      msg.channel.send(
        `${currentPlayer.username} has ${currentPlayer.xp} doots!`,
      );
    }
    // Restore a player to default values
    if (msg.content.toLowerCase().startsWith(`!restore`)) {
      await prisma.player.update({
        where: { discordId: msg.author.id },
        data: {
          deletedAt: null,
          xp: 50,
          lastDootedAt: null,
        },
      });
      msg.channel.send(`Restored ${msg.author.username}!`);
    }
    // Stats
    if (msg.content.toLowerCase().startsWith(`!stats`)) {
      const player = await prisma.player.findFirst({
        where: { discordId: msg.author.id, deletedAt: null },
      });
      if (!player) {
        msg.channel.send(`You're not in the game!`);
        return;
      }
      const output = `\`\`\`Username:   ${player.username}\nDoots:      ${player.xp}\`\`\``;
      msg.channel.send(output);
    }
  }

  // Bot echo
  if (msg.content.startsWith(`!vecho`)) {
    const [, ...rest] = msg.content.split(` `);
    const message = rest.join(` `);
    msg.channel.send(message);
  }

  // Processes only for our special server
  if (currentGuildId === process.env.GUILD_ID && !isPostedByBot) {
    if (
      msg.content.toLowerCase().match(/\bfoot\b|\bfeet\b/) &&
      !msg.content.toLowerCase().includes(`victoria`)
    ) {
      msg.channel.send(vicLogic(msg.content) ?? `I don't know what to say`);
    }

    if (msg.content.toLowerCase().match(weepRegex)) {
      msg.channel.send(`*ouiiip`);
    }

    // One brain cell
    // command to check the brain cell
    if (msg.content.toLowerCase().includes(`who has the brain cell`)) {
      // this should only have to happen once
      const allBrainCells = await prisma.braincell.findMany({
        where: { hasBrainCell: true },
      });
      if (allBrainCells.length === 0) {
        await prisma.braincell.update({
          where: { discordId: msg.author.id },
          data: {
            hasBrainCell: true,
          },
        });
      }
      const brainCell = await prisma.braincell.findFirst({
        where: { hasBrainCell: true },
      });
      if (brainCell) {
        msg.channel.send(
          `<@${brainCell.discordId}> has the brain cell <:onebraincell:${BRAIN_CELL_ID}>`,
        );
      } else {
        // and ideally this NEVER happens
        msg.channel.send(
          `No one has the brain cell <:onebraincell:${BRAIN_CELL_ID}>`,
        );
      }
    }

    // command to transfer the brain cell

    // for the future - this should be more like
    // "if the sender is trying to claim the brain cell, don't let them"
    if (msg.content.toLowerCase().includes(`!give`)) {
      const brainCells = await prisma.braincell.findMany();
      const [brainCellOwner] = brainCells.filter(
        (cell) => cell.hasBrainCell === true,
      );
      if (brainCellOwner.discordId === msg.author.id) {
        // Swap the falses and trues in the database
        // This calls for a transaction
        // I do not love that this isn't procedural HOWEVER
        // there will always only be 2 people and 1 braincell
        // so this should never have to change
        const result = await prisma.$transaction([
          prisma.braincell.update({
            where: { discordId: brainCells[0].discordId },
            data: {
              hasBrainCell: !brainCells[0].hasBrainCell,
            },
          }),
          prisma.braincell.update({
            where: { discordId: brainCells[1].discordId },
            data: {
              hasBrainCell: !brainCells[1].hasBrainCell,
            },
          }),
        ]);
        const newBrainCells = await prisma.braincell.findMany();
        const [newBrainCellOwner] = brainCells.filter(
          (cell) => cell.hasBrainCell === true,
        );
        msg.channel.send(
          `<@${newBrainCellOwner.discordId}> now has the brain cell <:onebraincell:${BRAIN_CELL_ID}>`,
        );
        return;
      } else {
        msg.channel.send(
          `You cannot steal the brain cell, it must be given willingly.`,
        );
      }
    }
  }
  // wrap this all in a big IF that checks if the message is from herself
  // Also a section that limits certain commands to certain servers

  if (!isPostedByBot) {
    // PSYCHOSOMATIC
    if (msg.content.toLowerCase().includes(`psychosomatic`)) {
      msg.reply(`THAT BOY NEEDS THERAPY`);
    }

    // Manifest
    if (msg.content.toLowerCase().includes(`manifest`)) {
      msg.react(MANIFEST_ID);
    }

    // Conch
    if (msg.content.toLowerCase().includes(`maybe someday`)) {
      msg.react(CONCH_ID);
    }

    // Victoria Justice
    if (
      msg.content.toLowerCase().startsWith(`i think`) &&
      msg.content.length <= 50 &&
      !blacklist.includes(msg.author.id) &&
      !channelBlacklist.includes(msg.channel.id)
    ) {
      if (msg.content.toLowerCase() === `i think we all sing`) {
        msg.reply(
          `https://pbs.twimg.com/media/C-iOjtzUwAAHz9L?format=jpg&name=900x900`,
        );
        return;
      } else {
        msg.channel.send(vicLogic(msg.content));
        msg.channel.send(vicPic());
        return;
      }
    }

    if (msg.content.toLowerCase().includes(`victoria`)) {
      // ask her a question
      if (
        (msg.content.toLowerCase().startsWith(`victoria`) &&
          msg.content.includes(`?`)) ||
        (msg.content.toLowerCase().startsWith(`hey victoria`) &&
          msg.content.includes(`?`))
      ) {
        msg.reply(JSON.stringify(get8Ball()));
        msg.channel.send(vicPic());
        return;
      } else if (msg.content.toLowerCase().includes(`i love you`)) {
        msg.reply(`I love you too`);
        msg.channel.send(vicPic());
        // Intentional early return to prevent 2 vicpics
        return;
      } else {
        // low chance of a random Victorious quote
        if (getRandomArbitrary(0, 100) >= 95) {
          msg.channel.send(vicQuote());
          msg.channel.send(vicPic());
          return;
        }
      }
      msg.channel.send(vicPic());
    }

    if (msg.content.includes(`Toro`)) {
      msg.channel.send(`Did you just call me Toro?`);
    }

    if (msg.content.toLowerCase().includes(`jenny`)) {
      msg.react(`8??????`); // it's seriously just the unicode emoji
      msg.react(`6??????`);
      msg.react(`7??????`);
      msg.react(`5??????`);
      msg.react(`3??????`);
      msg.react(`0??????`);
      msg.react(`9??????`);
    }

    // Alanis
    if (
      msg.content.toLowerCase().includes(`ironic`) ||
      msg.content.toLowerCase().includes(`alanis`)
    ) {
      // 1/20 chance of Alanisposting
      if (getRandomArbitrary(1, 100) >= 95) {
        msg.channel.send(
          `${
            alanisReactions[
              Math.floor(getRandomArbitrary(0, alanisReactions.length - 1))
            ]
          }`,
        );
      }
    }

    // do I look like I know what a jpeg is?
    if (msg.content.toLowerCase().match(jpegRegex)) {
      if (getRandomArbitrary(1, 100) > 85) {
        msg.channel.send(
          `${
            jpegReactions[
              Math.floor(getRandomArbitrary(0, jpegReactions.length - 1))
            ]
          }`,
        );
      }
    }

    // 2 Fast 2 Furious converter
    if (
      msg.content.toLowerCase().match(/(too)+ [a-zA-Z]+ (to?o)+ [a-zA-Z]+/i)
    ) {
      const wordsArray = msg.content.match(
        /(too)+ [a-zA-Z]+ (to?o)+ [a-zA-Z]+/i,
      ); // this might be shit but it'll do the job
      if (wordsArray) {
        const wordsArray2 = wordsArray[0].split(` `);
        wordsArray2[0] = `2`;
        wordsArray2[2] = `2`;
        const newString = wordsArray2.join(` `);
        msg.channel.send(newString);
      }
    }

    // Shia Surprise
    if (msg.content.toLowerCase().includes(`shia labeouf`)) {
      msg.channel.send(`https://youtu.be/o0u4M6vppCI`);
    }

    // DO IT
    if (msg.content.toLowerCase().includes(`do it`)) {
      msg.react(SHEEV_ID);
    }

    // Help
    if (msg.content.toLowerCase() === `!help`) {
      msg.channel.send(help());
    }

    // Bob's Burgers
    if (msg.content.toLowerCase().includes(`burgerboss`)) {
      msg.channel.send(
        `https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRShYgX1IfRVVqMr55MsAVZ3mdeD8LHYS9eAUUyZ4ygpQONDlPR`,
      );
    }

    if (msg.content.toLowerCase().includes(`noncanonical`)) {
      msg.channel.send(`https://youtu.be/GoAPSBMQEKU`);
    }
  }
});

client.on(`ready`, async () => {
  const braincells = await prisma.braincell.count();
  if (braincells === 0) {
    console.log(chalk.red(`no braincell has been given`));
    console.log(chalk.yellow(`Please run yarn seed`));
  }
  // console.log(
  //   `Logged in as ${client?.user?.tag}!\n with ${player} Dootiverse player${
  //     player === 1 ? `` : `s`
  //   }`,
  // );
  redootJob.start();
  // set status
  client.user?.setActivity(`Victorious 24/7`, { type: `WATCHING` });
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN);
