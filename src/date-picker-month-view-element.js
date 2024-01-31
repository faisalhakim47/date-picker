// @ts-check

import { tx } from './helper.js';
import { ContextAwareElement } from './context-aware-element.js';
import { YearMonthViewChangeEvent } from './events/year-month-view-change-event.js';
import { DatePickerViewElement } from './date-picker-view-element.js';

export class DatePickerMonthViewElement extends ContextAwareElement {
  /** @type {ShadowRoot} */
  #shadowRoot;

  /** @type {Text} */
  #text;

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: 'closed' });
  }

  connectedCallback() {
    this.#render();

    this.getContext(DatePickerViewElement)
      .addEventListener(YearMonthViewChangeEvent.EVENT_TYPE, this.#handleChange);
  }

  disconnectedCallback() {
    this.getContext(DatePickerViewElement)
      .removeEventListener(YearMonthViewChangeEvent.EVENT_TYPE, this.#handleChange);
  }

  /**
   * @param {Event} event
   */
  #handleChange = (event) => {
    if (event instanceof YearMonthViewChangeEvent) {
      this.#text.nodeValue = event.detail.monthLabel.toString();
    }
  }

  #render() {
    this.#shadowRoot.appendChild(this.#text = tx(''));
  }
}
