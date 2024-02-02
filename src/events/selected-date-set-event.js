// @ts-check

import { DateRelatedEvent } from './date-related-event.js';

/** @typedef {import('../tools/date.js').DateRange} DateRange */
/** @typedef {import('./date-related-event.js').DateRelatedEventDetail} DateRelatedEventDetail */

export class SelectedDateSetEvent extends DateRelatedEvent {
  static get EVENT_TYPE() {
    return 'selected-date-set';
  }

  /**
   * @param {DateRange} dateRange
   * @param {CustomEventInit<DateRelatedEventDetail>} [options]
   */
  constructor(dateRange, options) {
    super(SelectedDateSetEvent.EVENT_TYPE, dateRange, options);
  }
}
