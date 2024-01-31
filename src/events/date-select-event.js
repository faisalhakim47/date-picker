// @ts-check

import { DateRelatedEvent } from './date-related-event.js';

/** @typedef {import('./date-related-event.js').DateRelatedEventDetail} DateRelatedEventDetail */

export class DateSelectEvent extends DateRelatedEvent {
  static get EVENT_TYPE() {
    return 'date-select';
  }

  /**
   * @param {Date} date
   * @param {CustomEventInit<DateRelatedEventDetail>} [options]
   */
  constructor(date, options) {
    super(DateSelectEvent.EVENT_TYPE, date, options);
  }
}
