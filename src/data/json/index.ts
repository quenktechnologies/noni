/**
 * Provides typescript definitions for JSON strings unserialzed into JavaScript objects.
 */
import { Either, left, right } from '../either';
import {
    JSONValue,
    JSONObject,
    JSONArray,
    JSONString,
    JSONBoolean,
    JSONNumber,
    JSONNull
} from './types';

export {
    JSONValue as Value,
    JSONObject as Object,
    JSONArray as Array,
    JSONString as String,
    JSONBoolean as Boolean,
    JSONNumber as Number,
    JSONNull as Null
}

/**
 * parse a string as JSON safely.
 */
export const parse = (s: string): Either<Error, JSONValue> => {

    try { return right(JSON.parse(s)); } catch (e) { return left(e); }

}
