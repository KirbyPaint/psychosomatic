import { describe, expect, it } from 'vitest';

import { getRandomInt, help } from '../consts/consts';

describe(`Consts`, () => {
	it(`tests random number function`, () => {
		const number = getRandomInt(10);
		expect(number).toBeLessThanOrEqual(10);
	});
	it(`tests help display function`, () => {
		const text = help();
		expect(text).toBe(`\`\`\`you should just @KirbyPaint\nhttps://github.com/KirbyPaint/psychosomatic/blob/main/src/index.ts\nhttps://github.com/KirbyPaint/psychosomatic#readme\`\`\``);
	});
});
