# content-range-parser

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/content_range_parser)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/content_range_parser/mod.ts)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/httpland/content-range-parser)](https://github.com/httpland/content-range-parser/releases)
[![codecov](https://codecov.io/gh/httpland/content-range-parser/branch/main/graph/badge.svg)](https://codecov.io/gh/httpland/content-range-parser)
[![GitHub](https://img.shields.io/github/license/httpland/content-range-parser)](https://github.com/httpland/content-range-parser/blob/main/LICENSE)

[![test](https://github.com/httpland/content-range-parser/actions/workflows/test.yaml/badge.svg)](https://github.com/httpland/content-range-parser/actions/workflows/test.yaml)
[![NPM](https://nodei.co/npm/@httpland/content-range-parser.png?mini=true)](https://nodei.co/npm/@httpland/content-range-parser/)

HTTP Content-Range header field parser.

Compliant with
[RFC 9110, 14.4. Content-Range](https://www.rfc-editor.org/rfc/rfc9110#section-14.4).

## Deserialization

Parses string into [ContentRange](#content-range).

```ts
import { parseContentRange } from "https://deno.land/x/content_range_parser@$VERSION/parse.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

assertEquals(parseContentRange("bytes 0-100/1000"), {
  rangeUnit: "bytes",
  firstPos: 0,
  lastPos: 100,
  completeLength: 1000,
});
assertEquals(parseContentRange("bytes 100-200/*"), {
  rangeUnit: "bytes",
  firstPos: 100,
  lastPos: 200,
  completeLength: undefined,
});
assertEquals(parseETag("bytes */1000"), {
  rangeUnit: "bytes",
  completeLength: 1000,
});
```

### Throwing error

Throws `SyntaxError` if the input is invalid
[`<Content-Range>`](https://www.rfc-editor.org/rfc/rfc9110#section-14.4-2).

```ts
import { parseContentRange } from "https://deno.land/x/content_range_parser@$VERSION/parse.ts";
import { assertThrows } from "https://deno.land/std/testing/asserts.ts";

assertThrows(() => parseContentRange("<invalid>"));
```

## Serialization

Serialize [ContentRange](#content-range) into string.

```ts
import { stringifyContentRange } from "https://deno.land/x/content_range_parser@$VERSION/stringify.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

assertEquals(
  stringifyContentRange({
    rangeUnit: "bytes",
    firstPos: 0,
    lastPos: 100,
    completeLength: 1000,
  }),
  "bytes 0-100/1000",
);
assertEquals(
  stringifyContentRange({
    rangeUnit: "bytes",
    firstPos: 100,
    lastPos: 200,
    completeLength: undefined,
  }),
  "bytes 100-200/*",
);
assertEquals(
  stringifyContentRange({ rangeUnit: "bytes", completeLength: 1000 }),
  "bytes */1000",
);
```

### Throwing error

Throws `TypeError` if [ContentRange](#content-range) contains invalid value.

```ts
import { stringifyContentRange } from "https://deno.land/x/content_range_parser@$VERSION/stringify.ts";
import { assertThrows } from "https://deno.land/std/testing/asserts.ts";

assertThrows(() =>
  stringifyContentRange({ rangeUnit: "<range-unit>", completeLength: NaN })
);
```

## Content Range

`ContentRange` is a structured object for `Content-Range` header.

Each field name is from camel Case of
[ABNF](https://www.rfc-editor.org/rfc/rfc9110.html#section-14.4-2) definition
name.

| Name      | Type     | Description                                                                                   |
| --------- | -------- | --------------------------------------------------------------------------------------------- |
| rangeUnit | `string` | Representation of [`<range-unit>`](https://www.rfc-editor.org/rfc/rfc9110.html#section-14.1). |

and

[`<range-resp>`](https://www.rfc-editor.org/rfc/rfc9110.html#field.content-range):

| Name           | Type                        | Description                                                                                            |
| -------------- | --------------------------- | ------------------------------------------------------------------------------------------------------ |
| firstPost      | `number`                    | Representation of [`<first-pos>`](https://www.rfc-editor.org/rfc/rfc9110.html#rule.int-range).         |
| lastPos        | `number`                    | Representation of [`<last-pos>`](https://www.rfc-editor.org/rfc/rfc9110.html#rule.int-range).          |
| completeLength | `number` &#124; `undefined` | Representation of [`<unsatisfied-range>`](https://www.rfc-editor.org/rfc/rfc9110.html#section-14.4-2). |

or

[`<unsatisfied-range>`](https://www.rfc-editor.org/rfc/rfc9110.html#field.content-range):

| Name           | Type     | Description                                                                                           |
| -------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| completeLength | `number` | Representation of [`<unsatisfied-range>`](https://www.rfc-editor.org/rfc/rfc9110.html#section-14.4-2) |

### 

## API

All APIs can be found in the
[deno doc](https://doc.deno.land/https/deno.land/x/content_range_parser/mod.ts).

## License

Copyright © 2023-present [httpland](https://github.com/httpland).

Released under the [MIT](./LICENSE) license
