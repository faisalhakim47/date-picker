export class DatePickerDialogElement extends DatePickerControlElement {
    static "__#10@#STYLES": CSSStyleSheet[];
    static get observedAttributes(): string[];
    connectedCallback(): Promise<void>;
    disconnectedCallback(): Promise<void>;
    /**
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    requestSubmit: () => void;
    closeDatePicker(): void;
    #private;
}
import { DatePickerControlElement } from './date-picker-control.js';
