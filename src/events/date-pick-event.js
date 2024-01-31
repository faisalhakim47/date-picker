// @ts-check

import { DateRelatedEvent } from './date-related-event.js';

/** @typedef {import('./date-related-event.js').DateRelatedEventDetail} DateRelatedEventDetail */

export class DatePickEvent extends DateRelatedEvent {
  static get EVENT_TYPE() {
    return 'date-pick';
  }

  /**
   * @param {Date} date
   * @param {CustomEventInit<DateRelatedEventDetail>} [options]
   */
  constructor(date, options) {
    super(DatePickEvent.EVENT_TYPE, date, options);
  }
}
