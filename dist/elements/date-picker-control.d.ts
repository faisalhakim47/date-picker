/** @typedef {import('../events/selection-mode-set-event.js').SelectionMode} SelectionMode */
/**
 * @typedef {'day'} TimeUnit
 */
export class DatePickerControlElement extends ContextAwareElement {
    static get formAssociated(): boolean;
    /** @type {TimeUnit} */
    static TIME_UNIT_DAY: TimeUnit;
    /** @type {SelectionMode} */
    static SELECTION_MODE_SINGLE: SelectionMode;
    /** @type {SelectionMode} */
    static SELECTION_MODE_RANGE: SelectionMode;
    static "__#5@#AVAILABLE_TIME_UNITS": "day"[];
    static "__#5@#AVAILABLE_SELECTION_MODES": import("../events/selection-mode-set-event.js").SelectionMode[];
    connectedCallback(): void;
    /**
     * @param {string} value
     */
    set value(value: string);
    get value(): string;
    /**
     * @param {TimeUnit} timeUnit
     */
    set timeUnit(timeUnit: "day");
    get timeUnit(): "day";
    /**
     * @param {any} selectionMode
     */
    set selectionMode(selectionMode: any);
    get selectionMode(): any;
    get beginDateValue(): Date;
    get endDateValue(): Date;
    get form(): HTMLFormElement;
    get name(): string;
    get type(): string;
    get validity(): ValidityState;
    get validationMessage(): string;
    get willValidate(): boolean;
    /**
     * @param {Date} beginDate when selectionMode is single, this is the selected date
     * @param {Date} [endDate] only used when selectionMode is range
     */
    setDateValue(beginDate: Date, endDate?: Date): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
    #private;
}
export type SelectionMode = import('../events/selection-mode-set-event.js').SelectionMode;
export type TimeUnit = 'day';
import { ContextAwareElement } from './context-aware.js';
