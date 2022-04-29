import { Message } from "discord.js";
import { victoriaReactions, getRandomArbitrary } from "../consts";
import { toriQuotes } from "../gets/toriQuotes";

export function iThinkWeAll(msg: string) {
  // const { content } = msg;
  const contentArray: Array<string> = msg.split(" ");
  const [i, think, conditionWord, ...rest] = contentArray;
  // Thanks to grammar, I have to do work
  const modifySentenceStructureWords = [
    "i'd",
    "i've",
    "you're",
    "you'd",
    "i'm",
  ]; // this is gonna be R O U G H to finalize so i will simply not
  const wordsThatNeedNotBeInThePhrase = [
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
  ];
  // console.log(`sentence:
  //   ${i}
  //   ${think}
  //   ${conditionWord}
  //   ${rest}

  //   sentence contains modifier word: ${modifySentenceStructureWords.includes(
  //     conditionWord.toLowerCase()
  //   )}
  // `);
  if (msg.toLowerCase().includes(`we all`)) {
    return `I THINK WE ${rest.join(" ").toUpperCase()}`;
    // msg.reply(`I THINK WE ${rest.join(" ").toUpperCase()}`);
  } else if (
    wordsThatNeedNotBeInThePhrase.includes(conditionWord.toLowerCase())
  ) {
    return `I THINK WE ALL ${rest.join(" ").toUpperCase()}`;
    // msg.reply(`I THINK WE ALL ${rest.join(" ").toUpperCase()}`);
  } else if (
    modifySentenceStructureWords.includes(conditionWord.toLowerCase())
  ) {
    return `I THINK WE'RE ALL ${rest.join(" ").toUpperCase()}`;
    // msg.reply(`I THINK WE'RE ALL ${rest.join(" ").toUpperCase()}`);
  } else {
    return `I THINK WE ALL ${conditionWord.toUpperCase()} ${rest
      .join(" ")
      .toUpperCase()}`;
    // msg.reply(
    //   `I THINK WE ALL ${conditionWord.toUpperCase()} ${rest
    //     .join(" ")
    //     .toUpperCase()}`
    // );
    // no early return anywhere else or she won't send the vic pic
    // return;
  }
  // msg.reply(
  //   `https://media.discordapp.net/attachments/799876599372840964/932822173872181278/image0-2.png`
  // );
}

export function vicPic() {
  return victoriaReactions[
    Math.floor(getRandomArbitrary(0, victoriaReactions.length))
  ].toString();
}

export function vicQuote(msg: Message) {
  msg.channel.send(
    toriQuotes[Math.floor(getRandomArbitrary(0, toriQuotes.length))].toString()
  );
}
