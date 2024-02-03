// @ts-check

import '../components/f-date-picker-view.js';
import { PickedDateSetEvent } from '../events/picked-date-set-event.js';
import { SelectionModeSetEvent } from '../events/selection-mode-set-event.js';
import { at, el } from '../tools/dom.js';

import { DatePickerControlElement } from './date-picker-control.js';

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

  connectedCallback() {
    super.connectedCallback();

    this.#shadowRoot.adoptedStyleSheets = DatePickerInlineElement.#STYLES;

    this.#render();
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

  #render() {
    this.#shadowRoot.appendChild(
      el('slot', () => [
        at('name', 'date-picker-view'),
        el('f-date-picker-view', () => []),
      ]),
    );
  }
}
