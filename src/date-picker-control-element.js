// @ts-check

import { ContextAwareElement } from './context-aware-element.js';
import { PickedDateSetEvent } from './events/picked-date-set-event.js';

// @ts-check

/**
 * @typedef {'day'} TimeUnit
 */
``
/**
 * @typedef {'single'|'range'} SelectionMode
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

  get timeUnit() {
    return this.#timeUnit;
  }

  /**
   * @param {TimeUnit} timeUnit
   */
  set timeUnit(timeUnit) {
    if (!DatePickerControlElement.#AVAILABLE_TIME_UNITS.includes(timeUnit)) {
      throw new Error('Invalid time unit');
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
      throw new Error('Invalid selection mode');
    }

    this.#selectionMode = selectionMode;
  }

  get value() {
    return this.#beginDate.toISOString();
  }

  /**
   * @param {string} value date iso string
   */
  set value(value) {
    const [beginDateStr, endDateStr] = (value ?? '').split('/');

    const beginDate = beginDateStr
      ? new Date(beginDateStr)
      : new Date(Infinity);

    const endDate = endDateStr
      ? new Date(endDateStr)
      : new Date(Infinity);

    const isInvalidBeginDate = (value === null || isNaN(beginDate.getTime()));
    const isInvalidEndDate = (value === null || isNaN(endDate.getTime()));

    if (isInvalidBeginDate) {
      this.#beginDate = null;
      this.#internals.setFormValue(null);
      this.dispatchEvent(new PickedDateSetEvent(null, null));
    }
    else {
      const beginDateStr = this.#dateStringFormat(beginDate);
      this.#beginDate = beginDate;

      if (isInvalidEndDate) {
        this.#internals.setFormValue(beginDateStr);
        this.dispatchEvent(new PickedDateSetEvent(beginDate, null));
      }
      else {
        const endDateStr = this.#dateStringFormat(endDate);
        this.#endDate = endDate;
        this.#internals.setFormValue(`${beginDateStr}/${endDateStr}`);
        this.dispatchEvent(new PickedDateSetEvent(beginDate, endDate));
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

  checkValidity() {
    return this.#internals.checkValidity();
  }

  reportValidity() {
    return this.#internals.reportValidity();
  }

  /**
   * @param {Date} beginDate
   * @param {Date} endDate
   */
  setDateRangeValues(beginDate, endDate) {
    const beginTime = beginDate.getTime();
    const endTime = endDate.getTime();
    const isInvalidBeginDate = (beginDate === null || isNaN(beginTime));
    const isInvalidEndDate = (endDate === null || isNaN(endTime));

    if (isInvalidBeginDate) {
      throw new Error('Invalid begin date');
    }

    if (isInvalidEndDate) {
      throw new Error('Invalid end date');
    }

    if (beginTime > endTime) {
      throw new Error('Invalid date range');
    }

    this.#beginDate = beginDate;
    this.#endDate = endDate;

    this.dispatchEvent(new PickedDateSetEvent(beginDate, endDate));
  }

  /**
   * @param {Date} date
   */
  #dateStringFormat(date) {
    if (this.#timeUnit === DatePickerControlElement.TIME_UNIT_DAY) {
      return date.toISOString().split('T')[0];
    }
    else {
      throw new Error('Invalid time unit');
    }
  }
}
