// @ts-check

import './date-picker-view.js';
import { DatePickerControlElement } from './date-picker-control-element.js';
import { PickedDateChangeEvent } from './events/picked-date-change-event.js';
import { PickedDateSetEvent } from './events/picked-date-set-event.js';
import { SelectedDateChangeEvent } from './events/selected-date-change-event.js';
import { SelectionModeSetEvent } from './events/selection-mode-set-event.js';
import { dateRangeToString } from './tools/date.js';
import { at, el } from './tools/dom.js';

export class DatePickerInlineElement extends DatePickerControlElement {
  static #STYLES = (function () {
    const style = new CSSStyleSheet();

    style.replace(`
    `);

    return [style];
  })();

  static get formAssociated() {
    return true;
  }

  static get observedAttributes() {
    return [
      'value',
      'time-unit',
      'selection-mode',
    ];
  }

  #shadowRoot = this.attachShadow({ mode: 'closed' });

  async connectedCallback() {
    super.connectedCallback();

    this.#shadowRoot.adoptedStyleSheets = DatePickerInlineElement.#STYLES;

    this.#render();

    const controlCtx = await this.requireContext(DatePickerControlElement);

    controlCtx.addEventListener(SelectedDateChangeEvent.EVENT_TYPE, this.#handleSelectedDateChange);
  }

  async disconnectedCallback() {
    const controlCtx = await this.requireContext(DatePickerControlElement);

    controlCtx.removeEventListener(SelectedDateChangeEvent.EVENT_TYPE, this.#handleSelectedDateChange);
  }

  /**
   * @param {string} name
   * @param {string} oldValue
   * @param {any} newValue
   */
  async attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'value') {
      this.value = newValue;

      const controlCtx = await this.requireContext(DatePickerControlElement);

      controlCtx.dispatchEvent(new PickedDateSetEvent({
        beginDate: this.beginDateValue,
        endDate: this.endDateValue,
      }));
    }
    else if (name === 'time-unit') {
      this.timeUnit = newValue;
    }
    else if (name === 'selection-mode') {
      this.selectionMode = newValue;

      const controlCtx = await this.requireContext(DatePickerControlElement);

      controlCtx.dispatchEvent(new SelectionModeSetEvent(this.selectionMode));
    }
  }

  /**
   * @param {Event} event
   */
  #handleSelectedDateChange = (event) => {
    if (event instanceof SelectedDateChangeEvent) {
      this.value = dateRangeToString({
        beginDate: event.beginDate,
        endDate: event.endDate,
      });

      this.dispatchEvent(new PickedDateChangeEvent({
        beginDate: event.beginDate,
        endDate: event.endDate,
      }));
    }
  };

  #render() {
    this.#shadowRoot.appendChild(
      el('slot', () => [
        at('name', 'date-picker-view'),
        el('date-picker-view', () => []),
      ]),
    );
  }
}
