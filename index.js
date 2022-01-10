import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import { getPussy } from "./gets/getPussy.js";
import { getWeather } from "./gets/openWeather.js";

dotenv.config();

//create new client
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("messageCreate", async (msg) => {
  if (msg.content.toLowerCase().includes("psychosomatic")) {
    msg.reply("THAT BOY NEEDS THERAPY");
  } else if (msg.content.toLowerCase() === "!kitty") {
    msg.reply(await getPussy());
  } else if (msg.content.toLowerCase().includes("!weatherboy")) {
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
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!\n`);
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN);
