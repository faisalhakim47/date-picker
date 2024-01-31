import { DateRelatedEvent } from './date-related-event.js';

/**
 * @typedef {object} DateValueChangeEventDetail
 * @property {Date} date
 */

/**
 * @extends {CustomEvent<DateValueChangeEventDetail>}
 */
export class DateValueChangeEvent extends DateRelatedEvent {
  static get EVENT_TYPE() {
    return 'date-value-change';
  }

  /**
   * @param {Date} date
   * @param {CustomEventInit<DateValueChangeEventDetail>} [options]
   */
  constructor(date, options) {
    super(DateValueChangeEvent.EVENT_TYPE, date, options);
  }
}
