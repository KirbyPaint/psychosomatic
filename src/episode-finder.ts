import * as fs from "fs";
import path from "path";
import { getRandomArbitrary } from "./consts";

export function whichEpisode(): string {
  const tvDirectory = path.join(process.cwd(), `episodeList.txt`);
  // console.log(tvDirectory);
  const array = fs.readFileSync(tvDirectory).toString().split(`\n`);
  for (const i in array) {
    console.log(array[i]);
    // return random element of array
    return array[getRandomArbitrary(0, array.length - 1)];
  }
  return ``;
}
