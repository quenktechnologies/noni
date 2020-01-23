/// <reference types="node" />
/**
 * JSONXValue
 */
export declare type JSONXValue = JSONXObject | JSONXArray | JSONXDate | JSONXBuffer | JSONXString | JSONXBoolean | JSONXNumber | JSONXNull | undefined;
/**
 * JSONXArray
 */
export interface JSONXArray extends Array<JSONXValue> {
}
/**
 * JSONXObject
 */
export interface JSONXObject {
    [key: string]: JSONXValue;
}
/**
 * JSONXDate
 */
export declare type JSONXDate = Date;
/**
 * JSONXBuffer
 */
export declare type JSONXBuffer = Buffer;
/**
 * JSONXNumber
 */
export declare type JSONXNumber = number;
/**
 * JSONXBoolean
 */
export declare type JSONXBoolean = boolean;
/**
 * JSONXString
 */
export declare type JSONXString = string;
/**
 * JSONXNull
 */
export declare type JSONXNull = null;
