import { Message } from "discord.js";

export function victoria(msg: Message) {
  const { content } = msg;
  const contentArray: Array<string> = content.split(" ");
  const [i, think, conditionWord, ...rest] = contentArray;
  // Thanks to grammar, I have to do work
  const modifySentenceStructureWords = ["i'm", "i've", "i'll", "i'd", "you're"]; // this is gonna be R O U G H to finalize so i will simply not
  // console.log(`sentence:
  //   ${i}
  //   ${think}
  //   ${conditionWord}
  //   ${rest}

  //   sentence contains modifier word: ${modifySentenceStructureWords.includes(
  //     conditionWord.toLowerCase()
  //   )}
  // `);
  if (modifySentenceStructureWords.includes(conditionWord.toLowerCase())) {
    msg.reply(`I THINK WE'RE ALL ${rest.join(" ").toUpperCase()}`);
  } else {
    msg.reply(
      `I THINK WE ALL THINK ${conditionWord.toUpperCase()} ${rest
        .join(" ")
        .toUpperCase()}`
    );
  }
  msg.reply(
    `https://media.discordapp.net/attachments/799876599372840964/932822173872181278/image0-2.png`
  );
}
