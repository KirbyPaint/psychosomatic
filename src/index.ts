import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import { Attachment, Client, GatewayIntentBits, Message } from "discord.js";
import dotenv from "dotenv";

import { ls } from "./bash/list_directory";
import { shutdown } from "./bash/shutdown";
import {
	alanisReactions,
	BRAINCELL_USER_ID,
	breadRegex,
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
	shuffleArray,
	tooFastToFurious,
	uwuRegex,
	weepRegex,
	whichRegex,
} from "./consts/consts";
import { iThinkWeAll, vicQuote } from "./consts/victoria";
import { get8Ball } from "./functions/8ball";
import { addToPlaylist, media } from "./functions/episode-finder";
import { addVicPic, vicPic } from "./functions/vicpic-finder";

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
	const isBot = msg.author.bot;
	const { attachments, channel, content, guildId: currentGuildId } = msg;
	const message = content.toLowerCase();
	if (isDev) {
		console.log(chalk.cyan(`\n\n\nMessage received:`));
		console.log(msg);
	}

	// everything in a !isBot block first of all
	if (!isBot) {
		// Help
		if (message === `!vhelp`) {
			channel.send(help());
		}

		// Bot echo command
		if (message.startsWith(`!vecho`)) {
			const [, ...rest] = content.split(` `);
			channel.send(rest.join(` `));
		}

		// fuck anyone
		if (message.startsWith(`fuck`)) {
			channel.send(`yeah, ${message}`);
		}

		// fmk
		if (message.startsWith(`fmk`)) {
			const [, f, m, k] = message.split(`\n`);
			if (!f || !m || !k) {
				return;
			} else {
				const [nf, nm, nk] = shuffleArray([f, m, k]);
				channel.send(`fuck ${nf}, marry ${nm}, kill ${nk}`);
			}
		}

		// PSYCHOSOMATIC
		if (message.includes(`psychosomatic`) && !message.includes(`github`)) {
			msg.reply(`THAT BOY NEEDS THERAPY`);
		}

		// APPLE BUTTER CRISP
		if (message.includes(`coffee`)) {
			if (getRandomInt(100) >= 95) {
				msg.reply(`APPLE BUTTER CRISP`);
			}
		}

		// Richard you good boy
		if (message.includes(`good noodle`)) {
			channel.send(`Richard, you good boy`);
		}

		// presentation
		if (message.match(breadRegex)) {
			channel.send(`bready or not here I come`);
		}

		if (message.includes(`jenny`)) {
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
			message.includes(`ironic`) ||
			message.includes(`alanis`)
		) {
			// 1/20 chance of Alanisposting
			if (getRandomInt(100) >= 95) {
				channel.send(alanisReactions[getRandomInt(alanisReactions.length)]);
			}
		}

		// Shia Surprise
		if (message.includes(`shia labeouf`)) {
			channel.send(`https://youtu.be/o0u4M6vppCI`);
		}

		// Bob's Burgers
		if (message.includes(`burgerboss`)) {
			channel.send(
				`https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRShYgX1IfRVVqMr55MsAVZ3mdeD8LHYS9eAUUyZ4ygpQONDlPR`,
			);
		}

		if (message.includes(`noncanonical`)) {
			channel.send(`https://youtu.be/GoAPSBMQEKU`);
		}

		// Manifest
		if (message.includes(`manifest`)) {
			msg.react(EMOJI_ID.MANIFEST);
		}

		// Garnet
		if (message.includes(`garnet`)) {
			msg.react(EMOJI_ID.GARNET);
		}

		// Conch
		if (message.includes(`maybe someday`)) {
			msg.react(EMOJI_ID.CONCH);
		}

		// DO IT
		if (message.includes(`do it`)) {
			msg.react(EMOJI_ID.SHEEV);
		}

		// forgor
		if (message.includes(`forgor`)) {
			msg.react(`💀`);
		}
		
		// vsc*de
		if (message.includes(`vscode`) || message.includes(`vs code`)) {
			if (getRandomInt(10) == 10) {
				msg.react(`🤮`);
				msg.reply(`eww vsc*de`);
			}
		}

		// WEBP
		if (attachments) {
			const attachmentArray: Attachment[] = Array.from(attachments.values());
			let webp = false;
			attachmentArray.forEach(attachment => {
				const { name, url, proxyURL, contentType } = attachment;
				if (name.toLowerCase().includes(`webp`) ||
					url.toLowerCase().includes(`webp`) ||
					proxyURL.toLowerCase().includes(`webp`) ||
					contentType?.toLowerCase().includes(`webp`)) {
					webp = true;
				}
			});
			if (webp && getRandomInt(100) >= 95) {
				channel.send(`webp image detected`);
			}
		}

		// Victoria Justice
		if (
			message.startsWith(`i think`) &&
			content.length >= 15 &&
			content.length <= 30
		) {
			if (message.includes(`i think we all sing`)) {
				channel.send(
					`https://pbs.twimg.com/media/C-iOjtzUwAAHz9L?format=jpg&name=900x900`,
				);
				return;
			}
			channel.send(iThinkWeAll(content));
			channel.send(vicPic());
			return;
		}

		// any command having to do with addressing the bot by name
		if (message.includes(`victoria`)) {
			if (
				(message.startsWith(`victoria`) &&
					content.includes(`?`)) ||
				(message.startsWith(`hey victoria`) &&
					content.includes(`?`))
			) {
				// ask her a question
				msg.reply(JSON.stringify(get8Ball()));
			} else if (message.includes(`i love you`)) {
				msg.reply(`I love you too`);
			} else {
				// low chance of a random Victorious quote
				if (getRandomInt(100) >= 95) {
					channel.send(vicQuote());
				}
			}
			channel.send(vicPic());
		}

		if (message.startsWith(`!vicpic`)) {
			const [, ...rest] = content.split(` `);
			channel.send(addVicPic(rest[0]));
		}

		if (content.includes(`Toro`)) {
			channel.send(`Did you just call me Toro?`);
		}

		// do I look like I know what a jpeg is?
		if (message.match(jpegRegex)) {
			if (getRandomInt(100) >= 85) {
				channel.send(jpegReactions[getRandomInt(jpegReactions.length)]);
			}
		}

		// 2 Fast 2 Furious converter
		if (message.match(fastNFuriousRegex)) {
			const wordsArray = content.match(fastNFuriousRegex);
			if (wordsArray) {
				channel.send(tooFastToFurious(wordsArray[0]));
			}
		}

		// OWO
		if (message.match(uwuRegex)) {
			const promptArray = content.split(` `);
			if (promptArray.length < 2) {
				return;
			}
			if (promptArray[0].toLowerCase() === `uwu` || promptArray[0].toLowerCase() === `owo`) {
				promptArray.shift();
			}
			if (promptArray[promptArray.length - 1].toLowerCase() === `uwu` || promptArray[promptArray.length - 1].toLowerCase() === `owo`) {
				promptArray.pop();
			}
			const prompt = promptArray.join(` `);
			channel.send(prompt.replace(/r/g, `w`).replace(/l/g, `w`).replace(/R/g, `W`).replace(/L/g, `W`));
		}

		// Chabi sad face
		if (currentGuildId !== SERVER_ID.CHILLBROS) {
			if (message.match(sadRegex) || message.startsWith(`:(`)) {
				msg.react(EMOJI_ID.SAD);
			}
		}

		// Processes to be used only for our special server
		if (
			(currentGuildId === SERVER_ID.DUMMIES) ||
			(isDev)
		) {
			if (msg) {
				if (getRandomInt(10000) >= 9995) {
					msg.reply(`Christ, what an asshole`);
				}
			}

			if (message.match(cursedRegex)) {
				channel.send(naughtyWordReactions[getRandomInt(naughtyWordReactions.length)]);
			}

			// Delphine
			if (message.match(weepRegex)) {
				channel.send(`*ouiiip`);
			}

			// Millennial Message Detection
			if (message.includes(`lol`) || message.includes(`haha`) || message.includes(`yeah`)) {
				if (getRandomInt(30) >= 29) {
					const wordArray = message.split(` `);
					const lastWord = wordArray[wordArray.length - 1];
					if (lastWord === `lol` || lastWord.includes(`haha`) || lastWord === `yeah`) {
						msg.reply(`# ${lastWord}`)
					}
				}
			}

			// fuck audrey
			if (message.includes(`audrey`)) {
				channel.send(`fuck Audrey`);
			}

			// bash ls command (example, not used for anything currently)
			if (message === `ls`) {
				const result = await ls();
				channel.send(result);
			}

			// Does what it says, very scary
			// if (message === `server shutdown` || message === `server reboot`) {
			// 	const result = await shutdown();
			// 	channel.send(result);
			// }

			// Marcel the Shell
			if (message.includes(`too big`)) {
				channel.send(`Compared to what?`);
			}
			if (message.includes(`marcel`)) {
				channel.send(`Let the battle begin.`);
			}

			// sad
			// if (message.match(sadRegex) || message.startsWith(`:(`)) {
			// 	msg.react(EMOJI_ID.SAD);
			// }

			// One brain cell
			// command to check the brain cell
			if (message.includes(`who has the brain cell`)) {
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
					channel.send(
						`<@${brainCell.discordId}> has the brain cell <:onebraincell:${EMOJI_ID.BRAIN_CELL}>`,
					);
				} else {
					// and ideally this NEVER happens
					channel.send(
						`No one has the brain cell <:onebraincell:${EMOJI_ID.BRAIN_CELL}>`,
					);
				}
			}

			// TV finder
			if (content.match(whichRegex)) {
				const [firstWord, secondWord] = content.split(` `);
				if (firstWord.match(whichRegex)) {
					const result = media(secondWord);
					if (result.length < 1) {
						return;
					}
					channel.send(media(secondWord));
				}
			}
			if (message.startsWith(`!addplaylist`)) {
				const [, ...rest] = content.split(` `);
				channel.send(addToPlaylist(rest.join(` `)));
			}

			if (message.includes(`!give`)) {
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
					channel.send(
						`<@${result.filter((owner) => owner.hasBrainCell)[0].discordId}> now has the brain cell <:onebraincell:${EMOJI_ID.BRAIN_CELL}>`,
					);
					return;
				} else {
					channel.send(
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
