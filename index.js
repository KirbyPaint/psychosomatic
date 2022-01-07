require("dotenv").config(); //initialize dotenv
const { Client, Intents } = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
}); //create new client

client.on("messageCreate", (msg) => {
  if (msg.content.toLowerCase().includes("psychosomatic")) {
    msg.reply("THAT BOY NEEDS THERAPY");
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
