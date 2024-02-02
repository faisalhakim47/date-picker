// @ts-check

import { YearMonthViewChangeEvent } from './events/year-month-view-change-event.js';
import { ContextAwareElement } from './context-aware-element.js';
import { DatePickerControlElement } from './date-picker-control-element.js';
import { at, el, on, tx } from './tools/dom.js';
import { CalendarViewChangeEvent } from './events/calendar-view-change-event.js';
import { SelectionModeSetEvent } from './events/selection-mode-set-event.js';
import { SelectedDateChangeEvent } from './events/selected-date-change-event.js';
import { SelectedDateSetEvent } from './events/selected-date-set-event.js';
import { dateToNumber, dateToString, isInvalidDate } from './tools/date.js';

/** @typedef {import('./date-picker-control-element.js').SelectionMode} SelectionMode */

export class DatePickerViewElement extends ContextAwareElement {
  static #ID_INC = 0;

  static #STYLES = (function () {
    const style = new CSSStyleSheet();

    style.replace(`
:host {
  --si-width: 336px;
  --si-calendar-label-margin: 8px;
  --si-calendar-label-text-color: dimgray;
  --si-cell-size: calc(var(--si-width) / 7);
  --si-cell-width: var(--si-cell-size);
  --si-cell-height: var(--si-cell-size);
  --si-cell-bg-color: white;
  --si-cell-text-color: black;
  --si-cell-font-weight: normal;
  --si-cell-selected-bg-color: aliceblue;
  --si-cell-selected-text-color: black;
  --si-cell-selected-font-weight: bold;
  --si-cell-weekend-text-color: red;
  --si-cell-other-month-text-color: silver;
  --si-cell-other-month-weekend-text-color: tomato;
  --si-cell-font-size: 16px;
  --si-inner-cell-selected-bg-color: lightblue;
  --si-inner-cell-padding: 10px;
  --si-inner-cell-size: min(
    calc(var(--si-cell-width) - var(--si-inner-cell-padding)),
    calc(var(--si-cell-height) - var(--si-inner-cell-padding))
  );
  --si-header-height: calc(var(--si-cell-size) - 4px);
  --si-section-height: calc(
      var(--si-header-height)
      + var(--si-calendar-label-margin)
      + var(--si-header-height)
      + var(--si-calendar-label-margin)
      + var(--si-cell-height)
      + var(--si-cell-height)
      + var(--si-cell-height)
      + var(--si-cell-height)
      + var(--si-cell-height)
      + var(--si-cell-height)
  );
  --si-section-width: var(--si-width);
  display: block;
  font-family: sans-serif;
  width: var(--si-width);
  height: var(--si-section-height);
}

.sr-only {
  display: none;
  visibility: hidden;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: var(--si-section-width);
  height: var(--si-section-height);
}

section > header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: var(--si-header-height);
}

section > header > .year-month-pagination {
  display: flex;
  flex-direction: row;
  align-items: center;
}

section > header > .year-month-pagination > button {
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

section select[name="month"] {
  box-sizing: border-box;
  height: var(--si-header-height);
  padding: 0 8px;
}

section input[name="year"] {
  box-sizing: border-box;
  display: block;
  width: 96px;
  height: var(--si-header-height);
  padding: 0 8px;
}

section > table {
  border-collapse: collapse;
  border-spacing: 0;
  width: var(--si-width);
}

section > table,
section > table > thead > tr > th,
section > table > tbody > tr > td {
  border: none;
}

section > table > thead > tr > th,
section > table > thead > tr > th > span,
section > table > tbody > tr > td,
section > table > tbody > tr > td > label {
  box-sizing: border-box;
  width: var(--si-cell-width);
  height: var(--si-cell-height);
  padding: 0;
  margin: 0;
  font-size: var(--si-cell-font-size);
}

section > table > thead > tr > th > span {
  -webkit-user-select: none;
  user-select: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  line-height: 1;
  margin-top: var(--si-calendar-label-margin);
  margin-bottom: var(--si-calendar-label-margin);
  font-weight: normal;
  color: var(--si-calendar-label-text-color);
}

section > table > tbody > tr > td > label {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

section > table > tbody > tr > td > label.range-selected {
  background-color: var(--si-cell-selected-bg-color);
}

section > table > tbody > tr > td > label.range-selected-first {
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
}

section > table > tbody > tr > td > label.range-selected-last {
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}

section > table > tbody > tr > td > label > input {
  display: none;
  visibility: hidden;
}

section > table > tbody > tr > td > label > span {
  -webkit-user-select: none;
  user-select: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: var(--si-inner-cell-size);
  height: var(--si-inner-cell-size);
  border-radius: 50%;
}

section > table > tbody > tr > td > label > span > span {
  display: block;
  padding: 0;
  margin: 0;
  font-variant-numeric: normal;
  line-height: 1;
}

section > table > tbody > tr > td > label:has(input:checked) > span {
  background-color: var(--si-inner-cell-selected-bg-color);
}

section > table > tbody > tr > td > label:has(input:checked) > span > span {
  color: var(--si-cell-selected-text-color, white);
  font-weight: var(--si-cell-selected-font-weight, bold);
}

section > table > tbody > tr > td > label.weekend > span > span {
  color: var(--si-cell-weekend-text-color);
}

section > table > tbody > tr > td > label.other-month > span > span {
  color: var(--si-cell-other-month-text-color);
}

section > table > tbody > tr > td > label.other-month.weekend > span > span {
  color: var(--si-cell-other-month-weekend-text-color);
}
    `);

    return [
      style,
    ];
  })();

  static get observedAttributes() {
    return [
      'lang',
      'timeperiod',
    ];
  }

  #shadowRoot = this.attachShadow({ mode: 'closed' });
  #idSufix = DatePickerViewElement.#ID_INC++;

  /** @type {HTMLTableSectionElement} */
  #calendarTbody;

  /** @type {HTMLInputElement} */
  #yearInput;

  /** @type {HTMLSelectElement} */
  #monthSelect;

  /** @type {HTMLSlotElement} */
  #yearMonthControlsSlot;

  #minYear = 100;
  #maxYear = 275759;

  #yearView = 0;
  #monthIndexView = 0;

  /** @type {SelectionMode} */
  #selectionMode = DatePickerControlElement.SELECTION_MODE_SINGLE;

  /** @type {Date} */
  #selectedBeginDate;

  /** @type {Date} */
  #selectedEndDate;

  /** @type {(date: Date) => boolean} */
  #isDateDisabled = (date) => {
    return false;
  };

  async connectedCallback() {
    this.#shadowRoot.adoptedStyleSheets = DatePickerViewElement.#STYLES;

    this.#render();

    const controlCtx = await this.requireContext(DatePickerControlElement);
    const viewCtx = await this.requireContext(DatePickerViewElement);

    this.#selectionMode = controlCtx.selectionMode;
    this.#selectedBeginDate = controlCtx.beginDateValue;
    this.#selectedEndDate = controlCtx.endDateValue;

    controlCtx.addEventListener(SelectedDateSetEvent.EVENT_TYPE, this.#handleSelectedDateSet);
    controlCtx.addEventListener(SelectionModeSetEvent.EVENT_TYPE, this.#handleSelectionModeSet);
    viewCtx.addEventListener(CalendarViewChangeEvent.EVENT_TYPE, this.#handleCalendarViewChange);

    const defaultDate = this.#selectedBeginDate instanceof Date
      ? this.#selectedBeginDate
      : new Date();

    this.#setYearMonthView(
      defaultDate.getUTCFullYear(),
      defaultDate.getUTCMonth(),
    );
  }

  async disconnectedCallback() {
    const controlCtx = await this.requireContext(DatePickerControlElement);
    const viewCtx = await this.requireContext(DatePickerViewElement);

    controlCtx.removeEventListener(SelectedDateSetEvent.EVENT_TYPE, this.#handleSelectedDateSet);
    controlCtx.removeEventListener(SelectionModeSetEvent.EVENT_TYPE, this.#handleSelectionModeSet);
    viewCtx.removeEventListener(CalendarViewChangeEvent.EVENT_TYPE, this.#handleCalendarViewChange);
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
    firstDayOfWeekDate.setUTCDate(firstDayOfWeekDate.getUTCDate() - firstDayOfWeekDate.getUTCDay());
    return dayIndexes.map((dayIndex) => {
      const date = new Date(firstDayOfWeekDate);
      date.setUTCDate(date.getUTCDate() + dayIndex);
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
   * @param {Date} [date]
   */
  setSelectedBeginDate(date) {
    if (isInvalidDate(date)) {
      this.#selectedBeginDate = null;
    }
    else {
      this.#selectedBeginDate = date;
    }

    this.#selectedEndDate = null;

    this.#patchRangeSelection();
  }

  /**
   * @param {Date} [date]
   */
  setSelectedEndDate(date) {
    if (!(this.#selectedBeginDate instanceof Date)) {
      throw new Error('Begin date must be set first');
    }

    if (isInvalidDate(date)) {
      this.#selectedEndDate = null;
    }
    else {
      if (date.getTime() < this.#selectedBeginDate.getTime()) {
        this.setSelectedBeginDate(date);
        return;
      }

      this.#selectedEndDate = new Date(date);
    }

    this.#patchRangeSelection();
  }

  /**
   * @param {(date: Date) => boolean} filterFn
   */
  async setDisabledFilter(filterFn) {
    this.#isDateDisabled = filterFn;

    const viewCtx = await this.requireContext(DatePickerViewElement);

    viewCtx.dispatchEvent(new CalendarViewChangeEvent());
  }

  /**
   * @param {number} year
   * @param {number} monthIndex
   */
  async #setYearMonthView(year, monthIndex) {
    this.#yearView = year;
    this.#monthIndexView = monthIndex;
    const monthLabel = this.monthNames[monthIndex];

    this.#monthSelect.selectedIndex = monthIndex;
    this.#yearInput.value = year.toString();

    const viewCtx = await this.requireContext(DatePickerViewElement);

    viewCtx.dispatchEvent(new YearMonthViewChangeEvent(
      year,
      monthIndex,
      monthLabel,
    ));

    viewCtx.dispatchEvent(new CalendarViewChangeEvent());
  }

  /**
   * @param {Event} event
   */
  #handleCalendarViewChange = (event) => {
    if (event instanceof CalendarViewChangeEvent) {
      const newCalendar = this.#renderCalendar();
      this.#calendarTbody.replaceWith(newCalendar);
      this.#calendarTbody = newCalendar;
      this.#patchRangeSelection();
    }
  };

  get #datesByWeekView() {
    const year = this.yearView;
    const monthIndex = this.monthIndexView;

    const beginOfMonthDate = new Date(year, monthIndex, 1, 0, 0, 0, 0);
    const beginOfWeekOfMonthDate = new Date(beginOfMonthDate);
    beginOfWeekOfMonthDate.setUTCDate(beginOfWeekOfMonthDate.getUTCDate() - beginOfWeekOfMonthDate.getUTCDay());

    const endOfMonthDate = new Date(year, monthIndex + 1, 0, 0, 0, 0, 0);
    const endOfWeekOfMonthDate = new Date(endOfMonthDate);
    endOfWeekOfMonthDate.setUTCDate(endOfWeekOfMonthDate.getUTCDate() + (6 - endOfWeekOfMonthDate.getUTCDay()));

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
            isDisabled: false,
          }
        ].slice(0, 0),
      }
    ];

    let dayIndex = 0;

    const selectedDateIsoString = isInvalidDate(this.#selectedBeginDate) ? null : dateToString(this.#selectedBeginDate);

    while (date.getTime() <= endOfWeekOfMonthDate.getTime() || weeksView.length <= 6) {
      const latestWeek = weeksView[weeksView.length - 1];

      const dateDayIndex = date.getUTCDay();
      const dateMonthIndex = date.getUTCMonth();
      const dateYear = date.getUTCFullYear();

      const yearViewDiff = (dateYear - this.yearView) * 12;

      const isCurrMonth = (yearViewDiff + dateMonthIndex) === this.monthIndexView;
      const isPrevMonth = (yearViewDiff + dateMonthIndex) < this.monthIndexView;
      const isNextMonth = (yearViewDiff + dateMonthIndex) > this.monthIndexView;
      const isToday = dateToString(date) === selectedDateIsoString;
      const isWeekend = dateDayIndex === 0 || dateDayIndex === 6;
      const isDisabled = typeof this.#isDateDisabled === 'function'
        ? this.#isDateDisabled(date)
        : false;

      latestWeek.dates.push({
        date: new Date(date),
        numericDate: dateToNumber(date),
        isCurrMonth,
        isPrevMonth,
        isNextMonth,
        isToday,
        isWeekend,
        isDisabled,
      });

      date.setUTCDate(date.getUTCDate() + 1);

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

  #viewPrevMonth() {
    const monthIndex = this.#monthSelect.selectedIndex;
    const year = parseInt(this.#yearInput.value, 10);
    const prevMonthIndex = monthIndex - 1;
    if (prevMonthIndex < 0) {
      this.#monthSelect.selectedIndex = 11;
      this.#yearInput.value = (year - 1).toString();
      this.#setYearMonthView(year - 1, 11);
    }
    else {
      this.#monthSelect.selectedIndex = prevMonthIndex;
      this.#setYearMonthView(year, prevMonthIndex);
    }
  }

  #viewNextMonth() {
    const monthIndex = this.#monthSelect.selectedIndex;
    const year = parseInt(this.#yearInput.value, 10);
    const nextMonthIndex = monthIndex + 1;
    if (nextMonthIndex > 11) {
      this.#monthSelect.selectedIndex = 0;
      this.#yearInput.value = (year + 1).toString();
      this.#setYearMonthView(year + 1, 0);
    }
    else {
      this.#monthSelect.selectedIndex = nextMonthIndex;
      this.#setYearMonthView(year, nextMonthIndex);
    }
  }

  /**
   * @param {Date} date
   */
  async #handleDateSelect(date) {
    if (this.#selectedEndDate instanceof Date || this.#selectionMode === DatePickerControlElement.SELECTION_MODE_SINGLE) {
      this.setSelectedBeginDate(date);
    }
    else if (this.#selectedBeginDate instanceof Date) {
      this.setSelectedEndDate(date);
    }
    else {
      this.setSelectedBeginDate(date);
    }

    const controlCtx = await this.requireContext(DatePickerControlElement);

    controlCtx.dispatchEvent(new SelectedDateChangeEvent(
      this.#selectedBeginDate,
      this.#selectedEndDate,
    ));
  }

  /**
   * @param {Event} event
   */
  #handleSelectionModeSet = (event) => {
    if (event instanceof SelectionModeSetEvent) {
      this.#selectionMode = event.detail.selectionMode;
      this.setSelectedEndDate(null);
    }
  };

  /**
   * @param {Event} event
   */
  #handleSelectedDateSet = (event) => {
    if (event instanceof SelectedDateSetEvent) {
      this.#selectedBeginDate = event.detail.beginDate;
      this.#selectedEndDate = event.detail.endDate;
      this.#patchRangeSelection();
    }
  };

  #render() {
    this.#shadowRoot.appendChild(el('section', () => [
      el('header', () => [
        this.#yearMonthControlsSlot = el('slot', () => [
          at('name', 'year-month-controls'),
          el('label', () => [
            at('class', 'sr-only'),
            at('for', this.#id('month-select')),
            tx('Month'),
          ]),
          this.#monthSelect = el('select', () => [
            at('id', this.#id('month-select')),
            at('name', 'month'),
            at('aria-label', 'Month'),
            on('change', (event) => {
              event.preventDefault();
              const monthIndex = this.#monthSelect.selectedIndex;
              const year = parseInt(this.#yearInput.value, 10);
              this.#setYearMonthView(year, monthIndex);
            }),
            ...this.monthNames.map((monthName, index) => {
              return el('option', () => [
                at('value', monthName),
                ...(index === this.monthIndexView ? [at('selected', 'selected')] : []),
                tx(monthName),
              ]);
            }),
          ]),
          el('label', () => [
            at('class', 'sr-only'),
            at('for', this.#id('year-input')),
            tx('Year'),
          ]),
          this.#yearInput = el('input', () => [
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
              this.#setYearMonthView(year, monthIndex);
            }),
          ]),
        ]),

        el('div', () => [
          at('class', 'year-month-pagination'),
          el('button', () => [
            at('type', 'button'),
            on('click', (event) => {
              event.preventDefault();
              this.#viewPrevMonth();
            }),
            el('slot', () => [
              at('name', 'prev-icon'),
              (slot) => slot.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="24" width="24" title="Previous"><path fill="currentColor" d="m432-480 156 156q11 11 11 28t-11 28q-11 11-28 11t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L432-480Z"/></svg>
              `,
            ]),
          ]),
          el('button', () => [
            at('type', 'button'),
            on('click', (event) => {
              event.preventDefault();
              this.#viewNextMonth();
            }),
            el('slot', () => [
              at('name', 'next-icon'),
              (slot) => slot.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="24" width="24" title="Next"><path fill="currentColor" d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z"/></svg>
              `,
            ]),
          ]),
        ]),
      ]),

      el('table', () => [
        el('thead', () => [
          el('tr', () => [
            ...this.dayShortNames.map((dayShortName) => {
              return el('th', () => [
                el('span', () => [
                  tx(dayShortName),
                ]),
              ]);
            }),
          ]),
        ]),

        this.#calendarTbody = el('tbody', () => []),
      ]),
    ]));
  }

  #renderCalendar() {
    return el('tbody', () => [
      ...this.#datesByWeekView.map((week) => {
        return el('tr', () => [
          ...week.dates.map((date) => {
            return el('td', () => [
              el('label', () => [
                at('class', [
                  ...(date.isWeekend ? ['weekend'] : []),
                  ...(date.isCurrMonth ? [] : ['other-month']),
                ].join(' ')),
                el('input', () => [
                  at('type', 'checkbox'),
                  at('name', 'date'),
                  at('value', date.date.toISOString()),
                  ...(date.isDisabled ? [at('disabled', 'disabled')] : []),
                  ...(date.isToday ? [at('checked', 'checked')] : []),
                  on('change', (event) => {
                    try {
                      this.#handleDateSelect(date.date);
                      if (date.isPrevMonth) {
                        this.#viewPrevMonth();
                      }
                      else if (date.isNextMonth) {
                        this.#viewNextMonth();
                      }
                    }
                    catch (error) {
                      event.preventDefault();
                      throw error;
                    }
                  }),
                ]),
                el('span', () => [
                  el('span', () => [
                    tx(date.date.getUTCDate().toString().padStart(2, '0')),
                  ]),
                ]),
              ]),
            ]);
          }),
        ]);
      }),
    ]);
  }

  #patchRangeSelection() {
    if (!(this.#calendarTbody instanceof HTMLTableSectionElement)) {
      return;
    }

    const beginDate = this.#selectedBeginDate;
    const endDate = this.#selectedEndDate;

    const beginNumericDate = dateToNumber(beginDate);
    const endNumericDate = dateToNumber(endDate);

    const isSingleSelect = this.#selectionMode === DatePickerControlElement.SELECTION_MODE_SINGLE;

    const treeWalker = document.createTreeWalker(
      this.#calendarTbody,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node) {
          return (node instanceof HTMLInputElement && node.name === 'date')
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        },
      },
    );

    let input = treeWalker.currentNode;

    while (input instanceof Node) {
      input = treeWalker.nextNode();

      if (!(input instanceof HTMLInputElement)) {
        continue;
      }

      const label = input.labels.item(0);

      if (!(label instanceof HTMLLabelElement)) {
        continue;
      }

      // Reset label state
      label.classList.remove('range-selected');
      label.classList.remove('range-selected-first');
      label.classList.remove('range-selected-last');

      const date = new Date(input.value);
      const numericDate = dateToNumber(date);

      const isFirst = numericDate === beginNumericDate;
      const isLast = numericDate === endNumericDate;

      if (isFirst || isLast) {
        input.checked = true;
        input.setAttribute('checked', 'checked');
      }
      else {
        input.checked = false;
        input.removeAttribute('checked');
      }

      if (isSingleSelect) {
        continue;
      }

      const isInRange = true
        && (numericDate >= beginNumericDate)
        && (numericDate <= endNumericDate);

      if (isInRange) {
        label.classList.add('range-selected');
      }

      if (isFirst) {
        label.classList.add('range-selected-first');
      }
      else if (isLast) {
        label.classList.add('range-selected-last');
      }
    }
  }
}
