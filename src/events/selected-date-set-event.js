// @ts-check

import { DateRelatedEvent } from './date-related-event.js';

/** @typedef {import('./date-related-event.js').DateRelatedEventDetail} DateRelatedEventDetail */

export class SelectedDateSetEvent extends DateRelatedEvent {
  static get EVENT_TYPE() {
    return 'selected-date-set';
  }

  /**
   * @param {Date} date
   * @param {CustomEventInit<DateRelatedEventDetail>} [options]
   */
  constructor(date, options) {
    super(SelectedDateSetEvent.EVENT_TYPE, date, options);
  }
}
