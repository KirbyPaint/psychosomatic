import {
  fastNFuriousRegex,
  heyVictoriaRegex,
  jpegRegex,
  naughtyWordReactions,
  tooFastToFurious,
  victoriaReactions,
  weepRegex,
} from "../consts";
import { endText } from "./victoria";

// describe.skip(`Victoria tests`, () => {
//   describe(`I Think We All (tests)`, () => {
//     let message;
//     it(`should return 'I think we all sing' photo`, () => {
//       message = `i think we all sing`;
//       expect(vicLogic(message)).toBe(
//         `https://pbs.twimg.com/media/C-iOjtzUwAAHz9L?format=jpg&name=900x900`,
//       );
//     });
//     it(`I Think We All [VERB]`, () => {
//       message = `i think we all dance`;
//       expect(vicLogic(message)).toBe(`I THINK WE ALL DANCE`);
//     });
//     it(`I Think I [VERB]`, () => {
//       message = `i think i love to dance`;
//       expect(vicLogic(message)).toBe(`I THINK WE ALL LOVE TO DANCE`);
//     });
//     it(`I Think I'd [VERB]`, () => {
//       message = `i think i'd go dance`;
//       expect(vicLogic(message)).toBe(`I THINK WE'D ALL GO DANCE`);
//     });
//     it(`I Think We're [WHATEVER]`, () => {
//       message = `i think we're going out dancing`;
//       expect(vicLogic(message)).toBe(`I THINK WE'RE ALL GOING OUT DANCING`);
//       message = `i think we're all Hank Hill`;
//       expect(vicLogic(message)).toBe(`I THINK WE'RE ALL HANK HILL`);
//     });
//     it(`I Think [WORDS]`, () => {
//       message = `I think today is gonna be wildin' at work`;
//       expect(vicLogic(message)).toBe(
//         `I THINK WE ALL THINK TODAY IS GONNA BE WILDIN' AT WORK`,
//       );
//       message = `i think magumbo magumbo`;
//       expect(vicLogic(message)).toBe(`I THINK WE ALL THINK MAGUMBO MAGUMBO`);
//       message = `I think it's Sonic`;
//       expect(vicLogic(message)).toBe(`I THINK WE ALL THINK IT'S SONIC`);
//     });
//   });
// });
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
    let message;
    // ok I know how this test reads but I don't want to say the f word
    it(`should return a naughty response message`, () => {
      // Flag message as inappropriate
      message = `foot`;
      // expect(naughtyWordReactions.includes(vicLogic(message))).toBeTruthy();
      message = `feet`;
      // expect(naughtyWordReactions.includes(vicLogic(message))).toBeTruthy();
      // Validate with spaces
      message = ` foot `;
      // expect(naughtyWordReactions.includes(vicLogic(message))).toBeTruthy();
      message = ` feet `;
      // expect(naughtyWordReactions.includes(vicLogic(message))).toBeTruthy();
    });
    it(`should not flag partial matches`, () => {
      // Only flag entire word matches
      message = `afoot`;
      // expect(naughtyWordReactions.includes(vicLogic(message))).toBeFalsy();
      message = `crowfeet`;
      // expect(naughtyWordReactions.includes(vicLogic(message))).toBeFalsy();
    });
    it(`should not return when Victoria's name is mentioned`, () => {
      // Basic logic where if you are caught saying a naughty word
      // If you also say her name, you acknowledge her judgment
      message = `victoria foot`;
      // expect(naughtyWordReactions.includes(vicLogic(message))).toBeFalsy();
      // expect(victoriaReactions.includes(vicLogic(message))).toBeTruthy();
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
      expect(result3).toMatch(`2 hot(dog) 2 handle(dog)`);
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
