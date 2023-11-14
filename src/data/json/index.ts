/**
 * json provides type definitions for working with parsed JSON.
 */

import { Err, attempt } from "../../control/error";

/**
 * Provides typescript definitions for JSON strings unserialzed into JavaScript objects.
 */
import { Either } from "../either";
import {
  JSONValue,
  JSONObject,
  JSONArray,
  JSONString,
  JSONBoolean,
  JSONNumber,
  JSONNull,
} from "./types";

export {
  JSONValue as Value,
  JSONObject as Object,
  JSONArray as Array,
  JSONString as String,
  JSONBoolean as Boolean,
  JSONNumber as Number,
  JSONNull as Null,
};

/**
 * parse a string as JSON safely.
 */
export const parse = (s: string): Either<Err, JSONValue> =>
  attempt(() => JSON.parse(s));
