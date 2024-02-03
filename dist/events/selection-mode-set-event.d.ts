/** @typedef {import('../tools/date.js').DateRange} DateRange */
/** @typedef {import('./date-related-event.js').DateRelatedEventDetail} DateRelatedEventDetail */
/** @typedef {'single'|'range'} SelectionMode */
/**
 * @typedef {object} SelectionModeSetEventDetail
 * @property {SelectionMode} selectionMode
 */
/**
 * @extends {CustomEvent<SelectionModeSetEventDetail>}
 */
export class SelectionModeSetEvent extends CustomEvent<SelectionModeSetEventDetail> {
    static get EVENT_TYPE(): string;
    /**
     * @param {SelectionMode} selectionMode
     * @param {CustomEventInit<SelectionModeSetEventDetail>} [options]
     */
    constructor(selectionMode: SelectionMode, options?: CustomEventInit<SelectionModeSetEventDetail>);
    get selectionMode(): SelectionMode;
    #private;
}
export type DateRange = import('../tools/date.js').DateRange;
export type DateRelatedEventDetail = import('./date-related-event.js').DateRelatedEventDetail;
export type SelectionMode = 'single' | 'range';
export type SelectionModeSetEventDetail = {
    selectionMode: SelectionMode;
};
