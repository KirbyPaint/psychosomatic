import axios from "axios";

export async function getWeather(url) {
  const data = await axios.get(url).then((response) => response.data);
  const sunrise = new Date(data.sys.sunrise * 1000);
  const sunset = new Date(data.sys.sunset * 1000);
  const easyString = `
    Weather for ${data.name}:
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
