import * as fs from "fs";
import path from "path";

import { getRandomInt } from "./consts";

const directory = `/home/plex/Documents/text_files`;

export function media(prompt: string): string {
  let file = ``;
  switch (prompt.toLowerCase()) {
    case `episode`: {
      file = `episodeList.txt`;
      break;
    }
    case `show`: {
      file = `showList.txt`;
      break;
    }
    case `movie`: {
      file = `movieList.txt`;
      break;
    }
    case `playlist`: {
      file = `playList.txt`;
      break;
    }
    default: {
      return `Invalid/unrecognized prompt`;
    }
  }
  const filepath = path.join(directory, file);
  const list = fs
    .readFileSync(filepath)
    .toString()
    .split(`\n`)
    .filter((n) => n);
  if (list.length < 1) {
    return `No items in ${
      prompt === `playlist` ? `playlist` : `${prompt} list`
    }`;
  }
  const media = list[getRandomInt(list.length)];
  return media;
}

export function addToPlaylist(input: string): string {
  const filepath = path.join(directory, `playList.txt`);
  fs.appendFileSync(filepath, `${input}\n`);
  return `Appended ${input} to playlist`;
}
