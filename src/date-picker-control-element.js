// @ts-check

import { ContextAwareElement } from './context-aware-element.js';
import { DateValueChangeEvent } from './events/date-value-change-event.js';

// @ts-check

export class DatePickerControlElement extends ContextAwareElement {
  static formAssociated = true;

  #internals = this.attachInternals();

  #date = new Date();

  get value() {
    return this.#date.toISOString();
  }

  /**
   * @param {string} value date iso string
   */
  set value(value) {
    const newDate = new Date(value);
    const isInvalidDate = (value === null || isNaN(newDate.getTime()))
      ? true
      : false;
    if (isInvalidDate) {
      this.#date = null;
      this.#internals.setFormValue('');
      const event = new DateValueChangeEvent(null);
      this.dispatchEvent(event);
    }
    else {
      this.#date = newDate;
      this.#internals.setFormValue(newDate.toISOString());
      const event = new DateValueChangeEvent(newDate);
      this.dispatchEvent(event);
    }
  }

  get dateValue() {
    return this.#date instanceof Date
      ? new Date(this.#date)
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
}
