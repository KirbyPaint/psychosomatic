"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.victoria = void 0;
function victoria(msg) {
    var _a;
    const { content } = msg;
    const contentArray = content.split(" ");
    const [i, think, conditionWord, ...rest] = contentArray;
    // Thanks to grammar, I have to do work
    const modifySentenceStructureWords = [""];
    const leaveItWords = ["you", "me", "we", "they", "she", "he"];
    if (leaveItWords.includes(conditionWord)) {
        msg.reply(`I THINK WE ALL ${rest.join(" ").toUpperCase()}`);
    }
    else {
        msg.reply(`I THINK WE ALL THINK ${(_a = conditionWord === null || conditionWord === void 0 ? void 0 : conditionWord.toUpperCase()) !== null && _a !== void 0 ? _a : ""} ${rest
            .join(" ")
            .toUpperCase()}`);
    }
    msg.reply(`https://media.discordapp.net/attachments/799876599372840964/932822173872181278/image0-2.png`);
}
exports.victoria = victoria;
