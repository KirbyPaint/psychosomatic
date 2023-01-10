import * as fs from "fs";
import path from "path";
import { getRandomArbitrary } from "./consts";

export function whichShow(): string {
  const tvDirectory = path.join(process.cwd(), `episodeList.txt`);
  const showArray = fs.readFileSync(tvDirectory).toString().split(`\n`);
  const show = showArray[Math.floor(getRandomArbitrary(2, showArray.length))];
  return show;
}
