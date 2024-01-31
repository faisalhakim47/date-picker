import { DateRelatedEvent } from './date-related-event.js';

/**
 * @typedef {object} SelectedDateSetEventDetail
 * @property {Date} date
 */

/**
 * @extends {CustomEvent<SelectedDateSetEventDetail>}
 */
export class SelectedDateSetEvent extends DateRelatedEvent {
  static get EVENT_TYPE() {
    return 'selected-date-set';
  }

  /**
   * @param {Date} date
   * @param {CustomEventInit<SelectedDateSetEventDetail>} [options]
   */
  constructor(date, options) {
    super(SelectedDateSetEvent.EVENT_TYPE, date, options);
  }
}
