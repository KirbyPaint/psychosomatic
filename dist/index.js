"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const getKitty_1 = require("./gets/getKitty");
const openWeather_1 = require("./gets/openWeather");
const APOD_1 = require("./gets/APOD");
dotenv_1.default.config();
//create new client
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});
client.on("messageCreate", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    // PSYCHOSOMATIC
    if (msg.content.toLowerCase().includes("psychosomatic")) {
        msg.reply("THAT BOY NEEDS THERAPY");
    }
    // Cat pics API
    if (msg.content.toLowerCase() === "!kitty") {
        msg.reply(yield (0, getKitty_1.getKitty)());
    }
    // Weather API
    if (msg.content.toLowerCase().includes("!weatherboy")) {
        const [, message] = msg.content.split(" ");
        const [city, state, country] = message.split(",");
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`;
        const response = yield (0, openWeather_1.getWeather)(url);
        if (response) {
            msg.reply(response);
        }
        else {
            msg.reply("Request failed");
        }
    }
    // APOD API
    if (msg.content.toLowerCase().includes("!apod")) {
        const [, message] = msg.content.split(" ");
        const BASE_URL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.APOD_API_KEY}`;
        // Assume date only for now
        if (message) {
            const data = yield (0, APOD_1.getAPOD)(`${BASE_URL}&date=${message}`);
            const easyString = `
        Date: ${data.date}
        Title: ${data.title}
        Explanation: ${data.explanation}
      `;
            msg.reply(data.url);
            msg.reply(easyString);
        }
        else {
            // No date, use today
            const data = yield (0, APOD_1.getAPOD)(`${BASE_URL}`);
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
        msg.react("769755766352642128");
    }
    // Victoria Justice
    if (msg.content.toLowerCase().startsWith("i think") &&
        msg.author.id !== process.env.BOT_ID) {
        const { content } = msg;
        const contentArray = content.split(" ");
        const [, , , ...rest] = contentArray;
        msg.reply(`I THINK WE ALL ${rest.join(" ").toUpperCase()}`);
        msg.reply(`https://media.discordapp.net/attachments/799876599372840964/932822173872181278/image0-2.png`);
    }
}));
client.on("ready", () => {
    var _a;
    console.log(`Logged in as ${(_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.tag}!\n`);
});
//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN);
