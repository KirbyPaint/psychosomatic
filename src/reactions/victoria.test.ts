import { fullMessage } from "../mocks/full-message";
import { message } from "../mocks/message";

describe(`Victoria tests`, () => {
  const msg = fullMessage;
  it(`should return 'I think we all sing' photo`, () => {
    message.content = `i think we all sing`;
    // expect(victoria(msg)).toBe(`sdfsdfsdf`);
  });
});
