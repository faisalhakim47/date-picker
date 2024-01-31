// @ts-check

import './date-picker-view.js';
import { DatePickerControlElement } from './date-picker-control-element.js';
import { at, el, on, tx } from './helper.js';

export class DatePickerElement extends DatePickerControlElement {
  static get formAssociated() {
    return true;
  }

  static get observedAttributes() {
    return [
      'open',
      'value',
    ];
  }

  /** @type {ShadowRoot} */
  #shadowRoot;

  /** @type {Text} */
  #buttonText;

  /** @type {HTMLDialogElement} */
  #dialog;

  constructor() {
    super();

    this.#shadowRoot = this.attachShadow({
      mode: 'closed',
      slotAssignment: 'manual',
    });
  }

  connectedCallback() {
    this.#attachStyle();
    this.#render();
    this.#syncOpenAttributeFromParent();
  }

  /**
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open') {
      this.#syncOpenAttributeFromChild();
    }
    else if (name === 'value') {
      this.value = newValue;
      this.#buttonText.nodeValue = `Selected Date: ${this.value}`;
    }
  }

  #syncOpenAttributeFromChild = () => {
    if (this.#dialog instanceof HTMLDialogElement) {
      if (this.#dialog.open) {
        this.setAttribute('open', 'open');
      } else {
        this.removeAttribute('open');
      }
    }
  };

  #syncOpenAttributeFromParent = () => {
    if (this.hasAttribute('open')) {
      this.#openDatePicker();
    } else {
      this.#closeDatePicker();
    }
  };

  #openDatePicker = () => {
    if (this.#dialog instanceof HTMLDialogElement) {
      this.#dialog.showModal();
    }
  };

  #closeDatePicker = () => {
    if (this.#dialog instanceof HTMLDialogElement) {
      this.#dialog.close();
    }
  };

  #attachStyle() {
    this.#shadowRoot.appendChild(el('style', [
      (style) => style.textContent = `
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
        dialog > form > div {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
        dialog > form > div > button {
          display: block;
          padding: 0 8px;
          height: var(--si-submit-button-height);
        }
      `,
    ]));
  }

  #render() {
    this.#shadowRoot.appendChild(el('div', [
      el('slot', [
        el('button', [
          on('click', this.#openDatePicker),
          this.#buttonText = tx('Select Date'),
        ]),
      ]),
      this.#dialog = el('dialog', [
        el('form', [
          at('method', 'dialog'),
          on('submit', this.#closeDatePicker),
          el('date-picker-view', [
            el('slot', [
              at('name', 'year-month-controls'),
              at('slot', 'year-month-controls'),
            ]),
          ]),
          el('div', [
            el('button', [
              at('type', 'button'),
              on('click', this.#closeDatePicker),
              tx('Cancel'),
            ]),
            el('button', [
              at('type', 'submit'),
              tx('Apply'),
            ]),
          ]),
        ]),
      ]),
    ]));
  }
}
