import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import { getPussy } from "./gets/getPussy.js";
import { getWeather } from "./gets/openWeather.js";
import { getAPOD } from "./gets/APOD.js";

dotenv.config();

//create new client
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

client.on("messageCreate", async (msg) => {
  // PSYCHOSOMATIC
  if (msg.content.toLowerCase().includes("psychosomatic")) {
    msg.reply("THAT BOY NEEDS THERAPY");
  }

  // Cat pics API
  if (msg.content.toLowerCase() === "!kitty") {
    msg.reply(await getPussy());
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

  if (msg.content.toLowerCase().includes("manifest")) {
    msg.react("769755766352642128");
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!\n`);
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN);
