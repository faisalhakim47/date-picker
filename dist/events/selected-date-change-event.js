// @ts-check
import { DateRelatedEvent } from './date-related-event.js';
/** @typedef {import('../tools/date.js').DateRange} DateRange */
/** @typedef {import('./date-related-event.js').DateRelatedEventDetail} DateRelatedEventDetail */
export class SelectedDateChangeEvent extends DateRelatedEvent {
    static get EVENT_TYPE() {
        return 'selected-date-change';
    }
    /**
     * @param {DateRange} dateRange
     * @param {CustomEventInit<DateRelatedEventDetail>} [options]
     */
    constructor(dateRange, options) {
        super(SelectedDateChangeEvent.EVENT_TYPE, dateRange, options);
    }
}
//# sourceMappingURL=selected-date-change-event.js.map