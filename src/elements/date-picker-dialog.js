// @ts-check

import '../components/f-date-picker-view.js';
import { PickedDateChangeEvent } from '../events/picked-date-change-event.js';
import { PickedDateSetEvent } from '../events/picked-date-set-event.js';
import { SelectedDateChangeEvent } from '../events/selected-date-change-event.js';
import { SelectedDateSetEvent } from '../events/selected-date-set-event.js';
import { dateRangeToString, dateToString } from '../tools/date.js';
import { at, el, on, tx } from '../tools/dom.js';

import { DatePickerControlElement } from './date-picker-control.js';

export class DatePickerDialogElement extends DatePickerControlElement {
  static #STYLES = (function () {
    const style = new CSSStyleSheet();

    style.replace(`
:host {
  --si-input-button-height: 36px;
  --si-submit-button-height: 36px;
  --si-dialog-radius: 4px;
  --si-dialog-padding: 16px;
}
button {
  display: block;
  padding: 0 8px;
  height: var(--si-input-button-height);
}
dialog {
  border: none;
  padding: var(--si-dialog-padding);
  border-radius: var(--si-dialog-radius);
}
dialog > form > slot > div {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}
dialog > form > slot > div > button {
  display: block;
  padding: 0 8px;
  height: var(--si-submit-button-height);
}
    `);

    return [style];
  })();

  static get formAssociated() {
    return true;
  }

  static get observedAttributes() {
    return [
      'open',
      'value',
    ];
  }

  #shadowRoot = this.attachShadow({ mode: 'closed' });

  /** @type {Text} */
  #buttonText;

  /** @type {HTMLDialogElement} */
  #dialog;

  /** @type {HTMLFormElement} */
  #form;

  /** @type {Date} */
  #selectedBeginDate;

  /** @type {Date} */
  #selectedEndDate;

  async connectedCallback() {
    const controlCtx = await this.requireContext(DatePickerControlElement);

    controlCtx.addEventListener(PickedDateChangeEvent.EVENT_TYPE, this.#handlePickedDateChange);
    controlCtx.addEventListener(PickedDateSetEvent.EVENT_TYPE, this.#handlePickedDateSet);
    controlCtx.addEventListener(SelectedDateChangeEvent.EVENT_TYPE, this.#handleSelectedDateChange);

    super.connectedCallback();

    this.#shadowRoot.adoptedStyleSheets = DatePickerDialogElement.#STYLES;

    this.#render();

    this.#dialog.addEventListener('open', this.#handleDialogOpen);
    this.#dialog.addEventListener('close', this.#handleDialogClose);

    if (this.hasAttribute('open')) {
      this.#openDatePicker();
    }
    else {
      this.#closeDatePicker();
    }

    this.#updateButtonText();
  }

  async disconnectedCallback() {
    this.#dialog.removeEventListener('open', this.#handleDialogOpen);
    this.#dialog.removeEventListener('close', this.#handleDialogClose);

    const controlCtx = await this.requireContext(DatePickerControlElement);

    controlCtx.removeEventListener(PickedDateChangeEvent.EVENT_TYPE, this.#handlePickedDateChange);
    controlCtx.removeEventListener(PickedDateSetEvent.EVENT_TYPE, this.#handlePickedDateSet);
    controlCtx.removeEventListener(SelectedDateChangeEvent.EVENT_TYPE, this.#handleSelectedDateChange);
  }

  /**
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open') {
      if (newValue === null) {
        this.#closeDatePicker();
      }
      else {
        this.#openDatePicker();
      }
    }
    else if (name === 'value') {
      if (newValue === null) {
        this.value = null;
      }
      else {
        this.value = newValue;
      }
      this.#updateButtonText();
    }
  }

  requestSubmit = () => {
    this.#form.requestSubmit();
  };

  closeDatePicker() {
    this.#closeDatePicker();
  }

  #updateButtonText() {
    if (this.beginDateValue instanceof Date) {
      if (this.#buttonText instanceof Text) {
        this.#buttonText.nodeValue = `Selected Date: ${this.value}`;
      }
    }
    else {
      if (this.#buttonText instanceof Text) {
        this.#buttonText.nodeValue = 'Select Date';
      }
    }
  }

  #openDatePicker = async () => {
    if (this.#dialog instanceof HTMLDialogElement) {
      const controlCtx = await this.requireContext(DatePickerControlElement);

      controlCtx.dispatchEvent(new SelectedDateSetEvent({
        beginDate: this.#selectedBeginDate,
        endDate: this.#selectedEndDate,
      }));

      this.#dialog.showModal();

      if (!this.hasAttribute('open')) {
        this.setAttribute('open', '');
      }
    }
  };

  #closeDatePicker = () => {
    if (this.#dialog instanceof HTMLDialogElement) {
      this.#dialog.close();
    }
  };

  #handleDialogOpen = async () => {
    if (!this.hasAttribute('open')) {
      this.setAttribute('open', '');
    }
  };

  #handleDialogClose = () => {
    if (this.hasAttribute('open')) {
      this.removeAttribute('open');
    }
  };

  /**
   * @param {Event} event
   */
  #handleSelectedDateChange = (event) => {
    if (event instanceof SelectedDateChangeEvent) {
      const { beginDate, endDate } = event.detail;

      this.#selectedBeginDate = beginDate;
      this.#selectedEndDate = endDate;
    }
  };

  /**
   * @param {Event} event
   */
  #handlePickedDateChange = (event) => {
    if (event instanceof PickedDateChangeEvent) {
      this.#updateButtonText();
    }
  };

  /**
   * @param {Event} event
   */
  #handlePickedDateSet = (event) => {
    if (event instanceof PickedDateSetEvent) {
      const { beginDate, endDate } = event.detail;

      this.#selectedBeginDate = beginDate;
      this.#selectedEndDate = endDate;

      this.#updateButtonText();
    }
  };

  #handleFormSubmit = () => {
    if (this.selectionMode === DatePickerControlElement.SELECTION_MODE_SINGLE) {
      this.value = dateToString(this.#selectedBeginDate);
    }
    else if (this.selectionMode === DatePickerControlElement.SELECTION_MODE_RANGE) {
      this.value = dateRangeToString({
        beginDate: this.#selectedBeginDate,
        endDate: this.#selectedEndDate,
      });
    }
    else {
      throw new Error('Invalid selection mode');
    }

    this.#updateButtonText();
  };

  #render() {
    this.#shadowRoot.appendChild(el('div', () => [
      el('slot', () => [
        at('name', 'date-picker-controls'),
        el('button', () => [
          on('click', this.#openDatePicker),
          this.#buttonText = tx('Select Date'),
        ]),
      ]),
      this.#dialog = el('dialog', () => [
        this.#form = el('form', () => [
          at('method', 'dialog'),
          on('submit', this.#handleFormSubmit),
          el('slot', () => [
            at('name', 'date-picker-view'),
            el('f-date-picker-view', () => []),
          ]),
          el('slot', () => [
            at('name', 'form-controls'),
            el('div', () => [
              el('button', () => [
                at('type', 'button'),
                on('click', this.#closeDatePicker),
                tx('Cancel'),
              ]),
              el('button', () => [
                at('type', 'submit'),
                tx('Apply'),
              ]),
            ]),
          ]),
        ]),
      ]),
    ]));
  }
}
