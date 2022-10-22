/**
 * ISO8601Date string.
 *
 * The only accepted format is YYYY-MM-DD.
 */
export declare type ISO8601Date = string;
/**
 * EmptyString indicating the date value was cleared.
 */
export declare type EmptyString = '';
/**
 * parseDate attempts to parse a string into the format YYYY-MM-DD.
 *
 * If it fails, an empty string is returned.
 */
export declare const parseDate: (str: string) => string;
