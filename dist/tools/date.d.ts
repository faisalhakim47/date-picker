/** @typedef {Date|number|string} AnyDate */
/**
 * @typedef {object} DateRange
 * @property {Date} beginDate
 * @property {Date} endDate
 */
/**
 * @param {DateRange} dateRange
 * @returns {string}
 */
export function dateRangeToString({ beginDate, endDate }: DateRange): string;
/**
 * @param {Date} date
 * @returns {string}
 */
export function dateToString(date: Date): string;
/**
 * @param {AnyDate} [anyDate]
 * @returns {boolean}
 */
export function isInvalidDate(anyDate?: AnyDate): boolean;
/**
 * @param {string} dateRangeString
 * @returns {DateRange}
 */
export function dateRangeStringToDateRange(dateRangeString: string): DateRange;
/**
 * @param {Date} date
 * @returns {number}
 */
export function dateToNumber(date: Date): number;
/**
 * @param {string} dateString
 * @returns {Date}
 */
export function dateStringToDate(dateString: string): Date;
export type AnyDate = Date | number | string;
export type DateRange = {
    beginDate: Date;
    endDate: Date;
};
