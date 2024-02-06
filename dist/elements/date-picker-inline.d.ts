export class DatePickerInlineElement extends DatePickerControlElement {
    static "__#10@#STYLES": CSSStyleSheet[];
    static get observedAttributes(): string[];
    connectedCallback(): Promise<void>;
    disconnectedCallback(): Promise<void>;
    /**
     * @param {string} name
     * @param {string} oldValue
     * @param {any} newValue
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: any): Promise<void>;
    #private;
}
import { DatePickerControlElement } from './date-picker-control.js';
