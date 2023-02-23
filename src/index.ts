import { Client, Intents, Message } from "discord.js";
import dotenv from "dotenv";
import { iThinkWeAll, vicPic, vicQuote } from "./reactions/victoria";
import {
  alanisReactions,
  blacklist,
  BRAIN_CELL_ID,
  channelBlacklist,
  CONCH_ID,
  cursedRegex,
  DOOT_COMMANDS,
  fastNFuriousRegex,
  fiveMinutes,
  getRandomArbitrary,
  help,
  isGameAllowedChannel,
  jpegReactions,
  jpegRegex,
  MANIFEST_ID,
  naughtyWordReactions,
  SHEEV_ID,
  weepRegex,
} from "./consts";
import { get8Ball } from "./gets/8ball";
import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import { redootJob } from "./cron/jobs";
import {
  addToPlaylist,
  whichEpisode,
  whichMovie,
  whichPlaylist,
  whichShow,
} from "./episode-finder";
import {
  addPlayer,
  deletePlayer,
  doot,
  listPlayers,
  removePlayer,
  renamePlayer,
  resetAll,
  restore,
  stats,
} from "./doots_game";

dotenv.config();

const prisma = new PrismaClient();

// create new client
/**
 * Error:
 * "Privileged intent provided is not enabled or whitelisted."
 *
 * Solution:
 * Bot must be given these intents in the Discord Developer Portal
 */
const DISALLOWED_INTENTS = [2, 256];
const intents = Object.values({ ...Intents.FLAGS }).filter(
  (intent) => !DISALLOWED_INTENTS.includes(intent),
);
const client = new Client({
  intents,
});

// actions to take when the bot receives a message
client.on(`messageCreate`, async (msg: Message) => {
  const isPostedByBot = msg.author.id === process.env.BOT_ID;
  const currentGuildId = msg.guildId;

  if (isGameAllowedChannel(msg.channel.id)) {
    const [command, ...rest] = msg.content.split(` `);
    const { id, username } = msg.author;

    if (DOOT_COMMANDS.includes(command.toLowerCase())) {
      switch (command.toLowerCase()) {
        case `!add`:
        case `!addplayer`: {
          msg.channel.send(await addPlayer(id, username, rest));
          break;
        }
        case `!remove`:
        case `!removeplayer`: {
          msg.channel.send(await removePlayer(id));
          break;
        }
        case `!rename`:
        case `renameplayer`: {
          msg.channel.send(await renamePlayer(id, rest));
          break;
        }
        case `!score`:
        case `!players`: {
          msg.channel.send(await listPlayers());
          break;
        }
        case `!deleteplayer`:
        case `!delete`: {
          msg.channel.send(await deletePlayer(id));
          break;
        }
        case `!count`:
        case `!stats`: {
          msg.channel.send(await stats(id));
          break;
        }
        case `!restore`:
        case `!restoreplayer`: {
          msg.channel.send(await restore(id));
          break;
        }
        case `!resetall`: {
          msg.channel.send(await resetAll(id));
          break;
        }
        case `!attack`:
        case `!doot`: {
          msg.channel.send(await doot());
          break;
        }
      }
    }
  }

  // chillbros DOOTS game
  if (isGameAllowedChannel(msg.channel.id)) {
    // Attack
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
    //   // Attack must EXCEED OR MEET defend
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
  }

  // Bot echo command
  if (msg.content.startsWith(`!vecho`)) {
    const [, ...rest] = msg.content.split(` `);
    const message = rest.join(` `);
    msg.channel.send(message);
  }

  // Processes to be used only for our special server
  if (currentGuildId === process.env.DUMMIES && !isPostedByBot) {
    if (
      msg.content.toLowerCase().match(cursedRegex) &&
      !msg.content.toLowerCase().includes(`victoria`)
    ) {
      const randomNumber = getRandomArbitrary(0, naughtyWordReactions.length);
      msg.channel.send(`${naughtyWordReactions[Math.floor(randomNumber)]}`);
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

    if (msg.content.toLowerCase().includes(`which episode`)) {
      msg.channel.send(whichEpisode());
    }

    if (msg.content.toLowerCase().includes(`which show`)) {
      msg.channel.send(whichShow());
    }

    if (msg.content.toLowerCase().includes(`which movie`)) {
      msg.channel.send(whichMovie());
    }

    if (msg.content.toLowerCase().startsWith(`!addplaylist`)) {
      const [, ...rest] = msg.content.split(` `);
      msg.channel.send(addToPlaylist(rest.join(` `)));
    }

    if (msg.content.toLowerCase().includes(`which playlist`)) {
      msg.channel.send(whichPlaylist());
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
        // const result = await prisma.$transaction([
        //   prisma.braincell.update({
        //     where: { discordId: brainCells[0].discordId },
        //     data: {
        //       hasBrainCell: !brainCells[0].hasBrainCell,
        //     },
        //   }),
        //   prisma.braincell.update({
        //     where: { discordId: brainCells[1].discordId },
        //     data: {
        //       hasBrainCell: !brainCells[1].hasBrainCell,
        //     },
        //   }),
        // ]);
        // const newBrainCells = await prisma.braincell.findMany();
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

    // EDGE CASES: "I think so?"
    if (
      msg.content.toLowerCase().startsWith(`i think`) &&
      msg.content.length >= 8 &&
      msg.content.length <= 50 &&
      !blacklist.includes(msg.author.id) &&
      !channelBlacklist.includes(msg.channel.id)
    ) {
      if (msg.content.toLowerCase().includes(`i think we all sing`)) {
        msg.channel.send(
          `https://pbs.twimg.com/media/C-iOjtzUwAAHz9L?format=jpg&name=900x900`,
        );
        return;
      }
      msg.channel.send(iThinkWeAll(msg.content));
      msg.channel.send(vicPic());
      return;
    }

    if (msg.content.toLowerCase().includes(`victoria`)) {
      // any command having to do with addressing the bot by name
      if (
        (msg.content.toLowerCase().startsWith(`victoria`) &&
          msg.content.includes(`?`)) ||
        (msg.content.toLowerCase().startsWith(`hey victoria`) &&
          msg.content.includes(`?`))
      ) {
        // ask her a question
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
      msg.react(`8️⃣`); // it's seriously just the unicode emoji
      msg.react(`6️⃣`);
      msg.react(`7️⃣`);
      msg.react(`5️⃣`);
      msg.react(`3️⃣`);
      msg.react(`0️⃣`);
      msg.react(`9️⃣`);
    }

    // Alanis
    if (
      msg.content.toLowerCase().includes(`ironic`) ||
      msg.content.toLowerCase().includes(`alanis`) ||
      msg.channel.id === `715766875971256322`
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
    if (msg.content.toLowerCase().match(fastNFuriousRegex)) {
      const wordsArray = msg.content.match(fastNFuriousRegex);
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

  // not using rn come back to this later
  // console.log(
  //   `Logged in as ${client?.user?.tag}!\n with ${player} Dootiverse player${
  //     player === 1 ? `` : `s`
  //   }`,
  // );
  redootJob.start();

  // set bot status
  client.user?.setActivity(`Victorious 24/7`, { type: 3 });
});

// make sure this line is the last line
client.login(process.env.CLIENT_TOKEN);
