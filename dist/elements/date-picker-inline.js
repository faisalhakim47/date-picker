// @ts-check
import '../components/f-date-picker-view.js';
import { PickedDateSetEvent } from '../events/picked-date-set-event.js';
import { SelectedDateChangeEvent } from '../events/selected-date-change-event.js';
import { SelectedDateSetEvent } from '../events/selected-date-set-event.js';
import { SelectionModeSetEvent } from '../events/selection-mode-set-event.js';
import { PickedDateChangeEvent } from '../index.js';
import { dateToString, isInvalidDate } from '../tools/date.js';
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
    async connectedCallback() {
        super.connectedCallback();
        this.#shadowRoot.adoptedStyleSheets = DatePickerInlineElement.#STYLES;
        const controlCtx = await this.requireContext(DatePickerControlElement);
        controlCtx.addEventListener(SelectedDateChangeEvent.EVENT_TYPE, this.#handleSelectedDateChange);
        controlCtx.addEventListener(PickedDateSetEvent.EVENT_TYPE, this.#handlePickedDateSet);
        this.#render();
    }
    async disconnectedCallback() {
        const controlCtx = await this.requireContext(DatePickerControlElement);
        controlCtx.removeEventListener(SelectedDateChangeEvent.EVENT_TYPE, this.#handleSelectedDateChange);
        controlCtx.removeEventListener(PickedDateSetEvent.EVENT_TYPE, this.#handlePickedDateSet);
    }
    /**
     * @param {string} name
     * @param {string} oldValue
     * @param {any} newValue
     */
    async attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'value') {
            this.value = newValue;
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
            this.dispatchEvent(new SelectedDateSetEvent(event.detail));
            this.dispatchEvent(new PickedDateChangeEvent(event.detail));
        }
    };
    /**
     * @param {Event} event
     */
    #handlePickedDateSet = async (event) => {
        if (event instanceof PickedDateSetEvent) {
            this.setDateValue(event.detail.beginDate, event.detail.endDate);
            const controlCtx = await this.requireContext(DatePickerControlElement);
            controlCtx.dispatchEvent(new SelectedDateSetEvent(event.detail));
        }
    };
    #render() {
        this.#shadowRoot.appendChild(el('slot', () => [
            at('name', 'date-picker-view'),
            el('f-date-picker-view', () => []),
        ]));
    }
}
//# sourceMappingURL=date-picker-inline.js.map