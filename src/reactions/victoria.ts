import { Message } from "discord.js";

export function victoria(msg: Message) {
  const { content } = msg;
  const contentArray: Array<string> = content.split(" ");
  const [i, think, conditionWord, ...rest] = contentArray;
  // Thanks to grammar, I have to do work
  const modifySentenceStructureWords = [""];
  const leaveItWords = ["you", "me", "we", "they", "she", "he"];
  console.log("i", i);
  console.log("think", think);
  console.log("conditionWord", conditionWord);
  console.log(leaveItWords.includes(conditionWord));
  if (leaveItWords.includes(conditionWord)) {
    msg.reply(`DEBUG CONDITION 1 MET: ${conditionWord}`);
    msg.reply(`I THINK WE ALL ${rest.join(" ").toUpperCase()}`);
  } else {
    msg.reply(
      `I THINK WE ALL THINK ${conditionWord} ${rest.join(" ").toUpperCase()}`
    );
  }
  msg.reply(
    `https://media.discordapp.net/attachments/799876599372840964/932822173872181278/image0-2.png`
  );
}
