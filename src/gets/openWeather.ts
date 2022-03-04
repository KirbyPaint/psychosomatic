import axios from "axios";
import { Message } from "discord.js";

export async function weatherboy(msg: Message) {
  const [, message] = msg.content.split(" ");
  const [city, state, country] = message.split(",");
  if (city && state && country) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`;
    try {
      const response = await getWeather(url);
      if (response) {
        msg.reply(response);
      } else {
        msg.reply("API Request failed");
      }
    } catch (error) {
      msg.reply(error as string);
      throw error;
    }
  } else {
    msg.reply("Please provide a city, state, and country in CITY,ST,CN format");
  }
}

async function getWeather(url: string) {
  const data = await axios.get(url).then((response) => response.data);
  // TODO: localize this shit
  const sunrise = new Date(data.sys.sunrise * 1000);
  const sunset = new Date(data.sys.sunset * 1000);
  const easyString = `
    Weather for ${data.name}, COUNTRY:
    - Temperature: ${data.main.temp}
      -- Low: ${data.main.temp_min}
      -- High: ${data.main.temp_max}
    - Feels like: ${data.main.feels_like}
    - Wind speed: ${data.wind.speed}
    - Clouds: ${data.clouds.all}
    - Sunrise: ${sunrise}
    - Sunset: ${sunset}
  `;
  return easyString;
}
