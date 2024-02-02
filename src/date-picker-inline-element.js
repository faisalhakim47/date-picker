// @ts-check

import './date-picker-view.js';
import { DatePickerControlElement } from './date-picker-control-element.js';
import { at, el } from './tools/dom.js';
import { SelectionModeSetEvent } from './events/selection-mode-set-event.js';
import { PickedDateSetEvent } from './events/picked-date-set-event.js';
import { SelectedDateChangeEvent } from './events/selected-date-change-event.js';

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

  /** @type {HTMLSlotElement} */
  #datePickerViewSlot;

  async connectedCallback() {
    super.connectedCallback();

    this.#shadowRoot.adoptedStyleSheets = DatePickerInlineElement.#STYLES;

    this.#render();

    const controlCtx = await this.requireContext(DatePickerControlElement);

    controlCtx.addEventListener(SelectedDateChangeEvent.EVENT_TYPE, this.#handleSelectedDateChange);
  }

  disconnectedCallback() {
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

      controlCtx.dispatchEvent(new PickedDateSetEvent(this.beginDateValue, this.endDateValue));
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
      /**
       * @todo dispath native change event
       */
    }
  };

  #render() {
     this.#shadowRoot.appendChild(
        this.#datePickerViewSlot = el('slot', () => [
        at('name', 'date-picker-view'),
        el('date-picker-view', () => []),
      ]),
    );
  }
}
