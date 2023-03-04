import { Client, Intents, Message } from "discord.js";
import dotenv from "dotenv";
import { iThinkWeAll, vicPic, vicQuote } from "./reactions/victoria";
import {
  alanisReactions,
  CHANNEL_ID,
  cursedRegex,
  EMOJI_ID,
  fastNFuriousRegex,
  getRandomInt,
  help,
  jpegReactions,
  jpegRegex,
  naughtyWordReactions,
  SERVER_ID,
  weepRegex,
} from "./consts";
import { get8Ball } from "./gets/8ball";
import { PrismaClient } from "@prisma/client";
import {
  addToPlaylist,
  whichEpisode,
  whichMovie,
  whichPlaylist,
  whichShow,
} from "./episode-finder";
import { aiPrompt } from "./openai/openai";

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
  const currentGuildId = msg.guildId;

  // Bot echo command
  if (msg.content.toLowerCase().startsWith(`!vecho`)) {
    const [, ...rest] = msg.content.split(` `);
    const message = rest.join(` `);
    msg.channel.send(message);
  }

  // Processes to be used only for our special server
  if (currentGuildId === SERVER_ID.DUMMIES && !msg.author.bot) {
    if (msg.content.toLowerCase().match(cursedRegex)) {
      const randomNumber = getRandomInt(naughtyWordReactions.length);
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
          `<@${brainCell.discordId}> has the brain cell <:onebraincell:${EMOJI_ID.BRAIN_CELL}>`,
        );
      } else {
        // and ideally this NEVER happens
        msg.channel.send(
          `No one has the brain cell <:onebraincell:${EMOJI_ID.BRAIN_CELL}>`,
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
          `<@${newBrainCellOwner.discordId}> now has the brain cell <:onebraincell:${EMOJI_ID.BRAIN_CELL}>`,
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

  if (!msg.author.bot) {
    // PSYCHOSOMATIC
    if (msg.content.toLowerCase().includes(`psychosomatic`)) {
      msg.reply(`THAT BOY NEEDS THERAPY`);
    }

    // Manifest
    if (msg.content.toLowerCase().includes(`manifest`)) {
      msg.react(EMOJI_ID.MANIFEST);
    }

    // Conch
    if (msg.content.toLowerCase().includes(`maybe someday`)) {
      msg.react(EMOJI_ID.CONCH);
    }

    // Victoria Justice

    // EDGE CASES: "I think so?"
    if (
      msg.content.toLowerCase().startsWith(`i think`) &&
      msg.content.length >= 8 &&
      msg.content.length <= 50
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
      } else if (msg.content.toLowerCase().includes(`i love you`)) {
        msg.reply(`I love you too`);
      } else {
        // low chance of a random Victorious quote
        if (getRandomInt(100) >= 95) {
          msg.channel.send(vicQuote());
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
      msg.channel.id === CHANNEL_ID.BAJALANIS
    ) {
      // 1/20 chance of Alanisposting
      if (getRandomInt(100) >= 95) {
        msg.channel.send(
          `${alanisReactions[getRandomInt(alanisReactions.length)]}`,
        );
      }
    }

    // do I look like I know what a jpeg is?
    if (msg.content.toLowerCase().match(jpegRegex)) {
      if (getRandomInt(100) >= 85) {
        msg.channel.send(
          `${jpegReactions[getRandomInt(jpegReactions.length)]}`,
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
      msg.react(EMOJI_ID.SHEEV);
    }

    // Help
    if (msg.content.toLowerCase() === `!vhelp`) {
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

    // AI
    if (msg.content.toLowerCase().startsWith(`@tori`)) {
      const [, ...rest] = msg.content.split(` `);
      const prompt = rest.join(` `);
      msg.channel.send(await aiPrompt(prompt));
    }
  }
});

client.on(`ready`, async () => {
  // set bot status
  client.user?.setActivity(`DEBUGGING 24/7`, { type: 4 });
});

// make sure this line is the last line
client.login(process.env.CLIENT_TOKEN);
