// @ts-check

import { SelectedDateSetEvent } from '../events/selected-date-set-event.js';
import { dateStringToDate, dateToString, isInvalidDate } from '../tools/date.js';

import { ContextAwareElement } from './context-aware.js';

/** @typedef {import('../events/selection-mode-set-event.js').SelectionMode} SelectionMode */

/**
 * @typedef {'day'} TimeUnit
 */

export class DatePickerControlElement extends ContextAwareElement {
  static get formAssociated() {
    return true;
  }

  /** @type {TimeUnit} */
  static TIME_UNIT_DAY = 'day';

  /** @type {SelectionMode} */
  static SELECTION_MODE_SINGLE = 'single';

  /** @type {SelectionMode} */
  static SELECTION_MODE_RANGE = 'range';

  static #AVAILABLE_TIME_UNITS = [
    DatePickerControlElement.TIME_UNIT_DAY,
  ];

  static #AVAILABLE_SELECTION_MODES = [
    DatePickerControlElement.SELECTION_MODE_SINGLE,
    DatePickerControlElement.SELECTION_MODE_RANGE,
  ];

  #internals = this.attachInternals();

  /** @type {TimeUnit} */
  #timeUnit = 'day';

  /** @type {SelectionMode} */
  #selectionMode = 'single';

  /** @type {Date} */
  #beginDate;

  /** @type {Date} */
  #endDate;

  connectedCallback() {
    if (this.hasAttribute('value')) {
      this.value = this.getAttribute('value');
    }

    if (this.hasAttribute('time-unit')) {
      /** @type {any} */
      const timeUnit = this.getAttribute('time-unit');
      this.timeUnit = timeUnit;
    }

    if (this.hasAttribute('selection-mode')) {
      /** @type {any} */
      const selectionMode = this.getAttribute('selection-mode');
      this.selectionMode = selectionMode;
    }
  }

  get timeUnit() {
    return this.#timeUnit;
  }

  /**
   * @param {TimeUnit} timeUnit
   */
  set timeUnit(timeUnit) {
    if (!DatePickerControlElement.#AVAILABLE_TIME_UNITS.includes(timeUnit)) {
      console.warn('Invalid time unit', timeUnit);
      return;
    }

    this.#timeUnit = timeUnit;
  }

  get selectionMode() {
    return this.#selectionMode;
  }

  /**
   * @param {any} selectionMode
   */
  set selectionMode(selectionMode) {
    if (!DatePickerControlElement.#AVAILABLE_SELECTION_MODES.includes(selectionMode)) {
      console.warn('Invalid selection mode', selectionMode);
      return;
    }

    this.#selectionMode = selectionMode;
  }

  get value() {
    /** @type {(date: Date) => string} */
    let dateFormatter = null;

    if (this.#timeUnit === DatePickerControlElement.TIME_UNIT_DAY) {
      dateFormatter = dateToString;
    }
    else {
      throw new Error('Invalid time unit');
    }

    if (this.#selectionMode === DatePickerControlElement.SELECTION_MODE_RANGE) {
      return (this.#beginDate instanceof Date && this.#endDate instanceof Date)
        ? `${dateFormatter(this.#beginDate)}/${dateFormatter(this.#endDate)}`
        : null;
    }
    else if (this.#selectionMode === DatePickerControlElement.SELECTION_MODE_SINGLE) {
      return this.#beginDate instanceof Date
        ? dateFormatter(this.#beginDate)
        : null;
    }
    else {
      throw new Error('Invalid selection mode');
    }
  }

  /**
   * @param {string} value
   */
  set value(value) {
    if (!value) {
      this.#beginDate = null;
      this.#endDate = null;
      this.#internals.setFormValue(null);
      this.removeAttribute('value');
      this.dispatchEvent(new SelectedDateSetEvent({
        beginDate: null,
        endDate: null,
      }));
      return;
    }

    /** @type {(dateStr: string) => Date} */
    let dateParserFn = null;

    if (this.#timeUnit === DatePickerControlElement.TIME_UNIT_DAY) {
      dateParserFn = dateStringToDate;
    }
    else {
      throw new Error('Invalid time unit');
    }

    if (this.#selectionMode === DatePickerControlElement.SELECTION_MODE_RANGE) {
      if (!value?.includes('/')) {
        console.warn('Invalid date range format', value);
        return;
      }

      const [beginDateStr, endDateStr] = value.split('/');

      const beginDate = dateParserFn(beginDateStr);
      const endDate = dateParserFn(endDateStr);

      if (isInvalidDate(beginDate)) {
        this.#beginDate = null;
        this.#endDate = null;
        this.#internals.setFormValue(null);
        this.removeAttribute('value');
        this.dispatchEvent(new SelectedDateSetEvent({
          beginDate: null,
          endDate: null,
        }));
      }
      else {
        this.#beginDate = beginDate;

        if (isInvalidDate(endDate)) {
          this.#endDate = null;
          this.#internals.setFormValue(beginDateStr);
          this.dispatchEvent(new SelectedDateSetEvent({
            beginDate,
            endDate: null,
          }));
        }
        else {
          this.#endDate = endDate;
          this.#internals.setFormValue(`${beginDateStr}/${endDateStr}`);
          this.dispatchEvent(new SelectedDateSetEvent({
            beginDate,
            endDate,
          }));
        }
      }
    }
    else if (this.#selectionMode === DatePickerControlElement.SELECTION_MODE_SINGLE) {
      const date = dateParserFn(value);

      if (isInvalidDate(date)) {
        this.#beginDate = null;
        this.#internals.setFormValue(null);
        this.removeAttribute('value');
        this.dispatchEvent(new SelectedDateSetEvent({
          beginDate: null,
          endDate: null,
        }));
      }
      else {
        this.#beginDate = date;
        this.#internals.setFormValue(dateToString(date));
        this.dispatchEvent(new SelectedDateSetEvent({
          beginDate: date,
          endDate: null,
        }));
      }
    }
    else {
      throw new Error('Invalid selection mode');
    }

    const [beginDateStr, endDateStr] = (value ?? '').split('/');

    const beginDate = beginDateStr
      ? new Date(beginDateStr)
      : new Date(Infinity);

    const endDate = endDateStr
      ? new Date(endDateStr)
      : new Date(Infinity);

    const isInvalidBeginDate = isInvalidDate(beginDate);
    const isInvalidEndDate = isInvalidDate(endDate);

    if (isInvalidBeginDate) {
      this.#beginDate = null;
      this.#endDate = null;
      this.#internals.setFormValue(null);
      this.removeAttribute('value');
      this.dispatchEvent(new SelectedDateSetEvent({
        beginDate: null,
        endDate: null,
      }));
    }
    else {
      const beginDateStr = dateToString(beginDate);
      this.#beginDate = beginDate;

      if (isInvalidEndDate) {
        this.#endDate = null;
        this.#internals.setFormValue(beginDateStr);
        this.dispatchEvent(new SelectedDateSetEvent({
          beginDate,
          endDate: null,
        }));
      }
      else {
        const endDateStr = dateToString(endDate);
        this.#endDate = endDate;
        this.#internals.setFormValue(`${beginDateStr}/${endDateStr}`);
        this.dispatchEvent(new SelectedDateSetEvent({
          beginDate,
          endDate,
        }));
      }
    }
  }

  get beginDateValue() {
    return this.#beginDate instanceof Date
      ? new Date(this.#beginDate)
      : null;
  }

  get endDateValue() {
    return this.#endDate instanceof Date
      ? new Date(this.#endDate)
      : null;
  }

  get form() {
    return this.#internals.form;
  }

  get name() {
    return this.attributes.getNamedItem('name')?.nodeValue;
  }

  get type() {
    return this.localName;
  }

  get validity() {
    return this.#internals.validity;
  }

  get validationMessage() {
    return this.#internals.validationMessage;
  }

  get willValidate() {
    return this.#internals.willValidate;
  }

  /**
   * @param {Date} beginDate when selectionMode is single, this is the selected date
   * @param {Date} [endDate] only used when selectionMode is range
   */
  setDateValue(beginDate, endDate) {
    if (this.selectionMode === DatePickerControlElement.SELECTION_MODE_SINGLE) {
      const date = beginDate;

      if (isInvalidDate(date)) {
        console.warn('Invalid date', date);
        return;
      }

      this.value = dateToString(date);
    }
    else if (this.selectionMode === DatePickerControlElement.SELECTION_MODE_RANGE) {
      if (isInvalidDate(beginDate) || isInvalidDate(endDate)) {
        console.warn('Invalid date range', {
          beginDate,
          endDate,
        });
        return;
      }

      if (beginDate.getTime() > endDate.getTime()) {
        console.warn('Invalid date range', {
          beginDate,
          endDate,
        });
        return;
      }

      const beginDateString = dateToString(beginDate);
      const endDateString = dateToString(endDate);

      this.value = `${beginDateString}/${endDateString}`;
    }
    else {
      throw new Error(`Invalid selection mode: ${this.selectionMode}`);
    }
  }

  checkValidity() {
    return this.#internals.checkValidity();
  }

  reportValidity() {
    return this.#internals.reportValidity();
  }
}
