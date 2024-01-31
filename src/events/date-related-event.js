// @ts-check

/**
 * @typedef {object} DateRelatedEventDetail
 * @property {Date} date
 */

/**
 * @extends {CustomEvent<DateRelatedEventDetail>}
 */
export class DateRelatedEvent extends CustomEvent {
  /** @type {Date} */
  #date;

  /**
   * @param {string} type
   * @param {Date} date
   * @param {CustomEventInit<DateRelatedEventDetail>} [options]
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
