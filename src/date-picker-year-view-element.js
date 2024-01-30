import { tx } from './helper.js';
import { YearViewChangeEvent } from './events/year-view-change-event.js';

export class DatePickerYearViewElement extends HTMLElement {
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
    this.addEventListener(YearViewChangeEvent.EVENT_TYPE, this.#handleChange);
  }

  disconnectedCallback() {
    this.removeEventListener(YearViewChangeEvent.EVENT_TYPE, this.#handleChange);
  }

  /**
   * @param {CustomEvent} event
   */
  #handleChange = (event) => {
    if (event instanceof YearViewChangeEvent) {
      this.#text.nodeValue = event.detail.year.toString();
    }
  }

  #render() {
    this.#shadowRoot.appendChild(this.#text = tx(this.#defaultText));
  }
}
