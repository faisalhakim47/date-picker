export class DatePickerYearViewElement extends ContextAwareElement {
    static get requiredContexts(): (typeof DatePickerViewElement)[];
    connectedCallback(): Promise<void>;
    disconnectedCallback(): Promise<void>;
    #private;
}
import { ContextAwareElement } from './context-aware.js';
import { DatePickerViewElement } from './date-picker-view.js';
