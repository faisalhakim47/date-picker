// @ts-check

import { DateRelatedEvent } from './date-related-event.js';

/** @typedef {import('../tools/date.js').DateRange} DateRange */
/** @typedef {import('./date-related-event.js').DateRelatedEventDetail} DateRelatedEventDetail */

export class PickedDateChangeEvent extends DateRelatedEvent {
  static get EVENT_TYPE() {
    return 'change';
  }

  /**
   * @param {DateRange} dateRange
   * @param {CustomEventInit<DateRelatedEventDetail>} [options]
   */
  constructor(dateRange, options) {
    super(PickedDateChangeEvent.EVENT_TYPE, dateRange, options);
  }
}
