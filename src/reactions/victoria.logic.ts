// Purpose of this file is to change how the logic is handled
// Instead of passing in a message object, it will take only the message content
// This way, Jest can test the responses without me having to do work

import { getRandomArbitrary, naughtyWordReactions } from "../consts";
import { iThinkWeAll, vicPic } from "./victoria";

export function vicLogic(message: string) {
  // Need to load in all the cases that Victoria might respond to
  // with no functionality right now

  // Foot react
  if (message.toLowerCase().match(/\bfoot\b|\bfeet\b/)) {
    if (!message.toLowerCase().includes("victoria")) {
      const randomNumber = getRandomArbitrary(0, naughtyWordReactions.length);
      return `${naughtyWordReactions[Math.floor(randomNumber)]}`;
    } else {
      return vicPic();
    }
  }

  // I Think We All Sing
  // if (message.toLowerCase().startsWith("i think")) {
  //   // If you say the whole phrase
  //   if (message.toLowerCase() === "i think we all sing") {
  //   } else {
  //     // ITWAS logic here, this is the current victoria() function
  //     // returns a string, which we will use to reply
  //     iThinkWeAll(message);
  //   }
  // }
}
