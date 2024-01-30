/**
 * @typedef {object} MonthViewChangeEventDetail
 * @property {number} month
 */

/**
 * @extends {CustomEvent<MonthViewChangeEventDetail>}
 */
export class MonthViewChangeEvent extends CustomEvent {
  static get EVENT_TYPE() {
    return 'month-view-change';
  }

  /** @type {number} */
  #month;

  /**
   * @param {number} month
   * @param {CustomEventInit<MonthViewChangeEventDetail>} [options]
   */
  constructor(month, options) {
    super(MonthViewChangeEvent.EVENT_TYPE, {
      ...options,
      detail: {
        ...options?.detail,
        month,
      },
    });

    this.#month = month;
  }

  get monthIndex() {
    return this.#month;
  }
}
