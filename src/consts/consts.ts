export const alanisReactions = [
	`https://youtu.be/HLHvb9V8Yzs`, // all i really want
	`https://youtu.be/NPcyTyilmYY`, // you oughta know
	`https://youtu.be/i9WIM2zZ2nI`, // perfect
	`https://youtu.be/CUjIY_XxF1g`, // hand in my pocket
	`https://youtu.be/3oPrb_ZzAcg`, // right through you
	`https://youtu.be/iPTLv9xY800`, // forgiven
	`https://youtu.be/GFW-WfuX2Dk`, // you learn
	`https://youtu.be/4iuO49jbovg`, // head over feet
	`https://youtu.be/4NeSUcL-qQU`, // mary jane
	`https://youtu.be/Jne9t8sHpUc`, // ironic
	`https://youtu.be/kiiYS2vLD5Y`, // not the doctor
	`https://youtu.be/JX6FbIkfyro`, // wake up
	// non-JLP tracks
	`https://youtu.be/KV43rJ0a5iA`, // crazy
	`https://youtu.be/VJg4rwDkkBA`, // my humps
];

export const jpegReactions = [
	`https://youtu.be/ZXVhOPiM4mk`, // hotdog.jpeg song
	`https://youtu.be/EvKTOHVGNbg`, // hotdog.jpeg
	`https://cdn.discordapp.com/attachments/799876599372840964/949119835940466688/big_1482307605_image.png`, // just the screen cap
];

export const naughtyWordReactions = [
	`We don't do that here.`,
	`You said the f-word.`,
	`Banned word detected.`,
	`👣`,
	`NO FUCKING FEET ON OUR FUCKING SERVER`,
];

export const toriQuotes = [
	`Are you a good witch or a sandwich?`,
	`Can we try it again without the physical assault?`,
	`Cat! You weren't supposed to tell her that.`,
	`Did you just call me Toro?`,
	`Eat your pants!`,
	`Everybody sweats.`,
	`He's a puppet, he can't pee.`,
	`Honestly, I wouldn't love it.`,
	`I am a police officer! Would you like some Raisin Bran?`,
	`I know what I meant.`,
	`I like waffles.`,
	`I see through your little plan.`,
	`I swear, I thought I had it on vibrate.`,
	`I thought he was homeless.`,
	`I'm alone.`,
	`It was 1934 when my husband left me... alone. Living on the prairie was a dreary existence. No telephone, no radio, only a large majestic bird with whom I shared my feelings. One day when I was feeling low, I said to him, 'Oh, bird. You can fly. You can soar miles from this lonely place, and yet you stay. Why?' And apparently, that question rang true, for that afternoon my bird left. And so went my spirit.`,
	`It's not my fault!`,
	`It's so hot!`,
	`Let me have you on the couch.`,
	`Love me? Love me now? Yeah you do. Come on, give Tori a squeeze.`,
	`My throat is an instrument, I'm a throat player.`,
	`Oh my god. I am so hot.`,
	`That's not my head!`,
	`Try not to swallow each other.`,
	`Uhh...`,
	`Wait! So neither of you are coming with us tomorrow night to the museum of large bones?`,
	`We're not going out!`,
	`Well, hello.`,
	`Yo, yo, yo! Whattayaknow!`,
	`You could... wazz.`,
	`You know I'm half Latina.`,
	`You're not supposed to hit her.`,
];

export const EMOJI_ID = {
	MANIFEST: `769755766352642128`,
	BRAIN_CELL: `936895162074951730`,
	CONCH: `809579247994929182`,
	SHEEV: `636777145921699852`,
	SAD: `1089943811469357097`,
	GARNET: `919843284858310686`,
};

export const BRAINCELL_USER_ID = {
	ME: `189997816406474752`,
	CHABI: `241416328966045697`,
};

export const SERVER_ID = {
	DUMMIES: `625931911029850118`,
};

export const CHANNEL_ID = {
	BAJALANIS: `715766875971256322`,
};

export function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

export const jpegRegex = /^[^.]*(jpe?g)/;
export const weepRegex = /\b(weep)\b/;
export const cursedRegex = /\bfoot\b|\bfeet\b/;
export const uwuRegex = /\bowo\b|\buwu\b/;
export const sadRegex = /\s:\(/;
export const heyVictoriaRegex = /(hey )?\bvictoria\b/i;
export const whichRegex = /(which|what)/i;
// this might be shit but it'll do the job
export const fastNFuriousRegex = /(too)+ [^ ]+ (to?o)+ [^ \r\n]+/i;
export const fiveMinutes = 300000;

export function help(): string {
	return `\`\`\`you should just @KirbyPaint\nhttps://github.com/KirbyPaint/psychosomatic/blob/main/src/index.ts\nhttps://github.com/KirbyPaint/psychosomatic#readme\`\`\``;
}

export function tooFastToFurious(message: string) {
	const wordsArray = message.split(` `);
	const wordsArray2 = wordsArray[0].split(` `);
	wordsArray2[0] = `2`;
	wordsArray2[1] = wordsArray[1];
	wordsArray2[2] = `2`;
	wordsArray2[3] = wordsArray[3];
	const newString = wordsArray2
		.join(` `)
		.replace(/[^\w\s]|_/g, ``)
		.replace(/\s+/g, ` `);
	return newString;
}

// Thanks to grammar, I have to do work
export const wouldCouldShouldHad = [
	`i'd`,
	`you'd`,
	`we'd`,
	`they'd`,
	`he'd`,
	`she'd`,
];
export const have = [`i've`, `you've`, `we've`, `they've`];
export const areWere = [`i'm`, `you're`, `we're`, `they're`];
// The i'd and you'd need to be separate from the we've and the we're, etc.
export const pronouns = [`i`, `you`, `he`, `she`, `it`, `we`, `they`];
