import { getPussy } from "./gets/getPussy.js";
import { Client, Intents } from "discord.js";
import dotenv from "dotenv";

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
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN);
