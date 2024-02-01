// @ts-check

import { DateRelatedEvent } from './date-related-event.js';

/** @typedef {import('./date-related-event.js').DateRelatedEventDetail} DateRelatedEventDetail */

export class SelectedDateSetEvent extends DateRelatedEvent {
  static get EVENT_TYPE() {
    return 'selected-date-set';
  }

  /**
   * @param {Date} beginDate
   * @param {Date} endDate
   * @param {CustomEventInit<DateRelatedEventDetail>} [options]
   */
  constructor(beginDate, endDate, options) {
    super(SelectedDateSetEvent.EVENT_TYPE, beginDate, endDate, options);
  }
}
