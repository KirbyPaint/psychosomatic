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
  fastNFuriousRegex,
  getRandomArbitrary,
  help,
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
import {
  addToPlaylist,
  whichEpisode,
  whichMovie,
  whichPlaylist,
  whichShow,
} from "./episode-finder";
import { Configuration, OpenAIApi } from "openai";

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

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// actions to take when the bot receives a message
client.on(`messageCreate`, async (msg: Message) => {
  const currentGuildId = msg.guildId;

  // Bot echo command
  if (msg.content.startsWith(`!vecho`)) {
    const [, ...rest] = msg.content.split(` `);
    const message = rest.join(` `);
    msg.channel.send(message);
  }

  // Processes to be used only for our special server
  if (currentGuildId === process.env.DUMMIES && !msg.author.bot) {
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

  if (!msg.author.bot) {
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

    if (msg.content.startsWith(`@Tori`)) {
      const [, ...rest] = msg.content.split(` `);
      const prompt = rest.join(` `);
      try {
        const completion = await openai.createCompletion({
          model: `text-davinci-001`,
          prompt,
          temperature: 0.6,
          max_tokens: 100,
        });
        msg.channel.send(
          completion?.data?.choices[0]?.text || `Something went awry`,
        );
      } catch (error) {
        console.log(chalk.red(`OpenAI Error:`));
        console.log(chalk.red(error));
        msg.channel.send(JSON.stringify(error));
      }
    }
  }
});

client.on(`ready`, async () => {
  // set bot status
  client.user?.setActivity(`DEBUGGING 24/7`, { type: 4 });
});

// make sure this line is the last line
client.login(process.env.CLIENT_TOKEN);
