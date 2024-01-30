// @ts-check

import './date-picker-inline.js';
import { at, el, on, tx } from './helper.js';

export class DatePickerElement extends HTMLElement {
  /** @type {ShadowRoot} */
  #shadowRoot;

  /** @type {HTMLDialogElement} */
  #dialog;

  connectedCallback() {
    this.#shadowRoot = this.attachShadow({ mode: 'closed' });
    this.#attachStyle();
    this.#render();
  }

  #openDatePicker = () => {
    this.#dialog.showModal();
  };

  #closeDatePicker = () => {
    this.#dialog.close();
  };

  #attachStyle() {
    this.#shadowRoot.appendChild(el('style', [
      (style) => style.textContent = `
        :host {
          --si-submit-button-height: 36px;
          --si-dialog-radius: 4px;
          --si-dialog-padding: 16px;
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
      el('button', [
        on('click', this.#openDatePicker),
        tx('Open'),
      ]),
      this.#dialog = el('dialog', [
        el('form', [
          at('method', 'dialog'),
          on('submit', () => {
            this.#dialog.close();
          }),
          el('date-picker-inline', [
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
