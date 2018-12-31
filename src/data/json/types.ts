/**
 * json provides TypeScript definitions for JSON objects.
 */

/**
 * JSONValue are values that can appear in a JSON document.
 */
export type JSONValue
    = JSONObject
    | JSONArray
    | JSONString
    | JSONBoolean
    | JSONNumber
    | JSONNull
    | undefined
    ;

/**
 * JSONArray represents an array in a JSON document.
 */
export interface JSONArray extends Array<JSONValue> { }

/**
 * JSONObject represents an object within a JSON document.
 */
export interface JSONObject {

    [key: string]: JSONValue

}

/**
 * JSONNumber represents a number in a JSON document.
 */
export type JSONNumber = number;

/**
 * JSONBoolean represents a boolen in a JSON document.
 */
export type JSONBoolean = boolean;

/**
 * JSONString represents a string within a JSON document.
 */
export type JSONString = string;

/**
 * JSONNull represents a null within a JSON document.
 */
export type JSONNull = null;
