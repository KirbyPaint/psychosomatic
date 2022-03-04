import axios from "axios";
import { Message } from "discord.js";
import * as fs from "fs";
import * as path from "path";

export async function apod(msg: Message) {
  const [, message] = msg.content.split(" ");
  const BASE_URL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.APOD_API_KEY}`;
  if (message) {
    if (!message.match(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)) {
      msg.reply("Please provide a date in YYYY-MM-DD format");
      return;
    }
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

async function getAPOD(url: string) {
  return await axios.get(url).then((response) => response.data);
}
