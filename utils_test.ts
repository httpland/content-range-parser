import { divideTwo } from "./utils.ts";
import { assertEquals, describe, it } from "./_dev_deps.ts";

describe("divideTwo", () => {
  it("should return null if the separator does not match", () => {
    const table: [string, string][] = [
      ["", "a"],
      ["abc", "d"],
      ["あa亜", "b"],
    ];

    table.forEach(([input, separator]) => {
      assertEquals(divideTwo(input, separator), null);
    });
  });

  it("should return tuple", () => {
    const table: [string, string, [string, string]][] = [
      ["", "", ["", ""]],
      ["abc", "", ["", "abc"]],
      ["abc", "a", ["", "bc"]],
      ["abc", "b", ["a", "c"]],
      ["abbc", "b", ["a", "bc"]],
      ["あいうえお", "う", ["あい", "えお"]],
    ];

    table.forEach(([input, separator, expected]) => {
      assertEquals(divideTwo(input, separator), expected);
    });
  });
});
