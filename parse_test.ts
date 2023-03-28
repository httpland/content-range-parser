import {
  assertEquals,
  assertIsError,
  assertThrows,
  describe,
  it,
} from "./_dev_deps.ts";
import {
  parseContentRange,
  parseFirstPos,
  parseInclRange,
  parseRangeResp,
  parseUnsatisfiedRange,
} from "./parse.ts";
import {
  ContentRange,
  InclRange,
  RangeResp,
  UnsatisfiedRange,
} from "./types.ts";

describe("parseContentRange", () => {
  it("should return ContentRange with RangeResp", () => {
    const table: [string, ContentRange][] = [
      ["bytes 42-1233/1234", {
        completeLength: 1234,
        rangeUnit: "bytes",
        firstPos: 42,
        lastPos: 1233,
      }],
      ["bytes 42-1233/*", {
        completeLength: undefined,
        rangeUnit: "bytes",
        firstPos: 42,
        lastPos: 1233,
      }],
      ["unknown 0-1000/2000", {
        completeLength: 2000,
        rangeUnit: "unknown",
        firstPos: 0,
        lastPos: 1000,
      }],
    ];

    table.forEach(([input, expected]) => {
      assertEquals(parseContentRange(input), expected);
    });
  });

  it("should return ContentRange with UnsatisfiedRange ", () => {
    const table: [string, ContentRange][] = [
      ["bytes */1234", { completeLength: 1234, rangeUnit: "bytes" }],
    ];

    table.forEach(([input, expected]) => {
      assertEquals(parseContentRange(input), expected);
    });
  });

  it("should throw syntax error if the input is invalid Content-Range syntax", () => {
    const table: string[] = [
      "",
      " ",
      "bytes",
      "bytes bytes",
      "bytes 0-100",
      "bytes 0-100/",
      "bytes 0-100/a",
      "bytes 0-100/-1000",
      "bytes -0-100/1000",
      "bytes 0+100/1000",
      "bytes  0-100/1000",
      " bytes 0-100/1000 ",
    ];

    table.forEach((input) => {
      assertThrows(() => parseContentRange(input));
    });
  });

  it("should throw error if the semantics error exist", () => {
    const table: string[] = [
      "bytes 1-0/*",
      "bytes 1-0/1000",
      "bytes 1-1/000",
      "bytes 1-2/000",
      "bytes 0-2/0",
    ];

    table.forEach((input) => {
      assertThrows(() => parseContentRange(input));
    });
  });

  it("should be error message input is invalid <Content-Range>", () => {
    let err;

    try {
      parseContentRange("abc");
    } catch (e) {
      err = e;
    } finally {
      assertIsError(err, SyntaxError, `invalid <Content-Range> syntax. "abc"`);
    }
  });

  it("should be error message input is invalid <range-unit>", () => {
    let err;

    try {
      parseContentRange(`" a`);
    } catch (e) {
      err = e;
    } finally {
      assertIsError(
        err,
        SyntaxError,
        `invalid <Content-Range> syntax. "" a"`,
      );
    }
  });

  it("should be error message input is invalid <range-resp>", () => {
    let err;

    try {
      parseContentRange(`unknown a`);
    } catch (e) {
      err = e;
    } finally {
      assertIsError(
        err,
        SyntaxError,
        `invalid <Content-Range> syntax. "unknown a"`,
      );
    }
  });

  it("should be error message input is invalid <unsatisfied-range>", () => {
    let err;

    try {
      parseContentRange(`unknown */?`);
    } catch (e) {
      err = e;
    } finally {
      assertIsError(
        err,
        SyntaxError,
        `invalid <Content-Range> syntax. "unknown */?"`,
      );
    }
  });

  it("should be error message input is invalid semantics", () => {
    let err;

    try {
      parseContentRange(`unknown 1-0/1000`);
    } catch (e) {
      err = e;
    } finally {
      assertIsError(
        err,
        Error,
        `invalid semantics exist. "unknown 1-0/1000"`,
      );
    }
  });
});

describe("parseRangeResp", () => {
  it("should return RangeResp if the input is valid range-resp", () => {
    const table: [string, RangeResp][] = [
      ["0-100/2000", { completeLength: 2000, firstPos: 0, lastPos: 100 }],
      ["0-100/*", { completeLength: undefined, firstPos: 0, lastPos: 100 }],
    ];

    table.forEach(([input, expected]) => {
      assertEquals(parseRangeResp(input), expected);
    });
  });

  it("should throw error if the input is invalid <range-resp>", () => {
    const table: string[] = [
      "",
      "test",
      " test",
      "test ",
      "0",
      "1",
      "100",
      "/",
      "a/a",
      "010/010",
      "0-1/",
      "a-1/0",
      "1-a/0",
      "1-a/*",
      "1.0-2.0/100",
      "NaN-NaN/100",
    ];

    table.forEach((input) => {
      assertThrows(() => parseRangeResp(input));
    });
  });

  it("should be error message input is invalid <range-resp>", () => {
    let err;

    try {
      parseRangeResp("abc");
    } catch (e) {
      err = e;
    } finally {
      assertIsError(err, SyntaxError, `invalid <range-resp> syntax. "abc"`);
    }
  });

  it("should be error message input is invalid <complete-length>", () => {
    let err;

    try {
      parseRangeResp("0-100/a");
    } catch (e) {
      err = e;
    } finally {
      assertIsError(err, SyntaxError, `invalid <range-resp> syntax. "0-100/a"`);
    }
  });
});

describe("parseUnsatisfiedRange", () => {
  it("should return UnsatisfiedRange if the input is valid unsatisfied-range", () => {
    const table: [string, UnsatisfiedRange][] = [
      ["*/0", { completeLength: 0 }],
      ["*/2000", { completeLength: 2000 }],
    ];

    table.forEach(([input, expected]) => {
      assertEquals(parseUnsatisfiedRange(input), expected);
    });
  });

  it("should throw error if the input is invalid <unsatisfied-range>", () => {
    const table: string[] = [
      "",
      "a",
      "0/0",
      "1/1",
      "**/1",
      " */0",
      "*/0 ",
      "*/a",
      "*/1.2",
    ];

    table.forEach((input) => {
      assertThrows(() => parseUnsatisfiedRange(input));
    });
  });

  it("should be error message if the input is invalid <unsatisfied-range>", () => {
    let err;

    try {
      parseUnsatisfiedRange("abc");
    } catch (e) {
      err = e;
    } finally {
      assertIsError(
        err,
        SyntaxError,
        `invalid <unsatisfied-range> syntax. "abc"`,
      );
    }
  });

  it("should be error message if the input is invalid <last-pos>", () => {
    let err;

    try {
      parseUnsatisfiedRange("*/a");
    } catch (e) {
      err = e;
    } finally {
      assertIsError(
        err,
        SyntaxError,
        `invalid <unsatisfied-range> syntax. "*/a"`,
      );
    }
  });
});

describe("parseInclRange", () => {
  it("should return InclRange if the input is valid incl-range", () => {
    const table: [string, InclRange][] = [
      ["0-100", { firstPos: 0, lastPos: 100 }],
      ["200-256", { firstPos: 200, lastPos: 256 }],
    ];

    table.forEach(([input, expected]) => {
      assertEquals(parseInclRange(input), expected);
    });
  });

  it("should throw error if the input is invalid <incl-range>", () => {
    const table: string[] = [
      "",
      "a",
      "0",
      "100",
      "a-a",
      " 1-2",
      "1-2 ",
      "1-a",
      "a-1",
    ];

    table.forEach((input) => {
      assertThrows(() => parseInclRange(input));
    });
  });

  it("should be error message if the input is invalid <incl-range>", () => {
    let err;

    try {
      parseInclRange("abc");
    } catch (e) {
      err = e;
    } finally {
      assertIsError(err, SyntaxError, `invalid <incl-range> syntax. "abc"`);
    }
  });

  it("should be error message if the input is invalid <first-pos>", () => {
    let err;

    try {
      parseInclRange("a-0");
    } catch (e) {
      err = e;
    } finally {
      assertIsError(err, SyntaxError, `invalid <incl-range> syntax. "a-0"`);
    }
  });

  it("should be error message if the input is invalid <last-pos>", () => {
    let err;

    try {
      parseInclRange("0-a");
    } catch (e) {
      err = e;
    } finally {
      assertIsError(err, SyntaxError, `invalid <incl-range> syntax. "0-a"`);
    }
  });
});

describe("parseFirstPos", () => {
  it("should return number", () => {
    assertEquals(parseFirstPos("0"), 0);
  });

  it("should throw error if the input is invalid <first-pos>", () => {
    const table: string[] = [
      "",
      " ",
      "a",
      "abc",
    ];

    table.forEach((input) => {
      assertThrows(() => parseFirstPos(input));
    });
  });

  it("should be error message", () => {
    let err;

    try {
      parseFirstPos("abc");
    } catch (e) {
      err = e;
    } finally {
      assertIsError(err, SyntaxError, `invalid <first-pos> syntax. "abc"`);
    }
  });
});
