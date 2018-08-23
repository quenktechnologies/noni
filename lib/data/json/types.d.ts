/**
 * json provides TypeScript definitions for JSON objects.
 */
/**
 * JSONValue are values that can appear in a JSON document.
 */
export declare type JSONValue = JSONObject | JSONArray | JSONString | JSONBoolean | JSONNumber | JSONNull;
/**
 * JSONArray represents an array in a JSON document.
 */
export interface JSONArray extends Array<JSONValue> {
}
/**
 * JSONObject represents an object within a JSON document.
 */
export interface JSONObject {
    [key: string]: JSONValue;
}
/**
 * JSONNumber represents a number in a JSON document.
 */
export declare type JSONNumber = number;
/**
 * JSONBoolean represents a boolen in a JSON document.
 */
export declare type JSONBoolean = boolean;
/**
 * JSONString represents a string within a JSON document.
 */
export declare type JSONString = string;
/**
 * JSONNull represents a null within a JSON document.
 */
export declare type JSONNull = null;
