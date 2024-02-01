// @ts-check

/**
 * @typedef {object} DateRelatedEventDetail
 * @property {Date} beginDate
 * @property {Date} endDate
 */

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
   * @param {Date} beginDate
   * @param {Date} endDate
   * @param {CustomEventInit<DateRelatedEventDetail>} [options]
   */
  constructor(type, beginDate, endDate, options) {
    super(type, {
      ...options,
      detail: {
        ...options?.detail,
        beginDate,
        endDate,
      },
    });

    this.#beginDate = beginDate;
    this.#endDate = endDate;
  }

  get beginDate() {
    return this.#beginDate;
  }

  get endDate() {
    return this.#endDate;
  }
}
