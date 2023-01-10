import * as fs from "fs";
import path from "path";

export function whichEpisode() {
  const tvDirectory = path.join(process.cwd(), `episodeList.txt`);
  // console.log(tvDirectory);
  const array = fs.readFileSync(tvDirectory).toString().split(`\n`);
  for (const i in array) {
    console.log(array[i]);
  }
}
