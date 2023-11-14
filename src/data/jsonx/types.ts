/**
 * JSONXValue
 */
export type JSONXValue =
  | JSONXObject
  | JSONXArray
  | JSONXDate
  | JSONXBuffer
  | JSONXString
  | JSONXBoolean
  | JSONXNumber
  | JSONXNull
  | undefined;

/**
 * JSONXArray
 */
export interface JSONXArray extends Array<JSONXValue> {}

/**
 * JSONXObject
 */
export interface JSONXObject {
  [key: string]: JSONXValue;
}

/**
 * JSONXDate
 */
export type JSONXDate = Date;

/**
 * JSONXBuffer
 */
export type JSONXBuffer = Buffer;

/**
 * JSONXNumber
 */
export type JSONXNumber = number;

/**
 * JSONXBoolean
 */
export type JSONXBoolean = boolean;

/**
 * JSONXString
 */
export type JSONXString = string;

/**
 * JSONXNull
 */
export type JSONXNull = null;
