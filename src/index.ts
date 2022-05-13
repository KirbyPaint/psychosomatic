import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import { vicPic, vicQuote } from "./reactions/victoria";
import {
  alanisReactions,
  BRAIN_CELL_ID,
  CONCH_ID,
  getRandomArbitrary,
  jpegReactions,
  jpegRegex,
  MANIFEST_ID,
  SHEEV_ID,
  weepRegex,
} from "./consts";
import { get8Ball } from "./gets/8ball";
import { help } from "./gets/help";
import { vicLogic } from "./reactions/victoria.logic";
import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

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

interface IError {
  code: string;
  clientVersion: string;
  meta: {
    code: string;
    message: string;
  };
}

// this array has to stay in this file because otherwise it can't read the .env
// can probably move the config line but nah
const BRAIN_CELL_OWNERS = [process.env.MY_ID, process.env.HER_ID];
let whoHasTheBrainCell = BRAIN_CELL_OWNERS[1];

client.on(`messageCreate`, async (msg) => {
  const isPostedByBot = msg.author.id === process.env.BOT_ID;
  const currentGuildId = msg.guildId;

  if (msg.content.startsWith(`!addPlayer`)) {
    const [command, ...rest] = msg.content.split(` `);
    const playerName = rest.join(` `);
    const playerExists = await prisma.player.findFirst({
      where: { discordId: msg.author.id },
    });
    if (playerExists) {
      if (playerExists.deletedAt) {
        await prisma.player.update({
          where: { discordId: msg.author.id },
          data: { deletedAt: null },
        });
        console.log(chalk.green(`Restored ${msg.author.username}!`));
        msg.channel.send(`${msg.author.username} has been restored!`);
        return;
      }
      msg.channel.send(`You're already in the game!`);
      return;
    }
    try {
      const db = await prisma.player.create({
        data: {
          username: playerName ? playerName : msg.author.username,
          discordId: msg.author.id,
          xp: 50,
        },
      });
      console.log(chalk.green(`Added ${msg.author.username}!`));
      msg.channel.send(`Added player ${JSON.stringify(db.username)}`);
    } catch (error) {
      console.log(chalk.red(`Error adding player: `, error));
      msg.channel.send(
        `Failed to add player, ask KirbyPaint to see what happened`,
      );
    }
  }

  if (msg.content === `!removePlayer`) {
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
      console.log(chalk.green(`Removed ${msg.author.username}!`));
      msg.channel.send(`Removed player ${JSON.stringify(db.username)}`);
    } catch (error) {
      console.log(chalk.red(`Error removing player: `, error));
      msg.channel.send(
        `Failed to remove player, ask KirbyPaint to see what happened`,
      );
    }
  }

  if (msg.content.startsWith(`!script`)) {
    const [command, ...rest] = msg.content.split(` `);
    const script = rest.join(` `);
    try {
      const bad = await prisma.$executeRawUnsafe(script);
      console.log(chalk.green(`Executed script!`));
      msg.channel.send(`Executed script: ${bad}`);
    } catch (error: any) {
      console.log(chalk.red(`Error executing script: `, error));
      msg.channel.send(JSON.stringify(error));
    }
    // msg.channel.send(bad.toString());
  }

  if (msg.content.startsWith(`!rename`)) {
    const [command, ...rest] = msg.content.split(` `);
    const newName = rest.join(` `);
    try {
      const db = await prisma.player.update({
        where: {
          discordId: msg.author.id,
        },
        data: {
          username: newName,
        },
      });
      console.log(chalk.green(`Renamed ${msg.author.username}!`));
      msg.channel.send(`Renamed player ${JSON.stringify(db.username)}`);
    } catch (error) {
      console.log(chalk.red(`Error renaming player: `, error));
      msg.channel.send(
        `Failed to rename player, ask KirbyPaint to see what happened`,
      );
    }
  }

  if (msg.content.startsWith(`!vecho`)) {
    const [command, ...rest] = msg.content.split(` `);
    const message = rest.join(` `);
    msg.channel.send(message);
  }

  if (msg.content === `!players`) {
    const players = await prisma.player.findMany({
      where: { deletedAt: null },
    });
    const playerList = players.map((player) => player.username);
    msg.channel.send(`Players: ${playerList.join(`, `)}\n`);
  }

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
      console.log(chalk.green(`Deleted ${msg.author.username}!`));
      msg.channel.send(`Deleted player ${JSON.stringify(db.username)}`);
    } catch (error) {
      console.log(chalk.red(`Error deleting player: `, error));
      msg.channel.send(
        `Failed to delete player, ask KirbyPaint to see what happened`,
      );
    }
  }

  if (msg.content.toLowerCase().startsWith(`!doot`)) {
    // Command will be !doot <PlayerName> <Damage>
    const [, defendingUsername, damage] = msg.content.split(` `);
    if (!defendingUsername || !damage) {
      msg.channel.send(
        `Invalid command, please post in !doot <PlayerName> <Damage> form (with no brackets)`,
      );
      return;
    }
    console.log(
      chalk.green(`attempting to lookup player ${msg.author.username}`),
    );
    const attackingPlayer = await prisma.player.findFirst({
      where: { discordId: msg.author.id, deletedAt: null },
    });
    if (!attackingPlayer) {
      msg.channel.send(`You're not in the game!`);
      return;
    }
    if (!attackingPlayer.xp) {
      msg.channel.send(`You have no doots!`);
      return;
    }
    // First check that the username is in the database
    const defendingPlayer = await prisma.player.findFirst({
      where: { username: defendingUsername, deletedAt: null },
    });
    if (!defendingPlayer) {
      msg.channel.send(`${defendingUsername} is not in the game!`);
      return;
    }
    // Then check that the damage is a) a number
    // and b) between 0 and the XP amount of the current player
    if (typeof parseInt(damage) !== `number`) {
      msg.channel.send(`${damage} is not a number!`);
      return;
    } else if (parseInt(damage) < 1 || parseInt(damage) > attackingPlayer?.xp) {
      msg.channel.send(
        `${damage} is not a valid doot number! Must be between 1 and ${attackingPlayer?.xp}`,
      );
      return;
    }
    // Then check that the player is not attacking themselves
    if (attackingPlayer.username === defendingPlayer.username) {
      msg.channel.send(`You can't doot yourself!`);
      return;
    }
    // Hope I didn't miss any conditions!
    // Now we can do the damage
    // Roll 2 dice, one for each player, based on their doot levels + bonus for the attacker's doots

    const attackerDice = getRandomArbitrary(1, 6);
    const defenderDice = getRandomArbitrary(1, 6);
    const attackerBonus =
      attackingPlayer.xp +
      getRandomArbitrary(1, Math.floor(attackingPlayer.xp / 10));
    const defenderBonus =
      attackingPlayer.xp +
      getRandomArbitrary(1, Math.floor(attackingPlayer.xp / 20));
    const attackerTotal = attackerDice + attackerBonus;
    const defenderTotal = defenderDice + defenderBonus;
    if (attackerTotal < defenderTotal) {
      msg.channel.send(
        `${defendingPlayer.username} successfully defended against ${attackingPlayer.username}'s doot!`,
      );
      await prisma.player.update({
        where: { discordId: attackingPlayer.discordId },
        data: {
          xp: attackingPlayer.xp - 1,
        },
      });
    } else {
      try {
        msg.channel.send(
          `${attackingPlayer.username} successfully attacked ${defendingPlayer.username}!`,
        );
        if (defendingPlayer.xp) {
          // Make sure that the defending player doesn't go below zero xp
          const isTooNegative = defendingPlayer.xp - parseInt(damage) < 0;
          if (isTooNegative) {
            await prisma.player.update({
              where: { discordId: defendingPlayer.discordId },
              data: {
                xp: 0,
              },
            });
            await prisma.player.update({
              where: { discordId: attackingPlayer.discordId },
              data: {
                xp: attackingPlayer.xp + parseInt(damage) + 5,
              },
            });
          } else {
            await prisma.player.update({
              where: { discordId: defendingPlayer.discordId },
              data: {
                xp: defendingPlayer?.xp - parseInt(damage),
              },
            });
            await prisma.player.update({
              where: { discordId: attackingPlayer.discordId },
              data: {
                xp: attackingPlayer.xp + parseInt(damage) + 5,
              },
            });
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(chalk.red(`Error updating player: `, error));
          msg.channel.send(`Failed to complete doot: `);
          msg.channel.send(error.toString());
        }
        console.log(chalk.red(`Error updating player: `, error));
      }
    }
  }

  if (msg.content === `!count`) {
    const currentPlayer = await prisma.player.findFirst({
      where: { discordId: msg.author.id, deletedAt: null },
    });
    if (!currentPlayer) {
      msg.channel.send(`You're not in the game!`);
      return;
    }
    if (!currentPlayer.xp) {
      msg.channel.send(`${currentPlayer.username} has no doots!`);
      return;
    }
    const dootCount = currentPlayer.xp;
    msg.channel.send(`${currentPlayer.username} has ${dootCount} doots!`);
  }

  if (msg.content.toLowerCase().startsWith(`!restore`)) {
    await prisma.player.update({
      where: { discordId: msg.author.id },
      data: {
        deletedAt: null,
        xp: 50,
      },
    });
    msg.channel.send(`Restored ${msg.author.username}!`);
  }

  if (msg.content.toLowerCase().startsWith(`!stats`)) {
    const player = await prisma.player.findFirst({
      where: { discordId: msg.author.id, deletedAt: null },
    });
    if (!player) {
      msg.channel.send(`You're not in the game!`);
      return;
    }
    const output = `
      Username:   ${player.username}
      Created At: ${player.createdAt}
      Updated At: ${player.updatedAt}
      Deleted At: ${player.deletedAt}
      Doots:      ${player.xp}
    `;
    msg.channel.send(output);
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
      msg.channel.send(
        `<@${whoHasTheBrainCell}> has the brain cell <:onebraincell:${BRAIN_CELL_ID}>`,
      );
    }

    // command to transfer the brain cell

    // for the future - this should be more like
    // "if the sender is trying to claim the brain cell, don't let them"
    if (msg.content.toLowerCase().includes(`!give`)) {
      switch (whoHasTheBrainCell) {
        case BRAIN_CELL_OWNERS[0]:
          if (msg.author.id !== BRAIN_CELL_OWNERS[1]) {
            whoHasTheBrainCell = BRAIN_CELL_OWNERS[1];
            msg.channel.send(
              `<@${whoHasTheBrainCell}> now has the brain cell <:onebraincell:${BRAIN_CELL_ID}>`,
            );
          } else {
            msg.reply(
              `You cannot take the brain cell, it must be given willingly`,
            );
          }
          break;
        case BRAIN_CELL_OWNERS[1]:
          if (msg.author.id !== BRAIN_CELL_OWNERS[0]) {
            whoHasTheBrainCell = BRAIN_CELL_OWNERS[0];
            msg.channel.send(
              `<@${whoHasTheBrainCell}> now has the brain cell <:onebraincell:${BRAIN_CELL_ID}>`,
            );
          } else {
            msg.reply(
              `You cannot take the brain cell, it must be given willingly`,
            );
          }
          break;
      }
    }
  }
  // wrap this all in a big IF that checks if the message is from herself
  // Also a section that limits certain commands to certain servers

  if (msg.author.id !== process.env.BOT_ID) {
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
    if (msg.content.toLowerCase().startsWith(`i think`)) {
      if (msg.content.toLowerCase() === `i think we all sing`) {
        msg.reply(
          `https://pbs.twimg.com/media/C-iOjtzUwAAHz9L?format=jpg&name=900x900`,
        );
        return;
      } else if (
        getRandomArbitrary(1, 100) > 80 &&
        msg.content.toLowerCase().length < 50
      ) {
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
  const player = await prisma.player.count();
  if (player === 0) {
    console.log(chalk.red(`No users seeded in db`));
    console.log(chalk.yellow(`Please run yarn seed`));
  }
  console.log(
    `Logged in as ${client?.user?.tag}!\n with ${player} Dootiverse player${
      player === 1 ? `` : `s`
    }`,
  );
  // set status
  client.user?.setActivity(`Victorious 24/7`, { type: `WATCHING` });
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN);
