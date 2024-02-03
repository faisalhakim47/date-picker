/** @typedef {import('../tools/date.js').DateRange} DateRange */
/** @typedef {import('./date-related-event.js').DateRelatedEventDetail} DateRelatedEventDetail */
export class PickedDateSetEvent extends DateRelatedEvent {
    static get EVENT_TYPE(): string;
    /**
     * @param {DateRange} dateRange
     * @param {CustomEventInit<DateRelatedEventDetail>} [options]
     */
    constructor(dateRange: DateRange, options?: CustomEventInit<DateRelatedEventDetail>);
}
export type DateRange = import('../tools/date.js').DateRange;
export type DateRelatedEventDetail = import('./date-related-event.js').DateRelatedEventDetail;
import { DateRelatedEvent } from './date-related-event.js';
