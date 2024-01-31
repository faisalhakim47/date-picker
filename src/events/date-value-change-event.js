// @ts-check

import { DateRelatedEvent } from './date-related-event.js';

/** @typedef {import('./date-related-event.js').DateRelatedEventDetail} DateRelatedEventDetail */

export class DateValueChangeEvent extends DateRelatedEvent {
  static get EVENT_TYPE() {
    return 'date-value-change';
  }

  /**
   * @param {Date} date
   * @param {CustomEventInit<DateRelatedEventDetail>} [options]
   */
  constructor(date, options) {
    super(DateValueChangeEvent.EVENT_TYPE, date, options);
  }
}
