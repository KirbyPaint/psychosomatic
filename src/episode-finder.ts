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
    .filter((n) => n);
  if (showArray.length < 1) {
    return `No items in playlist`;
  }
  const index = Math.floor(getRandomArbitrary(0, showArray.length));
  const show = showArray[index];
  return show;
}

export function addToPlaylist(input: string): string {
  const playlistFile = path.join(process.cwd(), `playlist.txt`);
  fs.appendFileSync(playlistFile, `${input} + \n`);
  return `Appended ${input} to playlist`;
}
