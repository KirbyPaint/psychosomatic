import { getRandomInt } from "../consts/consts";

const common = [
	`It is certain.`,
	`It is decidedly so.`,
	`Without a doubt.`,
	`Yes definitely.`,
	`You may rely on it.`,
	`As I see it, yes.`,
	`Most likely.`,
	`Outlook good.`,
	`Yes.`,
	`Signs point to yes`,
	`Reply hazy, try again.`,
	`Ask again later.`,
	`Better not tell you now.`,
	`Cannot predict now.`,
	`Concentrate and ask again.`,
	`Don't count on it.`,
	`My reply is no.`,
	`My sources say no.`,
	`Outlook not so good.`,
	`Very doubtful.`,
];

const uncommon = [
	`It's none of my business.`,
	`It's none of your business.`,
	`No, I don't think I will.`,
	`Yes, dear.`,
	`Yes, now leave me alone.`,
	`Sure, I mean, it's your funeral.`,
	`Technically yes, but you'll hate it.`,
	`The auguries say no.`,
];

const rare = [
	`Ask again later, bitch.`,
	`I don't fucking know.`,
	`Anyway, here's Wonderwall.`,
	`Yes, now leave me alone.`,
	`Kill. Kill. Kill. Kill. Kill. Kill. Kill.`,
	`Do you think God lives in Heaven because He, too, lives in fear of what He's created here on Earth?`,
	`Anything is possible through the liberal application of fire.`,
];

export function get8Ball() {
	const table = getRandomInt(100);
	if (table >= 97) {
		return rare[getRandomInt(rare.length)];
	}
	else if (table >= 90) {
		return uncommon[getRandomInt(uncommon.length)];
	}
	else {
		return common[getRandomInt(common.length)];
	}
}
