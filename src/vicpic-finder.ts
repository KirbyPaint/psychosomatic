import * as fs from "fs";

import { getRandomInt } from "./consts";

const filepath = `/home/plex/Documents/vicbot_dev/src/images.txt`;

export function read_vicpic_list(): string {
	const list = fs
		.readFileSync(filepath)
		.toString()
		.split(`\n`)
		.filter((n) => n);
		console.log({list});
		console.log({length: list.length});
	if (list.length < 1) {
		return `No images found in VicPic list?`;
	}
	const image = list[getRandomInt(list.length)];
	console.log({image});
	return image;
}

export function add_vicpic(input: string): string {
	fs.appendFileSync(filepath, `${input}\n`);
	return `Appended ${input} to playlist`;
}
