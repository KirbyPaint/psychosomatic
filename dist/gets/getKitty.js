"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKitty = void 0;
const axios_1 = __importDefault(require("axios"));
const KITTY_URL = "https://aws.random.cat/meow"; // maybe I will add more :3 meow
function getKitty() {
    return axios_1.default.get(KITTY_URL).then((response) => response.data.file);
}
exports.getKitty = getKitty;
