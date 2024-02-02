// @ts-check

import './date-picker-view.js';
import { DatePickerControlElement } from './date-picker-control-element.js';
import { DatePickerViewElement } from './date-picker-view-element.js';
import { SelectedDateSetEvent } from './events/selected-date-set-event.js';
import { isInvalidDate } from './tools/date.js';
import { at, el, on, tx } from './tools/dom.js';

export class DatePickerElement extends DatePickerControlElement {
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

  /** @type {HTMLSlotElement} */
  #datePickerControlsSlot;

  /** @type {HTMLSlotElement} */
  #datePickerViewSlot;

  /** @type {HTMLSlotElement} */
  #formControlsSlot;

  /** @type {Date} */
  #selectedDate;

  connectedCallback() {
    this.#shadowRoot.adoptedStyleSheets = DatePickerElement.#STYLES;

    this.#render();

    this.addEventListener(SelectedDateSetEvent.EVENT_TYPE, this.#handleSelectedDateSet);

    this.#dialog.addEventListener('open', this.#handleDialogOpen);
    this.#dialog.addEventListener('close', this.#handleDialogClose);

    if (this.hasAttribute('open')) {
      this.#openDatePicker();
    }
    else {
      this.#closeDatePicker();
    }

    if (this.hasAttribute('value')) {
      const value = this.getAttribute('value');
      const dateValue = new Date(value);
      if (isInvalidDate(dateValue)) {
        this.value = null;
      }
      else {
        this.value = dateValue.toISOString();
      }
    }

    this.#updateButtonText();
    this.#applySelectedDateToDatePickerView();
  }

  disconnectedCallback() {
    this.removeEventListener(SelectedDateSetEvent.EVENT_TYPE, this.#handleSelectedDateSet);

    this.#dialog.removeEventListener('open', this.#handleDialogOpen);
    this.#dialog.removeEventListener('close', this.#handleDialogClose);
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
      this.value = newValue;
      if (this.#buttonText instanceof Text) {
        this.#buttonText.nodeValue = `Selected Date: ${this.value}`;
      }
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

  #openDatePicker = () => {
    this.#applySelectedDateToDatePickerView();

    if (this.#dialog instanceof HTMLDialogElement) {
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

  #handleDialogOpen = () => {
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
   * @param {SelectedDateSetEvent} event
   */
  #handleSelectedDateSet = (event) => {
    if (event instanceof SelectedDateSetEvent) {
      this.#selectedDate = event.beginDate;
    }
  };

  /**
   * @param {Event} event
   */
  #handleFormSubmit = (event) => {
    this.value = this.#selectedDate instanceof Date
      ? this.#selectedDate.toISOString()
      : null;

    this.#updateButtonText();
  };

  #applySelectedDateToDatePickerView() {
    if (this.#datePickerViewSlot instanceof HTMLSlotElement) {
      for (const assignedElement of this.#datePickerViewSlot.assignedElements()) {
        const treeWalker = document.createTreeWalker(
          assignedElement,
          NodeFilter.SHOW_ELEMENT,
          {
            acceptNode(node) {
              if (node instanceof DatePickerViewElement) {
                return NodeFilter.FILTER_ACCEPT;
              }
              return NodeFilter.FILTER_REJECT;
            },
          },
        );
        let datePickerViewElement = treeWalker.currentNode;
        while (datePickerViewElement instanceof DatePickerViewElement) {
          datePickerViewElement.setSelectedBeginDate(this.beginDateValue);
          datePickerViewElement.setSelectedEndDate(this.endDateValue);
          datePickerViewElement = treeWalker.nextNode();
        }
      }
    }
  }

  #render() {
    this.#shadowRoot.appendChild(el('div', () => [
      this.#datePickerControlsSlot = el('slot', () => [
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
          this.#datePickerViewSlot = el('slot', () => [
            at('name', 'date-picker-view'),
            el('date-picker-view', () => []),
          ]),
          this.#formControlsSlot = el('slot', () => [
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
