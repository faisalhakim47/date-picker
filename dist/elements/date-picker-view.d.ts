/** @typedef {import('./date-picker-control.js').SelectionMode} SelectionMode */
export class DatePickerViewElement extends ContextAwareElement {
    static "__#5@#ID_INC": number;
    static "__#5@#STYLES": CSSStyleSheet[];
    static get observedAttributes(): string[];
    connectedCallback(): Promise<void>;
    disconnectedCallback(): Promise<void>;
    get monthNames(): string[];
    get dayShortNames(): string[];
    get yearView(): number;
    get monthIndexView(): number;
    /**
     * @param {Date} [date]
     */
    setSelectedBeginDate(date?: Date): void;
    /**
     * @param {Date} [date]
     */
    setSelectedEndDate(date?: Date): void;
    /**
     * @param {(date: Date) => boolean} filterFn
     */
    setDisabledFilter(filterFn: (date: Date) => boolean): Promise<void>;
    #private;
}
export type SelectionMode = import('./date-picker-control.js').SelectionMode;
import { ContextAwareElement } from './context-aware.js';
