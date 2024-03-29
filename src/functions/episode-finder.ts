import dotenv from "dotenv";
import * as fs from "fs";
import path from "path";

import { getRandomInt } from "../consts/consts";

dotenv.config();

const directory = process.env.LISTS_PATH || `/tmp`;

export function media(prompt: string): string {
	let file = ``;
	if (!prompt) {
		return ``;
	}
	switch (prompt.toLowerCase()) {
		case `episode`:
		case `show`:
		case `movie`: {
			file = `${prompt.toLowerCase()}List.txt`;
			break;
		}
		case `playlist`: {
			file = `playList.txt`;
			break;
		}
		default: {
			return ``;
		}
	}
	const filepath = path.join(directory, file);
	const list = fs
		.readFileSync(filepath)
		.toString()
		.split(`\n`)
		.filter((n) => n);
	if (list.length < 1) {
		return `No items in ${prompt === `playlist` ? `playlist` : `${prompt} list`
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
