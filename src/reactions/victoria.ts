import { Message } from "discord.js";
import { victoriaReactions, getRandomArbitrary } from "../consts";
import { toriQuotes } from "../gets/toriQuotes";

export function iThinkWeAll(msg: string) {
  // const { content } = msg;
  const contentArray: Array<string> = msg.split(" ");
  const [i, think, conditionWord, ...rest] = contentArray;
  // Thanks to grammar, I have to do work
  const wouldCouldShouldHad = [
    `i'd`,
    `you'd`,
    `we'd`,
    `they'd`,
    `he'd`,
    `she'd`,
  ];
  const have = [`i've`, `you've`, `we've`, `they've`];
  const areWere = [`i'm`, `you're`, `we're`, `they're`];
  // The i'd and you'd need to be separate from the we've and the we're, etc.
  const wordsThatNeedNotBeInThePhrase = [
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
  ];

  if (msg.toLowerCase().includes(`we all`)) {
    return `I THINK WE ${rest.join(" ").toUpperCase()}`;
  } else if (
    wordsThatNeedNotBeInThePhrase.includes(conditionWord.toLowerCase())
  ) {
    return `I THINK WE ALL ${rest.join(" ").toUpperCase()}`;
  } else if (areWere.includes(conditionWord.toLowerCase())) {
    return `I THINK WE'RE ALL ${rest.join(" ").toUpperCase()}`;
  } else if (wouldCouldShouldHad.includes(conditionWord.toLowerCase())) {
    return `I THINK WE'D ALL ${rest.join(" ").toUpperCase()}`;
  } else if (have.includes(conditionWord.toLowerCase())) {
    return `I THINK WE'VE ALL ${rest.join(" ").toUpperCase()}`;
  } else {
    return `I THINK WE ALL ${conditionWord.toUpperCase()} ${rest
      .join(" ")
      .toUpperCase()}`;
  }
}

export function vicPic() {
  return victoriaReactions[
    Math.floor(getRandomArbitrary(0, victoriaReactions.length))
  ].toString();
}

export function vicQuote() {
  return toriQuotes[
    Math.floor(getRandomArbitrary(0, toriQuotes.length))
  ].toString();
}
