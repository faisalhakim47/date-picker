// @ts-check

import { tx } from './helper.js';
import { MonthViewChangeEvent } from './events/month-view-change-event.js';

export class DatePickerMonthViewElement extends HTMLElement {
  /** @type {ShadowRoot} */
  #shadowRoot;

  /** @type {Text} */
  #text;

  /** @type {string} */
  #defaultText = '';

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: 'closed' });
  }

  connectedCallback() {
    this.#defaultText = this.attributes.getNamedItem('default-text')?.value ?? '';
    this.#render();
    this.addEventListener(MonthViewChangeEvent.EVENT_TYPE, this.#handleChange);
  }

  disconnectedCallback() {
    this.removeEventListener(MonthViewChangeEvent.EVENT_TYPE, this.#handleChange);
  }

  /**
   * @param {Event} event
   */
  #handleChange = (event) => {
    if (event instanceof MonthViewChangeEvent) {
      this.#text.nodeValue = event.detail.month.toString();
    }
  }

  #render() {
    this.#shadowRoot.appendChild(this.#text = tx(this.#defaultText));
  }
}
