/**
 * @typedef {object} CalendarViewChangeEventDetail
 */
/**
 * @extends {CustomEvent<CalendarViewChangeEventDetail>}
 */
export class CalendarViewChangeEvent extends CustomEvent<any> {
    static get EVENT_TYPE(): string;
    /**
     * @param {CustomEventInit<CalendarViewChangeEventDetail>} [options]
     */
    constructor(options?: CustomEventInit<CalendarViewChangeEventDetail>);
}
export type CalendarViewChangeEventDetail = object;
