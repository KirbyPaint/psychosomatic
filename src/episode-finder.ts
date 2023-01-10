import * as fs from "fs";
import path from "path";
import { getRandomArbitrary } from "./consts";

export function whichEpisode(): string {
  const tvDirectory = path.join(process.cwd(), `episodeList.txt`);
  const showArray = fs.readFileSync(tvDirectory).toString().split(`\n`);
  console.log(showArray);
  const showToWatch = Math.floor(getRandomArbitrary(2, showArray.length));
  console.log({ showToWatch });
  console.log(`showArray[showToWatch]: ${showArray[showToWatch]}`);
  console.log(showArray[getRandomArbitrary(2, showArray.length - 1)]);
  // for (const i in array) {
  // const showArray = array[i];
  // console.log({ showArray });
  const show = showArray[getRandomArbitrary(2, showArray.length - 1)];
  console.log(`show: ${show}`);
  return show;
  // }
  // return `no empty messages`;
}
