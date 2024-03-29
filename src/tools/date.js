// @ts-check

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
export function dateRangeToString({ beginDate, endDate }) {
  if (isInvalidDate(beginDate) || isInvalidDate(endDate)) {
    return '';
  }

  const beginDateString = dateToString(beginDate);
  const endDateString = dateToString(endDate);

  return `${beginDateString}/${endDateString}`;
}

/**
 * Locale date string
 * 
 * @param {Date} date
 * @returns {string}
 */
export function dateToString(date) {
  if (isInvalidDate(date)) {
    return '';
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

/**
 * @param {AnyDate} [anyDate]
 * @returns {boolean}
 */
export function isInvalidDate(anyDate) {
  if (!anyDate) {
    return true;
  }
  const date = new Date(anyDate);
  return date === null || isNaN(date.getTime());
}

/**
 * @param {string} dateRangeString
 * @returns {DateRange}
 */
export function dateRangeStringToDateRange(dateRangeString) {
  const [beginDateString, endDateString] = dateRangeString.split('/');

  const beginDate = new Date(beginDateString);
  const endDate = new Date(endDateString);

  return {
    beginDate: isInvalidDate(beginDate) ? null : beginDate,
    endDate: isInvalidDate(endDate) ? null : endDate,
  };
}

/**
 * @param {Date} date
 * @returns {number}
 */
export function dateToNumber(date) {
  if (isInvalidDate(date)) {
    return 0;
  }

  const dateString = dateToString(date);

  return parseInt(dateString.replace(/-/g, ''), 10);
}

/**
 * @param {string} dateString
 * @returns {Date}
 */
export function dateStringToDate(dateString) {
  

  const [yearStr, monthStr, rawDateStr] = dateString.split('-');

  const dateStr = (rawDateStr || '')
    .split('T')[0]
    .split(' ')[0];

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const date = parseInt(dateStr, 10);

  return new Date(year, month - 1, date);
}
