import { BuildOptions } from "https://deno.land/x/dnt@0.33.1/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  typeCheck: true,
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  package: {
    name: "@httpland/content-range-parser",
    version,
    description: "HTTP Content-Range header field parser",
    keywords: [
      "http",
      "header",
      "content-range",
      "parser",
      "parse",
      "deserialize",
      "stringify",
      "serialize",
      "bytes",
    ],
    license: "MIT",
    homepage: "https://github.com/httpland/content-range-parser",
    repository: {
      type: "git",
      url: "git+https://github.com/httpland/content-range-parser.git",
    },
    bugs: {
      url: "https://github.com/httpland/content-range-parser/issues",
    },
    sideEffects: false,
    type: "module",
    publishConfig: {
      access: "public",
    },
  },
  packageManager: "pnpm",
  mappings: {
    "https://deno.land/x/isx@1.1.1/is_number.ts": {
      name: "@miyauci/isx",
      version: "1.1.1",
      subPath: "is_number",
    },
    "https://deno.land/x/isx@1.1.1/number/is_non_negative_integer.ts": {
      name: "@miyauci/isx",
      version: "1.1.1",
      subPath: "number/is_non_negative_integer",
    },
  },
});
