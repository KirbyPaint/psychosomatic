import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import { getKitty } from "./gets/getKitty";
import { getWeather } from "./gets/openWeather";
import { getAPOD } from "./gets/APOD";
import { victoria } from "./reactions/victoria";

dotenv.config();

//create new client
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const MANIFEST_ID = "769755766352642128";

const BRAIN_CELL_OWNERS = [process.env.MY_ID, process.env.HER_ID];
const BRAIN_CELL_ID = "936895162074951730"; // custom emoji
let whoHasTheBrainCell = BRAIN_CELL_OWNERS[0];

client.on("messageCreate", async (msg) => {
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
    const [, message] = msg.content.split(" ");
    const [city, state, country] = message.split(",");
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`;
    const response = await getWeather(url);
    if (response) {
      msg.reply(response);
    } else {
      msg.reply("Request failed");
    }
  }

  // APOD API
  if (msg.content.toLowerCase().includes("!apod")) {
    const [, message] = msg.content.split(" ");
    const BASE_URL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.APOD_API_KEY}`;
    // Assume date only for now
    if (message) {
      const data = await getAPOD(`${BASE_URL}&date=${message}`);
      const easyString = `
        Date: ${data.date}
        Title: ${data.title}
        Explanation: ${data.explanation}
      `;
      msg.reply(data.url);
      msg.reply(easyString);
    } else {
      // No date, use today
      const data = await getAPOD(`${BASE_URL}`);
      const easyString = `
        Date: ${data.date}
        Title: ${data.title}
        Explanation: ${data.explanation}
      `;
      msg.reply(data.url);
      msg.reply(easyString);
    }
  }

  // Manifest
  if (msg.content.toLowerCase().includes("manifest")) {
    msg.react(MANIFEST_ID);
  }

  // Victoria Justice
  if (
    msg.content.toLowerCase().startsWith("i think") &&
    msg.author.id !== process.env.BOT_ID
  ) {
    victoria(msg);
  }

  // One brain cell
  // command to check the brain cell
  if (msg.content.toLowerCase().includes("who has the brain cell")) {
    msg.channel.send(
      `<@${whoHasTheBrainCell}> has the brain cell <:onebraincell:${BRAIN_CELL_ID}>`
    );
  }

  // command to transfer the brain cell
  if (msg.content.toLowerCase().includes("!give the brain cell")) {
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
});

client.on("ready", () => {
  console.log(`Logged in as ${client?.user?.tag}!\n`);
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN);
