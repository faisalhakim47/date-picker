// @ts-check
import { YearMonthViewChangeEvent } from '../events/year-month-view-change-event.js';
import { tx } from '../tools/dom.js';
import { ContextAwareElement } from './context-aware.js';
import { DatePickerViewElement } from './date-picker-view.js';
export class DatePickerMonthViewElement extends ContextAwareElement {
    #shadowRoot = this.attachShadow({ mode: 'closed' });
    /** @type {Text} */
    #text;
    async connectedCallback() {
        this.#render();
        const viewCtx = await this.requireContext(DatePickerViewElement);
        viewCtx.addEventListener(YearMonthViewChangeEvent.EVENT_TYPE, this.#handleMonthViewChange);
        this.#text.nodeValue = viewCtx.monthNames[viewCtx.monthIndexView];
    }
    async disconnectedCallback() {
        const viewCtx = await this.requireContext(DatePickerViewElement);
        viewCtx.removeEventListener(YearMonthViewChangeEvent.EVENT_TYPE, this.#handleMonthViewChange);
    }
    /**
     * @param {Event} event
     */
    #handleMonthViewChange = (event) => {
        if (event instanceof YearMonthViewChangeEvent) {
            this.#text.nodeValue = event.detail.monthLabel.toString();
        }
    };
    #render() {
        this.#shadowRoot.appendChild(this.#text = tx(''));
    }
}
//# sourceMappingURL=date-picker-month-view.js.map