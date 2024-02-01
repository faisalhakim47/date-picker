// @ts-check

/**
 * @typedef {object} CalendarViewChangeEventDetail
 */

/**
 * @extends {CustomEvent<CalendarViewChangeEventDetail>}
 */
export class CalendarViewChangeEvent extends CustomEvent {
  static get EVENT_TYPE() {
    return 'calendar-view-change';
  }

  /**
   * @param {CustomEventInit<CalendarViewChangeEventDetail>} [options]
   */
  constructor(options) {
    super(CalendarViewChangeEvent.EVENT_TYPE, options);
  }
}
