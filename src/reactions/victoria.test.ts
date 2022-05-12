import {
  jpegRegex,
  naughtyWordReactions,
  victoriaReactions,
  weepRegex,
} from "../consts";
import { vicLogic } from "./victoria.logic";

describe(`Victoria tests`, () => {
  describe(`F**t`, () => {
    let message;
    // ok I know how this test reads but I don't want to say the f word
    it(`should return a naughty response message`, () => {
      // Flag message as inappropriate
      message = `foot`;
      expect(naughtyWordReactions.includes(vicLogic(message))).toBeTruthy();
      message = `feet`;
      expect(naughtyWordReactions.includes(vicLogic(message))).toBeTruthy();
      // Validate with spaces
      message = ` foot `;
      expect(naughtyWordReactions.includes(vicLogic(message))).toBeTruthy();
      message = ` feet `;
      expect(naughtyWordReactions.includes(vicLogic(message))).toBeTruthy();
    });
    it(`should not flag partial matches`, () => {
      // Only flag entire word matches
      message = `afoot`;
      expect(naughtyWordReactions.includes(vicLogic(message))).toBeFalsy();
      message = `crowfeet`;
      expect(naughtyWordReactions.includes(vicLogic(message))).toBeFalsy();
    });
    it(`should not return when Victoria's name is mentioned`, () => {
      // Basic logic where if you are caught saying a naughty word
      // If you also say her name, you acknowledge her judgment
      message = `victoria foot`;
      expect(naughtyWordReactions.includes(vicLogic(message))).toBeFalsy();
      expect(victoriaReactions.includes(vicLogic(message))).toBeTruthy();
    });
  });
  describe(`I Think We All Sing`, () => {
    let message;
    it(`should return 'I think we all sing' photo`, () => {
      message = `i think we all sing`;
      expect(vicLogic(message)).toBe(
        `https://pbs.twimg.com/media/C-iOjtzUwAAHz9L?format=jpg&name=900x900`
      );
    });
    it(`I Think We All base`, () => {
      message = `i think we all dance`;
      expect(vicLogic(message)).toBe(`I THINK WE ALL DANCE`);
    });
    it(`I Think We All all`, () => {
      message = `i think i love to dance`;
      expect(vicLogic(message)).toBe(`I THINK WE ALL LOVE TO DANCE`);
    });
    it(`I Think We All 'd'`, () => {
      message = `i think i'd go dance`;
      expect(vicLogic(message)).toBe(`I THINK WE'D ALL GO DANCE`);
    });
    it(`I Think We All null`, () => {
      message = `i think magumbo magumbo`;
      expect(vicLogic(message)).toBe(`I THINK WE ALL MAGUMBO MAGUMBO`);
    });
    it(`I Think We All 're'`, () => {
      message = `i think we're going out dancing`;
      expect(vicLogic(message)).toBe(`I THINK WE'RE ALL GOING OUT DANCING`);
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
  });
});
