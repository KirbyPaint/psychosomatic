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
exports.getWeather = void 0;
const axios_1 = __importDefault(require("axios"));
function getWeather(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield axios_1.default.get(url).then((response) => response.data);
        // TODO: localize this shit
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
    });
}
exports.getWeather = getWeather;
