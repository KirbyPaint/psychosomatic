import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import { Attachment, Client, GatewayIntentBits, Message } from "discord.js";
import dotenv from "dotenv";

import { ls } from "./bash/list_directory";
import { shutdown } from "./bash/shutdown";
import { get8Ball } from "./gets/8ball";
import { aiPrompt } from "./openai/openai";
import { iThinkWeAll, vicQuote } from "./reactions/victoria";
import {
  alanisReactions,
  BRAINCELL_USER_ID,
  cursedRegex,
  EMOJI_ID,
  fastNFuriousRegex,
  getRandomInt,
  help,
  jpegReactions,
  jpegRegex,
  naughtyWordReactions,
  sadRegex,
  SERVER_ID,
  tooFastToFurious,
  uwuRegex,
  weepRegex,
  whichRegex,
} from "./consts";
import { addToPlaylist, media } from "./episode-finder";
import { add_vicpic, read_vicpic_list } from "./vicpic-finder";

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
// Need a function to turn the GatewayIntentBits into a number array

const DISALLOWED_INTENTS = [2, 256];
const intentBitsArray: number[] = Array.from(new Set(Object.values(GatewayIntentBits).filter(
  (value) => typeof value === `number`
).map(value => Number(value))));
const intents = intentBitsArray.filter(
  (intent) => !DISALLOWED_INTENTS.includes(intent),
);
const client: Client = new Client({
  intents,
});

const isDev = process.env.BOT_ENV === `dev`;
// actions to take when the bot receives a message
client.on(`messageCreate`, async (msg: Message) => {
    const currentGuildId = msg.guildId;
    const isBot = msg.author.bot;
		const {attachments} = msg;
		if (isDev) {
			console.log(chalk.cyan(`\n\n\nMessage received:`));
			console.log(msg);
		}
  
    // everything in a !isBot block first of all
    if (!isBot) {
      // Bot echo command
      if (msg.content.toLowerCase().startsWith(`!vecho`)) {
        const [, ...rest] = msg.content.split(` `);
        msg.channel.send(rest.join(` `));
      }
  
      // PSYCHOSOMATIC
      if (msg.content.toLowerCase().includes(`psychosomatic`)) {
        msg.reply(`THAT BOY NEEDS THERAPY`);
      }
      
      // APPLE BUTTER CRISP
      if (msg.content.toLowerCase().includes(`coffee`)) {
        if (getRandomInt(100) >= 95) {
            msg.reply(`APPLE BUTTER CRISP`);
          }
      }
      
      // Manifest
      if (msg.content.toLowerCase().includes(`manifest`)) {
        msg.react(EMOJI_ID.MANIFEST);
      }
  
      // Conch
      if (msg.content.toLowerCase().includes(`maybe someday`)) {
        msg.react(EMOJI_ID.CONCH);
      }
 
      // WEBP
      // NOTE TO FUTURE ASH: fix tabs vs spaces difference in code
      // Shows in nvim, not VSCode
      // nvim treating a tab as 8 spaces fyi
			if (attachments) {
				const attachmentArray: Attachment[] = Array.from(attachments.values());
				let webp = false;
				attachmentArray.forEach(attachment => {
					const {name, url, proxyURL, contentType} = attachment;
					if (name.toLowerCase().includes(`webp`) || url.toLowerCase().includes(`webp`) || proxyURL.toLowerCase().includes(`webp`) || contentType?.toLowerCase().includes(`webp`)) {
						webp = true;
					}
				});

				if (webp && getRandomInt(100) >= 95) {
					msg.channel.send(`webp image detected`);
				}
			}
  
      // Victoria Justice
      if (
        msg.content.toLowerCase().startsWith(`i think`) &&
        msg.content.length >= 15 &&
        msg.content.length <= 30
      ) {
        if (msg.content.toLowerCase().includes(`i think we all sing`)) {
          msg.channel.send(
            `https://pbs.twimg.com/media/C-iOjtzUwAAHz9L?format=jpg&name=900x900`,
          );
          return;
        }
        msg.channel.send(iThinkWeAll(msg.content));
        msg.channel.send(read_vicpic_list());
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
        msg.channel.send(read_vicpic_list());
      }

			if (isDev && msg.content.toLowerCase().includes(`secret`)) {
				msg.channel.send(read_vicpic_list());
			}

			if (msg.content.toLowerCase().startsWith(`!vicpic`)) {
				const [, ...rest] = msg.content.split(` `);
				msg.channel.send(add_vicpic(rest[0]));
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
          msg.channel.send(tooFastToFurious(wordsArray[0]));
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
  
      // OWO
      if (msg.content.toLowerCase().match(uwuRegex)) {
				const promptArray = msg.content.split(` `);
				if (promptArray[0].toLowerCase() === `uwu` || promptArray[0].toLowerCase() === `owo`) {
					promptArray.shift();
				}
				if (promptArray[promptArray.length - 1].toLowerCase() === `uwu` || promptArray[promptArray.length - 1].toLowerCase() === `owo`) {
					promptArray.pop();
				}
        const prompt = promptArray.join(` `);
        msg.channel.send(prompt.replace(/r/g, `w`).replace(/l/g, `w`).replace(/R/g, `W`).replace(/L/g, `W`));
      }

      // Processes to be used only for our special server
      if (
        (currentGuildId === SERVER_ID.DUMMIES) ||
        (isDev)
      ) {
        if (msg.content.toLowerCase().match(cursedRegex)) {
          msg.channel.send(
            `${naughtyWordReactions[getRandomInt(naughtyWordReactions.length)]}`,
          );
        }
  
				// Delphine
				if (msg.content.toLowerCase().match(weepRegex)) {
					msg.channel.send(`*ouiiip`);
				}

				// fuck audrey
				if (msg.content.toLowerCase().includes(`audrey`)) {
					msg.channel.send(`fuck Audrey`);
				}

				// bash ls command (example, not used for anything currently)
				if (msg.content.toLowerCase() === `ls`) {
					const result = await ls();
					msg.channel.send(result);
				}
  
				// Does what it says, very scary
        if (msg.content.toLowerCase() === `server shutdown` || msg.content.toLowerCase() === `server reboot`) {
          const result = await shutdown();
          msg.channel.send(result);
        }
  
        // Marcel the Shell
        if (msg.content.toLowerCase().includes(`too big`)) {
          msg.channel.send(`Compared to what?`);
        }
        if (msg.content.toLowerCase().includes(`marcel`)) {
          msg.channel.send(`Let the battle begin.`);
        }

				// sad
				if (msg.content.toLowerCase().match(sadRegex) || msg.content.toLowerCase().startsWith(`:(`)) {
				msg.react(EMOJI_ID.SAD);	
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
  
        // TV finder
        if (msg.content.match(whichRegex)) {
          const [firstWord, secondWord] = msg.content.split(` `);
          if (firstWord.match(whichRegex)) {
            const result = media(secondWord);
            if (result.length < 1) {
              return;
            }
            msg.channel.send(media(secondWord));
          }
        }
        if (msg.content.toLowerCase().startsWith(`!addplaylist`)) {
          const [, ...rest] = msg.content.split(` `);
          msg.channel.send(addToPlaylist(rest.join(` `)));
        }
  
        if (msg.content.toLowerCase().includes(`!give`)) {
          const discordId = msg.author.id;
          const brainCellOwner = await prisma.braincell.findFirst({
            where: { discordId },
          });
          if (brainCellOwner?.hasBrainCell) {
            const result = await prisma.$transaction([
              prisma.braincell.update({
                where: { discordId },
                data: {
                  hasBrainCell: false,
                },
              }),
              prisma.braincell.update({
                where: {
                  discordId: Object.values(BRAINCELL_USER_ID).find(
                    (id) => id !== discordId,
                  ),
                },
                data: {
                  hasBrainCell: true,
                },
              }),
            ]);
            msg.channel.send(
              `<@${result.filter((owner) => owner.hasBrainCell)[0].discordId
              }> now has the brain cell <:onebraincell:${EMOJI_ID.BRAIN_CELL}>`,
            );
            return;
          } else {
            msg.channel.send(
              `You cannot steal the brain cell, it must be given willingly.`
            );
          }
        }
      }
    }
  
  });
  
  client.on(`ready`, async () => {
    // set bot status
    const activity = process.env.BOT_ENV === `dev` ? `DEBUGGING` : `Victorious 24/7`;
    client.user?.setActivity(activity, { type: 3 });
  });


// make sure this line is the last line
client.login(process.env.CLIENT_TOKEN);
