import {
	areWere,
	getRandomInt,
	have,
	pronouns,
	toriQuotes,
	wouldCouldShouldHad,
} from "./consts";

export function endText(endOfSentence: string[]) {
	if (endOfSentence[0]?.toLowerCase() === `all`) {
		endOfSentence.shift();
	}
	return endOfSentence.join(` `).toUpperCase();
}

export function iThinkWeAll(msg: string) {
	const contentArray: Array<string> = msg.split(` `);
	const [i, think, conditionWord, ...rest] = contentArray;
	let phrase = `${i} ${think} `;
	switch (true) {
		case pronouns.includes(conditionWord?.toLowerCase()):
			phrase += `WE ALL `;
			break;
		case areWere.includes(conditionWord?.toLowerCase()):
			phrase += `WE'RE ALL `;
			break;
		case wouldCouldShouldHad.includes(conditionWord?.toLowerCase()):
			phrase += `WE'D ALL `;
			break;
		case have.includes(conditionWord?.toLowerCase()):
			phrase += `WE'VE ALL `;
			break;
		default:
			phrase += `WE ALL THINK ${conditionWord} `;
	}
	phrase += `${endText(rest)}`;
	return phrase.toLocaleUpperCase();
}

export function vicQuote() {
	return toriQuotes[Math.floor(getRandomInt(toriQuotes.length))].toString();
}
