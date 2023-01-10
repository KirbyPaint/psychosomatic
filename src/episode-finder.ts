import * as fs from "fs";
import path from "path";
import { getRandomArbitrary } from "./consts";

export function whichShow(): string {
  const tvDirectory = path.join(process.cwd(), `episodeList.txt`);
  const showArray = fs.readFileSync(tvDirectory).toString().split(`\n`);
  const show = showArray[Math.floor(getRandomArbitrary(0, showArray.length))];
  return show;
}

export function whichMovie(): string {
  const tvDirectory = path.join(process.cwd(), `movieList.txt`);
  const showArray = fs.readFileSync(tvDirectory).toString().split(`\n`);
  const show = showArray[Math.floor(getRandomArbitrary(0, showArray.length))];
  return show;
}
