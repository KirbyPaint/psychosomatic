import { describe, expect, it } from 'vitest';

import {
  cursedRegex,
  fastNFuriousRegex,
  heyVictoriaRegex,
  jpegRegex,
  tooFastToFurious,
  toriQuotes,
  victoriaReactions,
  weepRegex,
} from "../consts";
import { endText, iThinkWeAll, vicPic, vicQuote } from "../reactions/victoria";

describe(`Victoria tests`, () => {
  describe(`I Think We All (tests)`, () => {
    let message;
    it(`should return 'I think we all sing' photo`, () => {
      message = `i think we all sing`;
      expect(iThinkWeAll(message)).toBe(`I THINK WE ALL SING`);
    });

    it(`I Think We All [VERB]`, () => {
      message = `i think we all dance`;
      expect(iThinkWeAll(message)).toBe(`I THINK WE ALL DANCE`);
    });

    it(`I Think I [VERB]`, () => {
      message = `i think i love to dance`;
      expect(iThinkWeAll(message)).toBe(`I THINK WE ALL LOVE TO DANCE`);
    });

    it(`I Think I'd [VERB]`, () => {
      message = `i think i'd go dance`;
      expect(iThinkWeAll(message)).toBe(`I THINK WE'D ALL GO DANCE`);
    });

    it(`I Think I've [VERB]`, () => {
      message = `i think i've fallen`;
      expect(iThinkWeAll(message)).toBe(`I THINK WE'VE ALL FALLEN`);
    });

    it(`I Think We're [WHATEVER]`, () => {
      message = `i think we're going out dancing`;
      expect(iThinkWeAll(message)).toBe(`I THINK WE'RE ALL GOING OUT DANCING`);
      message = `i think we're all Hank Hill`;
      expect(iThinkWeAll(message)).toBe(`I THINK WE'RE ALL HANK HILL`);
    });

    it(`I Think [WORDS]`, () => {
      message = `I think today is gonna be wildin' at work`;
      expect(iThinkWeAll(message)).toBe(
        `I THINK WE ALL THINK TODAY IS GONNA BE WILDIN' AT WORK`,
      );
      message = `i think magumbo magumbo`;
      expect(iThinkWeAll(message)).toBe(`I THINK WE ALL THINK MAGUMBO MAGUMBO`);
      message = `I think it's Sonic`;
      expect(iThinkWeAll(message)).toBe(`I THINK WE ALL THINK IT'S SONIC`);
    });
  });
  describe(`VicPic`, () => {
    it(`should return a string from the array of photos`, () => {
      const result = vicPic();
      expect(typeof result).toBe(`string`);
      expect(victoriaReactions.includes(result)).toBe(true);
    });
  });
  describe(`VicQuote`, () => {
    it(`should return a quote from the array of quotes`, () => {
      const result = vicQuote();
      expect(typeof result).toBe(`string`);
      expect(toriQuotes.includes(result)).toBe(true);
    });
  });
});

describe(`regex`, () => {
  describe(`jpeg`, () => {
    it(`should match these strings`, () => {
      expect(`jpeg`).toMatch(jpegRegex);
      expect(`jpg`).toMatch(jpegRegex);
      expect(` jpeg`).toMatch(jpegRegex);
      expect(` jpg`).toMatch(jpegRegex);
    });

    it(`should not match these strings`, () => {
      expect(`.jpeg`).not.toMatch(jpegRegex);
      expect(`.jpg`).not.toMatch(jpegRegex);
    });
  });

  describe(`weep`, () => {
    it(`should match these strings`, () => {
      expect(`weep`).toMatch(weepRegex);
      expect(` weep `).toMatch(weepRegex);
      expect(`      weep      `).toMatch(weepRegex);
    });

    it(`should not match these strings`, () => {
      expect(`minesweeper`).not.toMatch(weepRegex);
      expect(`sweepstakes`).not.toMatch(weepRegex);
    });
  });

  describe(`cursed`, () => {
    // ok I know how this test reads but I don't want to say the f word
    it(`should match these strings`, () => {
      expect(`foot`).toMatch(cursedRegex);
      expect(`feet`).toMatch(cursedRegex);
      expect(` foot `).toMatch(cursedRegex);
      expect(` feet `).toMatch(cursedRegex);
    });

    it(`should not match these strings`, () => {
      expect(`afoot`).not.toMatch(cursedRegex);
      expect(`crowsfeet`).not.toMatch(cursedRegex);
    });
  });
  describe(`fastNFurious`, () => {
    it(`should match these strings`, () => {
      // too x to y or too x too y
      expect(`too hot to handle`).toMatch(fastNFuriousRegex);
      expect(`too hot too much`).toMatch(fastNFuriousRegex);
    });

    it(`should NOT match these strings`, () => {
      // NOT to x to y
      expect(`to hot to handle`).not.toMatch(fastNFuriousRegex);
      // bad grammar alert!!
      expect(`to much too take care of`).not.toMatch(fastNFuriousRegex);
    });

    it(`should work`, () => {
      // ensures the function works
      const result1 = tooFastToFurious(`too hot to handle`);
      const result3 = tooFastToFurious(`too hot(dog) to handle(dog)`);
      const result4 = tooFastToFurious(`too hot too handle`);
      expect(result1).toMatch(`2 hot 2 handle`);
      // punctuation filtered out
      expect(result3).toMatch(`2 hotdog 2 handledog`);
      expect(result4).toMatch(`2 hot 2 handle`);
    });

    it(`should NOT work`, () => {
      // Should not try to replace a long phrase containing the key words
      expect(`too hot to handle on a pleasant summer's day`).not.toMatch(
        `2 hot 2 handle on a pleasant summer's day`,
      );
      const result5 = tooFastToFurious(
        `too hot to handle on a pleasant summer's day`,
      );
      expect(result5).toMatch(`2 hot 2 handle`);
    });
  });

  describe(`hey victoria`, () => {
    it(`should match these strings`, () => {
      expect(`hey victoria`).toMatch(heyVictoriaRegex);
      expect(`victoria`).toMatch(heyVictoriaRegex);
      expect(`Hey Victoria`).toMatch(heyVictoriaRegex);
      expect(`Victoria`).toMatch(heyVictoriaRegex);
    });

    it(`should not match these strings`, () => {
      expect(`He Vic`).not.toMatch(heyVictoriaRegex);
    });
  });
});

describe(`Other functions`, () => {
  it(`should append proper end text to a sentence`, () => {
    const firstSentence = [`all`, `Hank`, `Hill`];
    const secondSentence = [`all`, `Hank`, `Hill`, `all`, `the`, `time`];
    expect(endText(firstSentence)).toBe(`HANK HILL`);
    expect(endText(secondSentence)).toBe(`HANK HILL ALL THE TIME`);
  });
});
