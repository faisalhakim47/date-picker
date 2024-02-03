// @ts-check
import { DateRelatedEvent } from './date-related-event.js';
/** @typedef {import('../tools/date.js').DateRange} DateRange */
/** @typedef {import('./date-related-event.js').DateRelatedEventDetail} DateRelatedEventDetail */
export class PickedDateSetEvent extends DateRelatedEvent {
    static get EVENT_TYPE() {
        return 'picked-date-set';
    }
    /**
     * @param {DateRange} dateRange
     * @param {CustomEventInit<DateRelatedEventDetail>} [options]
     */
    constructor(dateRange, options) {
        super(PickedDateSetEvent.EVENT_TYPE, dateRange, options);
    }
}
//# sourceMappingURL=picked-date-set-event.js.map