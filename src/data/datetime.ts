import { Function } from "./function";

const FY = `${new Date().getFullYear()}`;
const KY = `${FY[0]}${FY[1]}`;

/**
 * ISO8601Date string.
 *
 * The only accepted format is YYYY-MM-DD.
 */
export type ISO8601Date = string;

/**
 * EmptyString indicating the date value was cleared.
 */
export type EmptyString = "";

const patterns: { [key: string]: Function<string, ISO8601Date> } = {
  // yyyy-mm-dd
  ddddsddsdd: ([d0, d1, d2, d3, , d4, d5, , d6, d7]) =>
    [d0, d1, d2, d3, "-", d4, d5, "-", d6, d7].join(""),

  // yyyy-mm-d
  ddddsddsd: ([d0, d1, d2, d3, , d4, d5, , d6]) =>
    [d0, d1, d2, d3, "-", d4, d5, "-", "0", d6].join(""),

  // yyyy-m-dd
  ddddsdsdd: ([d0, d1, d2, d3, , d4, , d5, d6]) =>
    [d0, d1, d2, d3, "-", "0", d4, "-", d5, d6].join(""),

  // yyyy-m-d
  ddddsdsd: ([d0, d1, d2, d3, , d4, , d5]) =>
    [d0, d1, d2, d3, "-", "0", d4, "-", "0", d5].join(""),

  // yy-mm-d
  ddsddsdd: ([d0, d1, , d2, d3, , d4, d5]) =>
    [KY, d0, d1, "-", d2, d3, "-", , d4, d5].join(""),

  // yy-mm-d
  ddsddsd: ([d0, d1, , d2, d3, , d4]) =>
    [KY, d0, d1, "-", d2, d3, "-", , "0", d4].join(""),

  // yy-m-dd
  ddsdsdd: ([d0, d1, , d2, , d3, d4]) =>
    [KY, d0, d1, "-", "0", d2, "-", d3, d4].join(""),

  // yy-m-d
  ddsdsd: ([d0, d1, , d2, , d3]) =>
    [KY, d0, d1, "-", "0", d2, "-", "0", d3].join(""),

  // yyyymmdd
  dddddddd: ([d0, d1, d2, d3, d4, d5, d6, d7]) =>
    [d0, d1, d2, d3, "-", d4, d5, "-", d6, d7].join(""),

  // yyyymmd
  ddddddd: ([d0, d1, d2, d3, d4, d5, d6]) =>
    [d0, d1, d2, d3, "-", d4, d5, "-", "0", d6].join(""),

  // yymmdd
  dddddd: ([d0, d1, d2, d3, d4, d5]) =>
    [KY, d0, d1, "-", d2, d3, "-", d4, d5].join(""),

  // yymd
  dddd: ([d0, d1, d2, d3]) => [KY, d0, d1, "-", "0", d2, "-", "0", d3].join(""),
};

/**
 * parseDate attempts to parse a string into the format YYYY-MM-DD.
 *
 * If it fails, an empty string is returned.
 */
export const parseDate = (str: string) => {
  let input = str.trim();

  if (input === "") return "";

  let toks = input
    .split("")
    .map((tok) => (isNaN(Number(tok)) ? "s" : "d"))
    .join("");

  let cons = patterns[toks];

  return cons ? cons(input) : "";
};
