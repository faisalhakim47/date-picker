// @ts-check

import { DatePickerElement } from './date-picker-element.js';
import { DatePickerViewElement } from './date-picker-view-element.js';
import { DatePickerYearViewElement } from './date-picker-year-view-element.js';
import { DatePickerMonthViewElement } from './date-picker-month-view-element.js';
import { DatePickerInlineElement } from './date-picker-inline-element.js';

declare global {
  interface HTMLElementTagNameMap {
    'date-picker': DatePickerElement;
    'date-picker-inline': DatePickerInlineElement;
    'date-picker-view': DatePickerViewElement;
    'date-picker-year-view': DatePickerYearViewElement;
    'date-picker-month-view': DatePickerMonthViewElement;
  }
}
