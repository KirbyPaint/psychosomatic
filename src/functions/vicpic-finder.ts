import dotenv from "dotenv";
import * as fs from "fs";

import { getRandomInt } from "../consts/consts";

dotenv.config();

const filepath = process.env.VICPICS_PATH || `/tmp/vicpics.txt`;

export function vicPic(): string {
	const list = fs
		.readFileSync(filepath)
		.toString()
		.split(`\n`)
		.filter((n) => n);
	if (list.length < 1) {
		return `No images found in VicPic list?`;
	}
	const image = list[getRandomInt(list.length)];
	return image;
}

export function addVicPic(input: string): string {
	fs.appendFileSync(filepath, `${input}\n`);
	return `Appended ${input} to VicPic list`;
}
