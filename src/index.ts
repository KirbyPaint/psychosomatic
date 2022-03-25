import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import { getKitty } from "./gets/getKitty";
import { weatherboy } from "./gets/openWeather";
import { apod } from "./gets/APOD";
import { victoria } from "./reactions/victoria";
import {
  alanisReactions,
  BRAIN_CELL_ID,
  CONCH_ID,
  getRandomArbitrary,
  jpegReactions,
  MANIFEST_ID,
  victoriaReactions,
} from "./consts";
import { get8Ball } from "./gets/8ball";

dotenv.config();

//create new client
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

// this array has to stay in this file because otherwise it can't read the .env
// can probably move the config line but nah
const BRAIN_CELL_OWNERS = [process.env.MY_ID, process.env.HER_ID];
let whoHasTheBrainCell = BRAIN_CELL_OWNERS[0];

client.on("messageCreate", async (msg) => {
  // wrap this all in a big IF that checks if the message is from herself
  if (msg.author.id !== process.env.BOT_ID) {
    // PSYCHOSOMATIC
    if (msg.content.toLowerCase().includes("psychosomatic")) {
      msg.reply("THAT BOY NEEDS THERAPY");
    }

    // Cat pics API
    if (msg.content.toLowerCase() === "!kitty") {
      msg.reply(await getKitty());
    }

    // Weather API
    if (msg.content.toLowerCase().includes("!weatherboy")) {
      weatherboy(msg);
    }

    // APOD API
    if (msg.content.toLowerCase().includes("!apod")) {
      apod(msg);
    }

    // Manifest
    if (msg.content.toLowerCase().includes("manifest")) {
      msg.react(MANIFEST_ID);
    }

    // Conch
    if (msg.content.toLowerCase().includes("maybe someday")) {
      msg.react(CONCH_ID);
    }

    // Victoria Justice
    if (msg.content.toLowerCase().startsWith("i think")) {
      if (getRandomArbitrary(1, 100) > 80) {
        victoria(msg);
      }
    }

    if (msg.content.toLowerCase().includes("victoria")) {
      if (
        msg.content.toLowerCase().startsWith("victoria") &&
        msg.content.endsWith("?")
      ) {
        const victoriaJudgment = get8Ball();
        msg.reply(JSON.stringify(victoriaJudgment));
      }
      msg.channel.send(
        victoriaReactions[
          Math.floor(getRandomArbitrary(0, victoriaReactions.length))
        ].toString()
      );
    }

    if (msg.content.toLowerCase().includes("jenny")) {
      msg.react("8️⃣"); // it's seriously just the unicode emoji
      msg.react("6️⃣");
      msg.react("7️⃣");
      msg.react("5️⃣");
      msg.react("3️⃣");
      msg.react("0️⃣");
      msg.react("9️⃣");
    }
    // One brain cell
    // command to check the brain cell
    if (msg.content.toLowerCase().includes("who has the brain cell")) {
      msg.channel.send(
        `<@${whoHasTheBrainCell}> has the brain cell <:onebraincell:${BRAIN_CELL_ID}>`
      );
    }

    // command to transfer the brain cell

    // for the future - this should be more like
    // "if the sender is trying to claim the brain cell, don't let them"
    if (msg.content.toLowerCase().includes("!give")) {
      switch (whoHasTheBrainCell) {
        case BRAIN_CELL_OWNERS[0]:
          if (msg.author.id !== BRAIN_CELL_OWNERS[1]) {
            whoHasTheBrainCell = BRAIN_CELL_OWNERS[1];
            msg.channel.send(
              `<@${whoHasTheBrainCell}> now has the brain cell <:onebraincell:${BRAIN_CELL_ID}>`
            );
          } else {
            msg.reply(
              "You cannot take the brain cell, it must be given willingly"
            );
          }
          break;
        case BRAIN_CELL_OWNERS[1]:
          if (msg.author.id !== BRAIN_CELL_OWNERS[0]) {
            whoHasTheBrainCell = BRAIN_CELL_OWNERS[0];
            msg.channel.send(
              `<@${whoHasTheBrainCell}> now has the brain cell <:onebraincell:${BRAIN_CELL_ID}>`
            );
          } else {
            msg.reply(
              "You cannot take the brain cell, it must be given willingly"
            );
          }
          break;
      }
    }

    // Alanis
    if (
      msg.content.toLowerCase().includes("ironic") ||
      msg.content.toLowerCase().includes("alanis")
    ) {
      // 1/20 chance of Alanisposting
      if (getRandomArbitrary(1, 100) > 95) {
        msg.channel.send(
          `${
            alanisReactions[
              Math.round(getRandomArbitrary(0, alanisReactions.length - 1))
            ]
          }`
        );
      }
    }

    // do I look like I know what a jpeg is?
    if (
      msg.content.toLowerCase().includes("jpeg") &&
      !msg.content.toLowerCase().includes(".")
    ) {
      if (getRandomArbitrary(1, 100) > 80) {
        msg.channel.send(
          `${
            jpegReactions[
              Math.round(getRandomArbitrary(0, jpegReactions.length - 1))
            ]
          }`
        );
      }
    }

    if (msg.content.toLowerCase().includes("weep")) {
      msg.channel.send("*ouiiip");
    }

    // 2 Fast 2 Furious converter
    if (
      msg.content.toLowerCase().match(/(too)+ [a-zA-Z]+ (to?o)+ [a-zA-Z]+/i)
    ) {
      // need to split the sentence at the regex match actually
      // const messageArray = msg.content.split(" ");
      // console.log(
      //   `match: `,
      //   msg.content.match(/(too)+ [a-zA-Z]+ (to?o)+ [a-zA-Z]+/i)
      // );
      const wordsArray = msg.content.match(
        /(too)+ [a-zA-Z]+ (to?o)+ [a-zA-Z]+/i
      ); // this might be shit but it'll do the job
      if (wordsArray) {
        // console.log("wordsArray[0]", wordsArray[0]);
        const wordsArray2 = wordsArray[0].split(" ");
        // replace the items at index 0 and 2
        wordsArray2[0] = "2";
        wordsArray2[2] = "2";
        // join the array back together
        const newString = wordsArray2.join(" ");
        msg.channel.send(newString);
      }
    }
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client?.user?.tag}!\n`);
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN);
