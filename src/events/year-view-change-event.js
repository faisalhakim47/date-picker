/**
 * @typedef {object} YearViewChangeEventDetail
 * @property {number} year
 */

/**
 * @extends {CustomEvent<YearViewChangeEventDetail>}
 */
export class YearViewChangeEvent extends CustomEvent {
  static get EVENT_TYPE() {
    return 'year-view-change';
  }

  /** @type {number} */
  #year;

  /**
   * @param {number} year
   * @param {CustomEventInit<YearViewChangeEventDetail>} [options]
   */
  constructor(year, options) {
    super(YearViewChangeEvent.EVENT_TYPE, {
      ...options,
      detail: {
        ...options?.detail,
        year,
      },
    });

    this.#year = year;
  }

  get year() {
    return this.#year;
  }
}
