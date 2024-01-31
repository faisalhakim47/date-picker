import { ContextAwareElement } from './context-aware-element.js';
import { DateValueChangeEvent } from './events/date-value-change-event.js';

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
    this.#date = new Date(value);
    this.#internals.setFormValue(this.#date.toISOString());
    const event = DateValueChangeEvent(this.#date);
    this.dispatchEvent(event);
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
