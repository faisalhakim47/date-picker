import { DateRelatedEvent } from './date-related-event.js';

/**
 * @typedef {object} DateSelectEventDetail
 * @property {Date} date
 */

/**
 * @extends {CustomEvent<DateSelectEventDetail>}
 */
export class DateSelectEvent extends DateRelatedEvent {
  static get EVENT_TYPE() {
    return 'date-select';
  }

  /**
   * @param {Date} date
   * @param {CustomEventInit<DateSelectEventDetail>} [options]
   */
  constructor(date, options) {
    super(DateSelectEvent.EVENT_TYPE, date, options);
  }
}
