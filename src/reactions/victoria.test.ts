import { naughtyWordReactions, victoriaReactions } from "../consts";
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
    it(`I Think We All 1`, () => {
      message = `i think we all dance`;
      expect(vicLogic(message)).toBe(`I THINK WE ALL DANCE`);
    });
    it(`I Think We All 2`, () => {
      message = `i think i love to dance`;
      expect(vicLogic(message)).toBe(`I THINK WE ALL LOVE TO DANCE`);
    });
    it(`I Think We All 3`, () => {
      message = `i think i'd go dance`;
      expect(vicLogic(message)).toBe(`I THINK WE'RE ALL GO DANCE`);
    });
    it(`I Think We All 4`, () => {
      message = `i think magumbo magumbo`;
      expect(vicLogic(message)).toBe(`I THINK WE ALL MAGUMBO MAGUMBO`);
    });
  });
});
