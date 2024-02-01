// @ts-check

import { tx } from './helper.js';
import { ContextAwareElement } from './context-aware-element.js';
import { YearMonthViewChangeEvent } from './events/year-month-view-change-event.js';
import { DatePickerViewElement } from './date-picker-view-element.js';

export class DatePickerYearViewElement extends ContextAwareElement {
  static get requiredContexts() {
    return [
      DatePickerViewElement,
    ];
  }

  #shadowRoot = this.attachShadow({ mode: 'closed' });

  /** @type {Text} */
  #text;

  async connectedCallback() {
    this.#render();

    const viewCtx = await this.requireContext(DatePickerViewElement);

    viewCtx.addEventListener(YearMonthViewChangeEvent.EVENT_TYPE, this.#handleChange);
  }

  async disconnectedCallback() {
    const viewCtx = await this.requireContext(DatePickerViewElement);

    viewCtx.removeEventListener(YearMonthViewChangeEvent.EVENT_TYPE, this.#handleChange);

    this.#text.nodeValue = viewCtx.yearView?.toString();
  }

  /**
   * @param {CustomEvent} event
   */
  #handleChange = (event) => {
    if (event instanceof YearMonthViewChangeEvent) {
      this.#text.nodeValue = event.detail.year.toString();
    }
  }

  #render() {
    this.#shadowRoot.appendChild(this.#text = tx(''));
  }
}
