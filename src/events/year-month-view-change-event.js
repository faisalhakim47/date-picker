/**
 * @typedef {object} YearMonthViewChangeEventDetail
 * @property {number} year
 * @property {number} monthIndex
 * @property {string} monthLabel
 */

/**
 * @extends {CustomEvent<MonthViewChangeEventDetail>}
 */
export class YearMonthViewChangeEvent extends CustomEvent {
  static get EVENT_TYPE() {
    return 'year-month-view-change';
  }

  /** @type {number} */
  #year;

  /** @type {number} */
  #monthIndex;

  /** @type {string} */
  #monthLabel;

  /**
   * @param {number} year
   * @param {number} monthIndex
   * @param {string} monthLabel
   * @param {CustomEventInit<YearMonthViewChangeEventDetail>} [options]
   */
  constructor(year, monthIndex, monthLabel, options) {
    super(YearMonthViewChangeEvent.EVENT_TYPE, {
      ...options,
      detail: {
        ...options?.detail,
        year,
        monthIndex,
        monthLabel,
      },
    });

    this.#monthIndex = monthIndex;
  }

  get year() {
    return this.#year;
  }

  get monthIndex() {
    return this.#monthIndex;
  }

  get monthLabel() {
    return this.#monthLabel;
  }
}
