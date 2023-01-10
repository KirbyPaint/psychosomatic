import * as fs from "fs";
import path from "path";
import { getRandomArbitrary } from "./consts";

export function whichEpisode(): string {
  const tvDirectory = path.join(process.cwd(), `episodeList.txt`);
  const array = fs.readFileSync(tvDirectory).toString().split(`\n`);
  for (const i in array) {
    const showArray = array[i];
    const show = showArray[getRandomArbitrary(0, showArray.length - 1)];
    console.log(`show: ${show}`);
    return show;
  }
  return `no empty messages`;
}