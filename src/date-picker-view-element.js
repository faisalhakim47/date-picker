// @ts-check

import { ContextAwareElement } from './context-aware-element.js';
import { YearMonthViewChangeEvent } from './events/year-month-view-change-event.js';
import { at, el, on, tx } from './helper.js';

export class DatePickerViewElement extends ContextAwareElement {
  static #ID_INC = 0;

  /** @type {number} */
  #idSufix;

  /** @type {HTMLTableSectionElement} */
  #calendarTbody;

  /** @type {HTMLInputElement} */
  #yearInput;

  /** @type {HTMLSelectElement} */
  #monthSelect;

  /** @type {ShadowRoot} */
  #shadowRoot;

  /** @type {HTMLSlotElement} */
  #yearMonthControlsSlot;

  #minYear = 100;
  #maxYear = 275759;

  #yearView = 0;
  #monthIndexView = 0;

  /** @type {Date} */
  #selectedDate;

  constructor() {
    super();
    this.#idSufix = DatePickerViewElement.#ID_INC++;

    this.#shadowRoot = this.attachShadow({ mode: 'closed' });

    const now = new Date();

    this.#selectedDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    )
  }

  connectedCallback() {
    this.#attachStyle();
    this.#render();

    this.getContext(DatePickerViewElement)
      .addEventListener(YearMonthViewChangeEvent.EVENT_TYPE, this.#handleYearMonthViewChange);
    this.#yearMonthControlsSlot.addEventListener('slotchange', this.#handleSlotChange);

    this.changeYearMonthView(
      this.#selectedDate.getFullYear(),
      this.#selectedDate.getMonth(),
    );
  }

  disconnectedCallback() {
    this.getContext(DatePickerViewElement)
      .removeEventListener(YearMonthViewChangeEvent.EVENT_TYPE, this.#handleYearMonthViewChange);
    this.#yearMonthControlsSlot.removeEventListener('slotchange', this.#handleSlotChange);
  }

  /**
   * @param {Event} event
   */
  #handleSlotChange = (event) => {
    const slot = event.target;

    if (!(slot instanceof HTMLSlotElement)) {
      throw new Error('Expected slot element');
    }

    this.changeYearMonthView(this.yearView, this.monthIndexView);
  };

  /**
   * @param {Event} event
   */
  #handleYearMonthViewChange = (event) => {
    if (event instanceof YearMonthViewChangeEvent) {
      const newCalendar = this.#renderCalendar();
      this.#calendarTbody.replaceWith(newCalendar);
      this.#calendarTbody = newCalendar;
      this.#monthSelect.selectedIndex = event.detail.monthIndex;
      this.#yearInput.value = event.detail.year.toString();
    }
  };

  get #datesByWeekView() {
    const year = this.yearView;
    const monthIndex = this.monthIndexView;

    const beginOfMonthDate = new Date(year, monthIndex, 1, 0, 0, 0, 0);
    const beginOfWeekOfMonthDate = new Date(beginOfMonthDate);
    beginOfWeekOfMonthDate.setDate(beginOfWeekOfMonthDate.getDate() - beginOfWeekOfMonthDate.getDay());

    const endOfMonthDate = new Date(year, monthIndex + 1, 0, 0, 0, 0, 0);
    const endOfWeekOfMonthDate = new Date(endOfMonthDate);
    endOfWeekOfMonthDate.setDate(endOfWeekOfMonthDate.getDate() + (6 - endOfWeekOfMonthDate.getDay()));

    let date = new Date(beginOfWeekOfMonthDate);

    const weeksView = [
      {
        dates: [
          {
            date: new Date(date),
            isCurrMonth: false,
            isPrevMonth: true,
            isNextMonth: false,
            isToday: false,
            isWeekend: false,
          }
        ].slice(0, 0),
      }
    ];

    let dayIndex = 0;

    while (date.getTime() <= endOfWeekOfMonthDate.getTime() || weeksView.length <= 6) {
      const latestWeek = weeksView[weeksView.length - 1];

      const dateDayIndex = date.getDay();
      const dateMonthIndex = date.getMonth();
      const dateYear = date.getFullYear();

      const yearViewDiff = (dateYear - this.yearView) * 12;

      const isCurrMonth = (yearViewDiff + dateMonthIndex) === this.monthIndexView;
      const isPrevMonth = (yearViewDiff + dateMonthIndex) < this.monthIndexView;
      const isNextMonth = (yearViewDiff + dateMonthIndex) > this.monthIndexView;
      const isToday = date.toDateString() === this.#selectedDate.toDateString();
      const isWeekend = dateDayIndex === 0 || dateDayIndex === 6;

      latestWeek.dates.push({
        date: new Date(date),
        isCurrMonth,
        isPrevMonth,
        isNextMonth,
        isToday,
        isWeekend,
      });

      date.setDate(date.getDate() + 1);

      dayIndex++;

      if (dayIndex === 7) {
        weeksView.push({
          dates: [],
        });

        dayIndex = 0;
      }
    }

    return weeksView;
  }

  /**
   * @param {string} name
   */
  #id(name) {
    return `${name}-${this.#idSufix}`;
  }

  get #locale() {
    const locales = this.lang || 'en';
    return locales;
  }

  get monthNames() {
    const formatter = new Intl.DateTimeFormat(this.#locale, { month: 'long' });
    const monthIndexes = [...Array(12).keys()];
    return monthIndexes.map((monthIndex) => {
      const date = new Date(2000, monthIndex);
      return formatter.format(date);
    });
  }

  get dayShortNames() {
    const formatter = new Intl.DateTimeFormat(this.#locale, { weekday: 'short' });
    const dayIndexes = [...Array(7).keys()];
    const firstDayOfWeekDate = new Date(2000, 0, 1);
    firstDayOfWeekDate.setDate(firstDayOfWeekDate.getDate() - firstDayOfWeekDate.getDay());
    return dayIndexes.map((dayIndex) => {
      const date = new Date(firstDayOfWeekDate);
      date.setDate(date.getDate() + dayIndex);
      return formatter.format(date);
    });
  }

  get yearView() {
    return this.#yearView;
  }

  get monthIndexView() {
    return this.#monthIndexView;
  }

  /**
 * @param {number} year
 * @param {number} monthIndex
 */
  changeYearMonthView(year, monthIndex) {
    this.#yearView = year;
    this.#monthIndexView = monthIndex;
    const monthLabel = this.monthNames[monthIndex];
    const event = new YearMonthViewChangeEvent(
      year,
      monthIndex,
      monthLabel,
    );
    this.dispatchEvent(event);
  }

  #viewPrevMonth() {
    const monthIndex = this.#monthSelect.selectedIndex;
    const year = parseInt(this.#yearInput.value, 10);
    const prevMonthIndex = monthIndex - 1;
    if (prevMonthIndex < 0) {
      this.#monthSelect.selectedIndex = 11;
      this.#yearInput.value = (year - 1).toString();
      this.changeYearMonthView(year - 1, 11);
    }
    else {
      this.#monthSelect.selectedIndex = prevMonthIndex;
      this.changeYearMonthView(year, prevMonthIndex);
    }
  }

  #viewNextMonth() {
    const monthIndex = this.#monthSelect.selectedIndex;
    const year = parseInt(this.#yearInput.value, 10);
    const nextMonthIndex = monthIndex + 1;
    if (nextMonthIndex > 11) {
      this.#monthSelect.selectedIndex = 0;
      this.#yearInput.value = (year + 1).toString();
      this.changeYearMonthView(year + 1, 0);
    }
    else {
      this.#monthSelect.selectedIndex = nextMonthIndex;
      this.changeYearMonthView(year, nextMonthIndex);
    }
  }

  /**
   * @param {Date} date
   */
  #changeDate(date) {
    if (this.#selectedDate.toDateString() === date.toDateString()) {
      return;
    }

    this.#selectedDate = new Date(date);
  }

  #attachStyle() {
    this.#shadowRoot.appendChild(el('style', [
      (style) => style.textContent = `
        :host {
          --si-width: 336px;
          --si-cal-margin-top: 8px;
          --si-header-height: calc(var(--si-cell-size) - 4px);
          --si-cell-size: calc(var(--si-width) / 7);
          --si-cell-internal-padding: 12px;
          --si-cell-internal-size: calc(var(--si-cell-size) - var(--si-cell-internal-padding));
          --si-cell-selected-bg-color: orange;
          --si-cell-selected-text-color: white;
          --si-cell-selected-font-weight: bold;
          --si-cell-weekend-text-color: red;
          --si-cell-other-month-text-color: silver;
          --si-cell-other-month-weekend-text-color: tomato;
          --si-form-height: calc(var(--si-header-height) + var(--si-cell-size) * 7 + var(--si-cal-margin-top));
          --si-form-width: var(--si-width);
          display: block;
          font-family: sans-serif;
          width: var(--si-width);
          height: var(--si-form-height);
        }

        .sr-only {
          display: none;
          visibility: hidden;
        }

        form {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: var(--si-form-width);
          height: var(--si-form-height);
        }

        form > header {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: var(--si-header-height);
        }

        form > header > .year-month-pagination {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        form > header > .year-month-pagination > button {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          width: var(--si-cell-size);
          height: var(--si-header-height);
          margin: 0;
          padding: 0;
          border: var(--si-button-border, 1px solid none);
          background-color: var(--si-button-bg-color, none);
        }

        form select[name="month"] {
          box-sizing: border-box;
          height: var(--si-header-height);
          padding: 0 8px;
        }

        form input[name="year"] {
          box-sizing: border-box;
          display: block;
          width: 96px;
          height: var(--si-header-height);
          padding: 0 8px;
        }

        form > table {
          width: var(--si-width);
          margin-top: var(--si-cal-margin-top);
          border-collapse: collapse;
          border-spacing: 0;
        }

        form > table,
        form > table > thead > tr > th,
        form > table > tbody > tr > td {
          border: none;
        }

        form > table > thead > tr > th,
        form > table > tbody > tr > td,
        form > table > tbody > tr > td > label {
          box-sizing: border-box;
          width: var(--si-cell-size);
          height: var(--si-cell-size);
          padding: 0;
          margin: 0;
        }

        form > table > thead > tr > th {
          -webkit-user-select: none;
          user-select: none;
          color: gray;
          font-weight: normal;
        }

        form > table > tbody > tr > td > label {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }

        form > table > tbody > tr > td > label > input {
          display: none;
          visibility: hidden;
        }

        form > table > tbody > tr > td > label > span {
          -webkit-user-select: none;
          user-select: none;
          font-variant-numeric: tabular-nums;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          width: var(--si-cell-internal-size);
          height: var(--si-cell-internal-size);
          border-radius: 50%;
        }

        form > table > tbody > tr > td > label:has(input:checked) > span {
          background-color: var(--si-cell-selected-bg-color, orange);
          color: var(--si-cell-selected-text-color, white);
          font-weight: var(--si-cell-selected-font-weight, bold);
        }

        form > table > tbody > tr > td > label.weekend > span {
          color: var(--si-cell-weekend-text-color);
        }

        form > table > tbody > tr > td > label.other-month > span {
          display: flex;
          color: var(--si-cell-other-month-text-color);
        }

        form > table > tbody > tr > td > label.other-month.weekend > span {
          color: var(--si-cell-other-month-weekend-text-color, tomato);
        }
      `,
    ]));
  }

  #render() {
    this.#shadowRoot.appendChild(el('form', [
      el('header', [
        this.#yearMonthControlsSlot = el('slot', [
          at('name', 'year-month-controls'),
          el('label', [
            at('class', 'sr-only'),
            at('for', this.#id('month-select')),
            tx('Month'),
          ]),
          this.#monthSelect = el('select', [
            at('id', this.#id('month-select')),
            at('name', 'month'),
            at('aria-label', 'Month'),
            on('change', (event) => {
              event.preventDefault();
              const monthIndex = this.#monthSelect.selectedIndex;
              const year = parseInt(this.#yearInput.value, 10);
              this.changeYearMonthView(year, monthIndex);
            }),
            ...this.monthNames.map((monthName, index) => {
              return el('option', [
                at('value', monthName),
                ...(index === this.monthIndexView ? [at('selected', 'selected')] : []),
                tx(monthName),
              ]);
            }),
          ]),
          el('label', [
            at('class', 'sr-only'),
            at('for', this.#id('year-input')),
            tx('Year'),
          ]),
          this.#yearInput = el('input', [
            at('id', this.#id('year-input')),
            at('type', 'number'),
            at('name', 'year'),
            at('aria-label', 'Year'),
            at('value', this.yearView.toString()),
            at('min', this.#minYear.toString()), // Minimum save year for javascript Date object as of 2024-01-30
            at('max', this.#maxYear.toString()), // Maximum save year for javascript Date object as of 2024-01-30
            on('change', (event) => {
              const monthIndex = this.#monthSelect.selectedIndex;
              const year = parseInt(this.#yearInput.value, 10);
              if (year < this.#minYear) {
                event.preventDefault();
                this.#yearInput.setCustomValidity(`Year must be greater than or equal to ${this.#minYear}`);
                this.#yearInput.reportValidity();
              }
              else if (year > this.#maxYear) {
                event.preventDefault();
                this.#yearInput.setCustomValidity(`Year must be less than or equal to ${this.#maxYear}`);
                this.#yearInput.reportValidity();
              }
              this.changeYearMonthView(year, monthIndex);
            }),
          ]),
        ]),

        el('div', [
          at('class', 'year-month-pagination'),
          el('button', [
            at('type', 'button'),
            on('click', (event) => {
              event.preventDefault();
              this.#viewPrevMonth();
            }),
            el('slot', [
              at('name', 'prev-icon'),
              (slot) => slot.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="24" width="24" title="Previous"><path fill="currentColor" d="m432-480 156 156q11 11 11 28t-11 28q-11 11-28 11t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L432-480Z"/></svg>
              `,
            ]),
          ]),
          el('button', [
            at('type', 'button'),
            on('click', (event) => {
              event.preventDefault();
              this.#viewNextMonth();
            }),
            el('slot', [
              at('name', 'next-icon'),
              (slot) => slot.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="24" width="24" title="Next"><path fill="currentColor" d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z"/></svg>
              `,
            ]),
          ]),
        ]),
      ]),

      el('table', [
        el('thead', [
          el('tr', [
            ...this.dayShortNames.map((dayShortName) => {
              return el('th', [
                tx(dayShortName),
              ]);
            }),
          ]),
        ]),

        this.#calendarTbody = el('tbody', []),
      ]),
    ]));
  }

  #renderCalendar() {
    return el('tbody', [
      ...this.#datesByWeekView.map((week) => {
        return el('tr', [
          ...week.dates.map((date) => {
            return el('td', [
              el('label', [
                at('class', [
                  ...(date.isWeekend ? ['weekend'] : []),
                  ...(date.isCurrMonth ? [] : ['other-month']),
                ].join(' ')),
                el('input', [
                  at('type', 'radio'),
                  at('name', 'date'),
                  at('value', date.date.toISOString()),
                  ...(date.isToday ? [at('checked', 'checked')] : []),
                  on('click', () => {
                    this.#changeDate(date.date);
                    if (date.isPrevMonth) {
                      this.#viewPrevMonth();
                    }
                    else if (date.isNextMonth) {
                      this.#viewNextMonth();
                    }
                  }),
                ]),
                el('span', [
                  tx(date.date.getDate().toString().padStart(2, '0')),
                ]),
              ]),
            ]);
          }),
        ]);
      }),
    ]);
  }
}
