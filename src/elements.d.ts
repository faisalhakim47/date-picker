import { DatePickerElement } from './date-picker-element.js';
import { DatePickerInlineElement } from './date-picker-inline-element.js';
import { DatePickerYearViewElement } from './date-picker-year-view-element.js';
import { DatePickerMonthViewElement } from './date-picker-month-view-element.js';

declare global {
  interface HTMLElementTagNameMap {
    'date-picker': DatePickerElement;
    'date-picker-inline': DatePickerInlineElement;
    'date-picker-year-view': DatePickerYearViewElement;
    'date-picker-month-view': DatePickerMonthViewElement;
  }
}
