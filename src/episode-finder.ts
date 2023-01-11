import * as fs from "fs";
import path from "path";
import { getRandomArbitrary } from "./consts";

export function whichEpisode(): string {
  const tvDirectory = path.join(process.cwd(), `episodeList.txt`);
  const showArray = fs.readFileSync(tvDirectory).toString().split(`\n`);
  const show = showArray[Math.floor(getRandomArbitrary(0, showArray.length))];
  return show;
}

export function whichShow(): string {
  const tvDirectory = path.join(process.cwd(), `showList.txt`);
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

export function whichPlaylist(): string {
  const tvDirectory = path.join(process.cwd(), `playlist.txt`);
  const showArray = fs
    .readFileSync(tvDirectory)
    .toString()
    .split(`\n`)
    .filter((x) => x !== undefined);
  console.log(showArray.length);
  const index = Math.floor(getRandomArbitrary(0, showArray.length));
  console.log({ index });
  console.log(`showArray result = `, showArray[index]);
  const show = showArray[index];
  return show;
}

export function addToPlaylist(input: string): string {
  console.log(input);
  const playlistFile = path.join(process.cwd(), `playlist.txt`);
  fs.appendFileSync(playlistFile, `${input}` + `\n`);
  return `Appended ${input} to playlist`;
}
