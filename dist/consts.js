"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomArbitrary = exports.victoriaReactions = void 0;
exports.victoriaReactions = [
    `https://media.discordapp.net/attachments/799876599372840964/943669214189875220/victoria-justice-getty.png?width=686&height=686`,
    `https://media.discordapp.net/attachments/799876599372840964/943669337636622417/victoria-justice-new-song-treat-myself.png?width=585&height=686`,
    `https://media.discordapp.net/attachments/799876599372840964/943670277865357413/latest.png?width=532&height=686`,
    `https://media.discordapp.net/attachments/799876599372840964/943670518517735434/main-qimg-1b927c7d459676e4366aefee977a76ce-lq.png?width=457&height=686`,
    `https://media.discordapp.net/attachments/799876599372840964/943671162553106482/E8idJuXUUAIt-9K.png`,
];
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
exports.getRandomArbitrary = getRandomArbitrary;
