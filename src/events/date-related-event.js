// @ts-check

/** @typedef {import('../tools/date.js').DateRange} DateRange */

/** @typedef {DateRange} DateRelatedEventDetail */

/**
 * @extends {CustomEvent<DateRelatedEventDetail>}
 */
export class DateRelatedEvent extends CustomEvent {
  /** @type {Date} */
  #beginDate;

  /** @type {Date} */
  #endDate;

  /**
   * @param {string} type
   * @param {DateRange} dateRange
   * @param {CustomEventInit<DateRelatedEventDetail>} [options]
   */
  constructor(type, dateRange, options) {
    super(type, {
      ...options,
      detail: {
        ...options?.detail,
        ...dateRange,
      },
    });

    this.#beginDate = dateRange.beginDate;
    this.#endDate = dateRange.endDate;
  }

  get beginDate() {
    return this.#beginDate;
  }

  get endDate() {
    return this.#endDate;
  }
}
