// @ts-check

import { DateRelatedEvent } from './date-related-event.js';

/** @typedef {import('./date-related-event.js').DateRelatedEventDetail} DateRelatedEventDetail */

export class PickedDateChangeEvent extends DateRelatedEvent {
  static get EVENT_TYPE() {
    return 'picked-date-change';
  }

  /**
   * @param {Date} beginDate
   * @param {Date} endDate
   * @param {CustomEventInit<DateRelatedEventDetail>} [options]
   */
  constructor(beginDate, endDate, options) {
    super(PickedDateChangeEvent.EVENT_TYPE, beginDate, endDate, options);
  }
}
