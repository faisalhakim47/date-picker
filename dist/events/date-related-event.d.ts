/** @typedef {import('../tools/date.js').DateRange} DateRange */
/** @typedef {DateRange} DateRelatedEventDetail */
/**
 * @extends {CustomEvent<DateRelatedEventDetail>}
 */
export class DateRelatedEvent extends CustomEvent<import("../tools/date.js").DateRange> {
    /**
     * @param {string} type
     * @param {DateRange} dateRange
     * @param {CustomEventInit<DateRelatedEventDetail>} [options]
     */
    constructor(type: string, dateRange: DateRange, options?: CustomEventInit<DateRelatedEventDetail>);
    get beginDate(): Date;
    get endDate(): Date;
    #private;
}
export type DateRange = import('../tools/date.js').DateRange;
export type DateRelatedEventDetail = DateRange;
