/**
 * @typedef {object} DateEventDetail
 * @property {Date} date
 */

/**
 * @extends {CustomEvent<DateEventDetail>}
 */
export class DateRelatedEvent extends CustomEvent {
  /** @type {Date} */
  #date;

  /**
   * @param {string} type
   * @param {Date} date
   * @param {CustomEventInit<DateEventDetail>} [options]
   */
  constructor(type, date, options) {
    super(type, {
      ...options,
      detail: {
        ...options?.detail,
        date,
      },
    });

    this.#date = date;
  }

  get date() {
    return this.#date;
  }
}
