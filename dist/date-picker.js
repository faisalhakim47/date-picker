// dist/events/calendar-view-change-event.js
var CalendarViewChangeEvent = class _CalendarViewChangeEvent extends CustomEvent {
  static get EVENT_TYPE() {
    return "calendar-view-change";
  }
  /**
   * @param {CustomEventInit<CalendarViewChangeEventDetail>} [options]
   */
  constructor(options) {
    super(_CalendarViewChangeEvent.EVENT_TYPE, options);
  }
};

// dist/events/date-related-event.js
var DateRelatedEvent = class extends CustomEvent {
  /** @type {Date} */
  #beginDate;
  /** @type {Date} */
  #endDate;
  /**
   * @param {string} type
   * @param {DateRange} dateRange
   * @param {CustomEventInit<DateRelatedEventDetail>} [options]
   */
  constructor(type, dateRange, options) {
    super(type, {
      ...options,
      detail: {
        ...options?.detail,
        ...dateRange
      }
    });
    this.#beginDate = dateRange.beginDate;
    this.#endDate = dateRange.endDate;
  }
  get beginDate() {
    return this.#beginDate;
  }
  get endDate() {
    return this.#endDate;
  }
};

// dist/events/selected-date-change-event.js
var SelectedDateChangeEvent = class _SelectedDateChangeEvent extends DateRelatedEvent {
  static get EVENT_TYPE() {
    return "selected-date-change";
  }
  /**
   * @param {DateRange} dateRange
   * @param {CustomEventInit<DateRelatedEventDetail>} [options]
   */
  constructor(dateRange, options) {
    super(_SelectedDateChangeEvent.EVENT_TYPE, dateRange, options);
  }
};

// dist/events/selected-date-set-event.js
var SelectedDateSetEvent = class _SelectedDateSetEvent extends DateRelatedEvent {
  static get EVENT_TYPE() {
    return "selected-date-set";
  }
  /**
   * @param {DateRange} dateRange
   * @param {CustomEventInit<DateRelatedEventDetail>} [options]
   */
  constructor(dateRange, options) {
    super(_SelectedDateSetEvent.EVENT_TYPE, dateRange, options);
  }
};

// dist/events/selection-mode-set-event.js
var SelectionModeSetEvent = class _SelectionModeSetEvent extends CustomEvent {
  static get EVENT_TYPE() {
    return "selection-mode-set";
  }
  /** @type {SelectionMode} */
  #selectionMode;
  /**
   * @param {SelectionMode} selectionMode
   * @param {CustomEventInit<SelectionModeSetEventDetail>} [options]
   */
  constructor(selectionMode, options) {
    super(_SelectionModeSetEvent.EVENT_TYPE, {
      ...options,
      detail: {
        ...options?.detail,
        selectionMode
      }
    });
    this.#selectionMode = selectionMode;
  }
  get selectionMode() {
    return this.#selectionMode;
  }
};

// dist/events/year-month-view-change-event.js
var YearMonthViewChangeEvent = class _YearMonthViewChangeEvent extends CustomEvent {
  static get EVENT_TYPE() {
    return "year-month-view-change";
  }
  /** @type {number} */
  #year;
  /** @type {number} */
  #monthIndex;
  /**
   * @param {number} year
   * @param {number} monthIndex
   * @param {string} monthLabel
   * @param {CustomEventInit<YearMonthViewChangeEventDetail>} [options]
   */
  constructor(year, monthIndex, monthLabel, options) {
    super(_YearMonthViewChangeEvent.EVENT_TYPE, {
      ...options,
      detail: {
        ...options?.detail,
        year,
        monthIndex,
        monthLabel
      }
    });
    this.#year = year;
    this.#monthIndex = monthIndex;
  }
  get year() {
    return this.#year;
  }
  get monthIndex() {
    return this.#monthIndex;
  }
};

// dist/tools/date.js
function dateRangeToString({ beginDate, endDate }) {
  if (isInvalidDate(beginDate) || isInvalidDate(endDate)) {
    return "";
  }
  const beginDateString = dateToString(beginDate);
  const endDateString = dateToString(endDate);
  return `${beginDateString}/${endDateString}`;
}
function dateToString(date) {
  if (isInvalidDate(date)) {
    return "";
  }
  const fullIsoString = date.toISOString();
  const dateIsoString = fullIsoString.split("T")[0];
  return dateIsoString;
}
function isInvalidDate(anyDate) {
  if (!anyDate) {
    return true;
  }
  const date = new Date(anyDate);
  return date === null || isNaN(date.getTime());
}
function dateToNumber(date) {
  if (isInvalidDate(date)) {
    return 0;
  }
  const dateString = dateToString(date);
  return parseInt(dateString.replace(/-/g, ""), 10);
}
function dateStringToDate(dateString) {
  const [yearStr, monthStr, rawDateStr] = dateString.split("-");
  const dateStr = (rawDateStr || "").split("T")[0].split(" ")[0];
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const date = parseInt(dateStr, 10);
  return new Date(year, month - 1, date);
}

// dist/tools/dom.js
function el(tagNameOrElement, propFn) {
  const element = typeof tagNameOrElement === "string" ? document.createElement(tagNameOrElement) : tagNameOrElement;
  const props = propFn(element);
  for (const prop of props) {
    if (prop instanceof Attr) {
      element.setAttributeNode(prop);
    } else if (prop instanceof Node) {
      element.appendChild(prop);
    } else if (typeof prop === "function") {
      prop(element);
    } else if (typeof prop === "string") {
      const text = document.createTextNode(prop);
      element.appendChild(text);
    }
  }
  return element;
}
function at(localName, value) {
  const attr = document.createAttribute(localName);
  attr.value = value;
  return attr;
}
function tx(data) {
  const text = document.createTextNode(data);
  return text;
}
function on(type, listener, options) {
  return function(element) {
    const bypassTypingListener = listener;
    element.addEventListener(type, bypassTypingListener, options);
  };
}

// dist/elements/context-aware.js
var ContextAwareElement = class extends HTMLElement {
  /**
   * Why is this method async?
   * this method usually is called in connectedCallback hook of web component
   * but unfortunately, before connectedCallback is called, the element is not yet attached to the DOM
   * therefore the parentElement is invalid, and we need to wait for the next tick
   *
   * @template {ContextAwareElement} T
   * @param {new () => T} constructor
   * @returns {Promise<T>}
   */
  async requireContext(constructor) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let element = this;
        while (element instanceof Node) {
          if (element instanceof constructor) {
            resolve(element);
            return;
          }
          if (element instanceof ShadowRoot) {
            element = element.host;
          } else {
            element = element.parentNode;
          }
        }
        console.warn(`Context ${constructor.name} not found`);
        reject(new Error(`Context ${constructor.name} not found`));
      });
    });
  }
};

// dist/events/picked-date-set-event.js
var PickedDateSetEvent = class _PickedDateSetEvent extends DateRelatedEvent {
  static get EVENT_TYPE() {
    return "picked-date-set";
  }
  /**
   * @param {DateRange} dateRange
   * @param {CustomEventInit<DateRelatedEventDetail>} [options]
   */
  constructor(dateRange, options) {
    super(_PickedDateSetEvent.EVENT_TYPE, dateRange, options);
  }
};

// dist/elements/date-picker-control.js
var DatePickerControlElement = class _DatePickerControlElement extends ContextAwareElement {
  static get formAssociated() {
    return true;
  }
  /** @type {TimeUnit} */
  static TIME_UNIT_DAY = "day";
  /** @type {SelectionMode} */
  static SELECTION_MODE_SINGLE = "single";
  /** @type {SelectionMode} */
  static SELECTION_MODE_RANGE = "range";
  static #AVAILABLE_TIME_UNITS = [
    _DatePickerControlElement.TIME_UNIT_DAY
  ];
  static #AVAILABLE_SELECTION_MODES = [
    _DatePickerControlElement.SELECTION_MODE_SINGLE,
    _DatePickerControlElement.SELECTION_MODE_RANGE
  ];
  #internals = this.attachInternals();
  /** @type {TimeUnit} */
  #timeUnit = "day";
  /** @type {SelectionMode} */
  #selectionMode = "single";
  /** @type {Date} */
  #beginDate;
  /** @type {Date} */
  #endDate;
  connectedCallback() {
    if (this.hasAttribute("value")) {
      this.value = this.getAttribute("value");
    }
    if (this.hasAttribute("time-unit")) {
      const timeUnit = this.getAttribute("time-unit");
      this.timeUnit = timeUnit;
    }
    if (this.hasAttribute("selection-mode")) {
      const selectionMode = this.getAttribute("selection-mode");
      this.selectionMode = selectionMode;
    }
  }
  get timeUnit() {
    return this.#timeUnit;
  }
  /**
   * @param {TimeUnit} timeUnit
   */
  set timeUnit(timeUnit) {
    if (!_DatePickerControlElement.#AVAILABLE_TIME_UNITS.includes(timeUnit)) {
      console.warn("Invalid time unit", timeUnit);
      return;
    }
    this.#timeUnit = timeUnit;
  }
  get selectionMode() {
    return this.#selectionMode;
  }
  /**
   * @param {any} selectionMode
   */
  set selectionMode(selectionMode) {
    if (!_DatePickerControlElement.#AVAILABLE_SELECTION_MODES.includes(selectionMode)) {
      console.warn("Invalid selection mode", selectionMode);
      return;
    }
    this.#selectionMode = selectionMode;
  }
  get value() {
    let dateFormatter = null;
    if (this.#timeUnit === _DatePickerControlElement.TIME_UNIT_DAY) {
      dateFormatter = dateToString;
    } else {
      throw new Error("Invalid time unit");
    }
    if (this.#selectionMode === _DatePickerControlElement.SELECTION_MODE_RANGE) {
      return this.#beginDate instanceof Date && this.#endDate instanceof Date ? `${dateFormatter(this.#beginDate)}/${dateFormatter(this.#endDate)}` : null;
    } else if (this.#selectionMode === _DatePickerControlElement.SELECTION_MODE_SINGLE) {
      return this.#beginDate instanceof Date ? dateFormatter(this.#beginDate) : null;
    } else {
      throw new Error("Invalid selection mode");
    }
  }
  /**
   * @param {string} value
   */
  set value(value) {
    if (!value) {
      this.#beginDate = null;
      this.#endDate = null;
      this.#internals.setFormValue(null);
      this.removeAttribute("value");
      this.dispatchEvent(new PickedDateSetEvent({
        beginDate: null,
        endDate: null
      }));
      return;
    }
    let dateParserFn = null;
    if (this.#timeUnit === _DatePickerControlElement.TIME_UNIT_DAY) {
      dateParserFn = dateStringToDate;
    } else {
      throw new Error("Invalid time unit");
    }
    if (this.#selectionMode === _DatePickerControlElement.SELECTION_MODE_RANGE) {
      if (!value?.includes("/")) {
        console.warn("Invalid date range format", value);
        return;
      }
      const [beginDateStr2, endDateStr2] = value.split("/");
      const beginDate2 = dateParserFn(beginDateStr2);
      const endDate2 = dateParserFn(endDateStr2);
      if (isInvalidDate(beginDate2)) {
        this.#beginDate = null;
        this.#endDate = null;
        this.#internals.setFormValue(null);
        this.removeAttribute("value");
        this.dispatchEvent(new PickedDateSetEvent({
          beginDate: null,
          endDate: null
        }));
      } else {
        this.#beginDate = beginDate2;
        if (isInvalidDate(endDate2)) {
          this.#endDate = null;
          this.#internals.setFormValue(beginDateStr2);
          this.dispatchEvent(new PickedDateSetEvent({
            beginDate: beginDate2,
            endDate: null
          }));
        } else {
          this.#endDate = endDate2;
          this.#internals.setFormValue(`${beginDateStr2}/${endDateStr2}`);
          this.dispatchEvent(new PickedDateSetEvent({
            beginDate: beginDate2,
            endDate: endDate2
          }));
        }
      }
    } else if (this.#selectionMode === _DatePickerControlElement.SELECTION_MODE_SINGLE) {
      const date = dateParserFn(value);
      if (isInvalidDate(date)) {
        this.#beginDate = null;
        this.#internals.setFormValue(null);
        this.removeAttribute("value");
        this.dispatchEvent(new PickedDateSetEvent({
          beginDate: null,
          endDate: null
        }));
      } else {
        this.#beginDate = date;
        this.#internals.setFormValue(dateToString(date));
        this.dispatchEvent(new PickedDateSetEvent({
          beginDate: date,
          endDate: null
        }));
      }
    } else {
      throw new Error("Invalid selection mode");
    }
    const [beginDateStr, endDateStr] = (value ?? "").split("/");
    const beginDate = beginDateStr ? new Date(beginDateStr) : /* @__PURE__ */ new Date(Infinity);
    const endDate = endDateStr ? new Date(endDateStr) : /* @__PURE__ */ new Date(Infinity);
    const isInvalidBeginDate = isInvalidDate(beginDate);
    const isInvalidEndDate = isInvalidDate(endDate);
    if (isInvalidBeginDate) {
      this.#beginDate = null;
      this.#endDate = null;
      this.#internals.setFormValue(null);
      this.removeAttribute("value");
      this.dispatchEvent(new PickedDateSetEvent({
        beginDate: null,
        endDate: null
      }));
    } else {
      const beginDateStr2 = dateToString(beginDate);
      this.#beginDate = beginDate;
      if (isInvalidEndDate) {
        this.#endDate = null;
        this.#internals.setFormValue(beginDateStr2);
        this.dispatchEvent(new PickedDateSetEvent({
          beginDate,
          endDate: null
        }));
      } else {
        const endDateStr2 = dateToString(endDate);
        this.#endDate = endDate;
        this.#internals.setFormValue(`${beginDateStr2}/${endDateStr2}`);
        this.dispatchEvent(new PickedDateSetEvent({
          beginDate,
          endDate
        }));
      }
    }
  }
  get beginDateValue() {
    return this.#beginDate instanceof Date ? new Date(this.#beginDate) : null;
  }
  get endDateValue() {
    return this.#endDate instanceof Date ? new Date(this.#endDate) : null;
  }
  get form() {
    return this.#internals.form;
  }
  get name() {
    return this.attributes.getNamedItem("name")?.nodeValue;
  }
  get type() {
    return this.localName;
  }
  get validity() {
    return this.#internals.validity;
  }
  get validationMessage() {
    return this.#internals.validationMessage;
  }
  get willValidate() {
    return this.#internals.willValidate;
  }
  checkValidity() {
    return this.#internals.checkValidity();
  }
  reportValidity() {
    return this.#internals.reportValidity();
  }
};

// dist/elements/date-picker-view.js
var _a;
var DatePickerViewElement = class extends ContextAwareElement {
  static #ID_INC = 0;
  static #STYLES = function() {
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
      style
    ];
  }();
  static get observedAttributes() {
    return [
      "lang",
      "timeperiod"
    ];
  }
  #shadowRoot = this.attachShadow({ mode: "closed" });
  #idSufix = _a.#ID_INC++;
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
    this.#shadowRoot.adoptedStyleSheets = _a.#STYLES;
    this.#render();
    const controlCtx = await this.requireContext(DatePickerControlElement);
    const viewCtx = await this.requireContext(_a);
    this.#selectionMode = controlCtx.selectionMode;
    this.#selectedBeginDate = controlCtx.beginDateValue;
    this.#selectedEndDate = controlCtx.endDateValue;
    controlCtx.addEventListener(SelectedDateSetEvent.EVENT_TYPE, this.#handleSelectedDateSet);
    controlCtx.addEventListener(SelectionModeSetEvent.EVENT_TYPE, this.#handleSelectionModeSet);
    viewCtx.addEventListener(CalendarViewChangeEvent.EVENT_TYPE, this.#handleCalendarViewChange);
    const defaultDate = this.#selectedBeginDate instanceof Date ? this.#selectedBeginDate : /* @__PURE__ */ new Date();
    this.#setYearMonthView(defaultDate.getUTCFullYear(), defaultDate.getUTCMonth());
  }
  async disconnectedCallback() {
    const controlCtx = await this.requireContext(DatePickerControlElement);
    const viewCtx = await this.requireContext(_a);
    controlCtx.removeEventListener(SelectedDateSetEvent.EVENT_TYPE, this.#handleSelectedDateSet);
    controlCtx.removeEventListener(SelectionModeSetEvent.EVENT_TYPE, this.#handleSelectionModeSet);
    viewCtx.removeEventListener(CalendarViewChangeEvent.EVENT_TYPE, this.#handleCalendarViewChange);
  }
  get monthNames() {
    const formatter = new Intl.DateTimeFormat(this.#locale, { month: "long" });
    const monthIndexes = [...Array(12).keys()];
    return monthIndexes.map((monthIndex) => {
      const date = new Date(2e3, monthIndex);
      return formatter.format(date);
    });
  }
  get dayShortNames() {
    const formatter = new Intl.DateTimeFormat(this.#locale, { weekday: "short" });
    const dayIndexes = [...Array(7).keys()];
    const firstDayOfWeekDate = new Date(2e3, 0, 1);
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
    } else {
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
      throw new Error("Begin date must be set first");
    }
    if (isInvalidDate(date)) {
      this.#selectedEndDate = null;
    } else {
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
    const viewCtx = await this.requireContext(_a);
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
    const viewCtx = await this.requireContext(_a);
    viewCtx.dispatchEvent(new YearMonthViewChangeEvent(year, monthIndex, monthLabel));
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
            isDisabled: false
          }
        ].slice(0, 0)
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
      const isCurrMonth = yearViewDiff + dateMonthIndex === this.monthIndexView;
      const isPrevMonth = yearViewDiff + dateMonthIndex < this.monthIndexView;
      const isNextMonth = yearViewDiff + dateMonthIndex > this.monthIndexView;
      const isToday = dateToString(date) === selectedDateIsoString;
      const isWeekend = dateDayIndex === 0 || dateDayIndex === 6;
      const isDisabled = typeof this.#isDateDisabled === "function" ? this.#isDateDisabled(date) : false;
      latestWeek.dates.push({
        date: new Date(date),
        numericDate: dateToNumber(date),
        isCurrMonth,
        isPrevMonth,
        isNextMonth,
        isToday,
        isWeekend,
        isDisabled
      });
      date.setUTCDate(date.getUTCDate() + 1);
      dayIndex++;
      if (dayIndex === 7) {
        weeksView.push({
          dates: []
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
    const locales = this.lang || "en";
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
    } else {
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
    } else {
      this.#monthSelect.selectedIndex = nextMonthIndex;
      this.#setYearMonthView(year, nextMonthIndex);
    }
  }
  /**
   * @param {Date} date
   */
  async #handleDateSelect(date) {
    if (this.#selectionMode === DatePickerControlElement.SELECTION_MODE_SINGLE) {
      if (this.#selectedBeginDate instanceof Date) {
        if (this.#selectedBeginDate.getTime() === date.getTime()) {
          this.setSelectedBeginDate(null);
        } else {
          this.setSelectedBeginDate(date);
        }
      } else {
        this.setSelectedBeginDate(date);
      }
    } else if (this.#selectionMode === DatePickerControlElement.SELECTION_MODE_RANGE) {
      if (this.#selectedBeginDate instanceof Date) {
        if (date.getTime() < this.#selectedBeginDate.getTime()) {
          this.setSelectedBeginDate(date);
        } else {
          if (this.#selectedBeginDate.getTime() === date.getTime()) {
            this.setSelectedBeginDate(null);
          } else {
            if (this.#selectedEndDate instanceof Date) {
              this.setSelectedBeginDate(date);
            } else {
              this.setSelectedEndDate(date);
            }
          }
        }
      } else {
        this.setSelectedBeginDate(date);
      }
    } else {
      throw new Error("Invalid selection mode: " + this.#selectionMode);
    }
    const controlCtx = await this.requireContext(DatePickerControlElement);
    controlCtx.dispatchEvent(new SelectedDateChangeEvent({
      beginDate: this.#selectedBeginDate,
      endDate: this.#selectedEndDate
    }));
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
    this.#shadowRoot.appendChild(el("section", () => [
      el("header", () => [
        this.#yearMonthControlsSlot = el("slot", () => [
          at("name", "year-month-controls"),
          el("label", () => [
            at("class", "sr-only"),
            at("for", this.#id("month-select")),
            tx("Month")
          ]),
          this.#monthSelect = el("select", () => [
            at("id", this.#id("month-select")),
            at("name", "month"),
            at("aria-label", "Month"),
            on("change", (event) => {
              event.preventDefault();
              const monthIndex = this.#monthSelect.selectedIndex;
              const year = parseInt(this.#yearInput.value, 10);
              this.#setYearMonthView(year, monthIndex);
            }),
            ...this.monthNames.map((monthName, index) => {
              return el("option", () => [
                at("value", monthName),
                ...index === this.monthIndexView ? [at("selected", "selected")] : [],
                tx(monthName)
              ]);
            })
          ]),
          el("label", () => [
            at("class", "sr-only"),
            at("for", this.#id("year-input")),
            tx("Year")
          ]),
          this.#yearInput = el("input", () => [
            at("id", this.#id("year-input")),
            at("type", "number"),
            at("name", "year"),
            at("aria-label", "Year"),
            at("value", this.yearView.toString()),
            at("min", this.#minYear.toString()),
            // Minimum save year for javascript Date object as of 2024-01-30
            at("max", this.#maxYear.toString()),
            // Maximum save year for javascript Date object as of 2024-01-30
            on("change", (event) => {
              const monthIndex = this.#monthSelect.selectedIndex;
              const year = parseInt(this.#yearInput.value, 10);
              if (year < this.#minYear) {
                event.preventDefault();
                this.#yearInput.setCustomValidity(`Year must be greater than or equal to ${this.#minYear}`);
                this.#yearInput.reportValidity();
              } else if (year > this.#maxYear) {
                event.preventDefault();
                this.#yearInput.setCustomValidity(`Year must be less than or equal to ${this.#maxYear}`);
                this.#yearInput.reportValidity();
              }
              this.#setYearMonthView(year, monthIndex);
            })
          ])
        ]),
        el("div", () => [
          at("class", "year-month-pagination"),
          el("button", () => [
            at("type", "button"),
            on("click", (event) => {
              event.preventDefault();
              this.#viewPrevMonth();
            }),
            el("slot", () => [
              at("name", "prev-icon"),
              (slot) => slot.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="24" width="24" title="Previous"><path fill="currentColor" d="m432-480 156 156q11 11 11 28t-11 28q-11 11-28 11t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L432-480Z"/></svg>
              `
            ])
          ]),
          el("button", () => [
            at("type", "button"),
            on("click", (event) => {
              event.preventDefault();
              this.#viewNextMonth();
            }),
            el("slot", () => [
              at("name", "next-icon"),
              (slot) => slot.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="24" width="24" title="Next"><path fill="currentColor" d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z"/></svg>
              `
            ])
          ])
        ])
      ]),
      el("table", () => [
        el("thead", () => [
          el("tr", () => [
            ...this.dayShortNames.map((dayShortName) => {
              return el("th", () => [
                el("span", () => [
                  tx(dayShortName)
                ])
              ]);
            })
          ])
        ]),
        this.#calendarTbody = el("tbody", () => [])
      ])
    ]));
  }
  #renderCalendar() {
    return el("tbody", () => [
      ...this.#datesByWeekView.map((week) => {
        return el("tr", () => [
          ...week.dates.map((date) => {
            return el("td", () => [
              el("label", () => [
                at("class", [
                  ...date.isWeekend ? ["weekend"] : [],
                  ...date.isCurrMonth ? [] : ["other-month"]
                ].join(" ")),
                el("input", () => [
                  at("type", "checkbox"),
                  at("name", "date"),
                  at("value", date.date.toISOString()),
                  ...date.isDisabled ? [at("disabled", "disabled")] : [],
                  ...date.isToday ? [at("checked", "checked")] : [],
                  on("change", (event) => {
                    try {
                      this.#handleDateSelect(date.date);
                      if (date.isPrevMonth) {
                        this.#viewPrevMonth();
                      } else if (date.isNextMonth) {
                        this.#viewNextMonth();
                      }
                    } catch (error) {
                      event.preventDefault();
                      throw error;
                    }
                  })
                ]),
                el("span", () => [
                  el("span", () => [
                    tx(date.date.getUTCDate().toString().padStart(2, "0"))
                  ])
                ])
              ])
            ]);
          })
        ]);
      })
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
    const treeWalker = document.createTreeWalker(this.#calendarTbody, NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        return node instanceof HTMLInputElement && node.name === "date" ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
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
      label.classList.remove("range-selected");
      label.classList.remove("range-selected-first");
      label.classList.remove("range-selected-last");
      const date = new Date(input.value);
      const numericDate = dateToNumber(date);
      const isFirst = numericDate === beginNumericDate;
      const isLast = numericDate === endNumericDate;
      if (isFirst || isLast) {
        input.checked = true;
        input.setAttribute("checked", "checked");
      } else {
        input.checked = false;
        input.removeAttribute("checked");
      }
      if (isSingleSelect) {
        continue;
      }
      const isInRange = numericDate >= beginNumericDate && numericDate <= endNumericDate;
      if (isInRange) {
        label.classList.add("range-selected");
      }
      if (isFirst) {
        label.classList.add("range-selected-first");
      } else if (isLast) {
        label.classList.add("range-selected-last");
      }
    }
  }
};
_a = DatePickerViewElement;

// dist/components/f-date-picker-view.js
customElements.define("f-date-picker-view", DatePickerViewElement);

// dist/elements/date-picker-inline.js
var DatePickerInlineElement = class _DatePickerInlineElement extends DatePickerControlElement {
  static #STYLES = function() {
    const style = new CSSStyleSheet();
    style.replace(`
    `);
    return [style];
  }();
  static get formAssociated() {
    return true;
  }
  static get observedAttributes() {
    return [
      "value",
      "time-unit",
      "selection-mode"
    ];
  }
  #shadowRoot = this.attachShadow({ mode: "closed" });
  connectedCallback() {
    super.connectedCallback();
    this.#shadowRoot.adoptedStyleSheets = _DatePickerInlineElement.#STYLES;
    this.#render();
  }
  /**
   * @param {string} name
   * @param {string} oldValue
   * @param {any} newValue
   */
  async attributeChangedCallback(name, oldValue, newValue) {
    if (name === "value") {
      this.value = newValue;
      const controlCtx = await this.requireContext(DatePickerControlElement);
      controlCtx.dispatchEvent(new PickedDateSetEvent({
        beginDate: this.beginDateValue,
        endDate: this.endDateValue
      }));
    } else if (name === "time-unit") {
      this.timeUnit = newValue;
    } else if (name === "selection-mode") {
      this.selectionMode = newValue;
      const controlCtx = await this.requireContext(DatePickerControlElement);
      controlCtx.dispatchEvent(new SelectionModeSetEvent(this.selectionMode));
    }
  }
  #render() {
    this.#shadowRoot.appendChild(el("slot", () => [
      at("name", "date-picker-view"),
      el("f-date-picker-view", () => [])
    ]));
  }
};

// dist/components/f-date-picker-inline.js
customElements.define("f-date-picker-inline", DatePickerInlineElement);

// dist/elements/date-picker-month-view.js
var DatePickerMonthViewElement = class extends ContextAwareElement {
  #shadowRoot = this.attachShadow({ mode: "closed" });
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
    this.#shadowRoot.appendChild(this.#text = tx(""));
  }
};

// dist/components/f-date-picker-month-view.js
customElements.define("f-date-picker-month-view", DatePickerMonthViewElement);

// dist/elements/date-picker-year-view.js
var DatePickerYearViewElement = class extends ContextAwareElement {
  static get requiredContexts() {
    return [
      DatePickerViewElement
    ];
  }
  #shadowRoot = this.attachShadow({ mode: "closed" });
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
  };
  #render() {
    this.#shadowRoot.appendChild(this.#text = tx(""));
  }
};

// dist/components/f-date-picker-year-view.js
customElements.define("f-date-picker-year-view", DatePickerYearViewElement);

// dist/events/picked-date-change-event.js
var PickedDateChangeEvent = class _PickedDateChangeEvent extends DateRelatedEvent {
  static get EVENT_TYPE() {
    return "change";
  }
  /**
   * @param {DateRange} dateRange
   * @param {CustomEventInit<DateRelatedEventDetail>} [options]
   */
  constructor(dateRange, options) {
    super(_PickedDateChangeEvent.EVENT_TYPE, dateRange, options);
  }
};

// dist/elements/date-picker-dialog.js
var DatePickerDialogElement = class _DatePickerDialogElement extends DatePickerControlElement {
  static #STYLES = function() {
    const style = new CSSStyleSheet();
    style.replace(`
:host {
  --si-input-button-height: 36px;
  --si-submit-button-height: 36px;
  --si-dialog-radius: 4px;
  --si-dialog-padding: 16px;
}
button {
  display: block;
  padding: 0 8px;
  height: var(--si-input-button-height);
}
dialog {
  border: none;
  padding: var(--si-dialog-padding);
  border-radius: var(--si-dialog-radius);
}
dialog > form > slot > div {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}
dialog > form > slot > div > button {
  display: block;
  padding: 0 8px;
  height: var(--si-submit-button-height);
}
    `);
    return [style];
  }();
  static get formAssociated() {
    return true;
  }
  static get observedAttributes() {
    return [
      "open",
      "value"
    ];
  }
  #shadowRoot = this.attachShadow({ mode: "closed" });
  /** @type {Text} */
  #buttonText;
  /** @type {HTMLDialogElement} */
  #dialog;
  /** @type {HTMLFormElement} */
  #form;
  /** @type {Date} */
  #selectedBeginDate;
  /** @type {Date} */
  #selectedEndDate;
  async connectedCallback() {
    const controlCtx = await this.requireContext(DatePickerControlElement);
    controlCtx.addEventListener(PickedDateChangeEvent.EVENT_TYPE, this.#handlePickedDateChange);
    controlCtx.addEventListener(PickedDateSetEvent.EVENT_TYPE, this.#handlePickedDateSet);
    controlCtx.addEventListener(SelectedDateChangeEvent.EVENT_TYPE, this.#handleSelectedDateChange);
    super.connectedCallback();
    this.#shadowRoot.adoptedStyleSheets = _DatePickerDialogElement.#STYLES;
    this.#render();
    this.#dialog.addEventListener("open", this.#handleDialogOpen);
    this.#dialog.addEventListener("close", this.#handleDialogClose);
    if (this.hasAttribute("open")) {
      this.#openDatePicker();
    } else {
      this.#closeDatePicker();
    }
    this.#updateButtonText();
  }
  async disconnectedCallback() {
    this.#dialog.removeEventListener("open", this.#handleDialogOpen);
    this.#dialog.removeEventListener("close", this.#handleDialogClose);
    const controlCtx = await this.requireContext(DatePickerControlElement);
    controlCtx.removeEventListener(PickedDateChangeEvent.EVENT_TYPE, this.#handlePickedDateChange);
    controlCtx.removeEventListener(PickedDateSetEvent.EVENT_TYPE, this.#handlePickedDateSet);
    controlCtx.removeEventListener(SelectedDateChangeEvent.EVENT_TYPE, this.#handleSelectedDateChange);
  }
  /**
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "open") {
      if (newValue === null) {
        this.#closeDatePicker();
      } else {
        this.#openDatePicker();
      }
    } else if (name === "value") {
      if (newValue === null) {
        this.value = null;
      } else {
        this.value = newValue;
      }
      this.#updateButtonText();
    }
  }
  requestSubmit = () => {
    this.#form.requestSubmit();
  };
  closeDatePicker() {
    this.#closeDatePicker();
  }
  #updateButtonText() {
    if (this.beginDateValue instanceof Date) {
      if (this.#buttonText instanceof Text) {
        this.#buttonText.nodeValue = `Selected Date: ${this.value}`;
      }
    } else {
      if (this.#buttonText instanceof Text) {
        this.#buttonText.nodeValue = "Select Date";
      }
    }
  }
  #openDatePicker = async () => {
    if (this.#dialog instanceof HTMLDialogElement) {
      const controlCtx = await this.requireContext(DatePickerControlElement);
      controlCtx.dispatchEvent(new SelectedDateSetEvent({
        beginDate: this.#selectedBeginDate,
        endDate: this.#selectedEndDate
      }));
      this.#dialog.showModal();
      if (!this.hasAttribute("open")) {
        this.setAttribute("open", "");
      }
    }
  };
  #closeDatePicker = () => {
    if (this.#dialog instanceof HTMLDialogElement) {
      this.#dialog.close();
    }
  };
  #handleDialogOpen = async () => {
    if (!this.hasAttribute("open")) {
      this.setAttribute("open", "");
    }
  };
  #handleDialogClose = () => {
    if (this.hasAttribute("open")) {
      this.removeAttribute("open");
    }
  };
  /**
   * @param {Event} event
   */
  #handleSelectedDateChange = (event) => {
    if (event instanceof SelectedDateChangeEvent) {
      const { beginDate, endDate } = event.detail;
      this.#selectedBeginDate = beginDate;
      this.#selectedEndDate = endDate;
    }
  };
  /**
   * @param {Event} event
   */
  #handlePickedDateChange = (event) => {
    if (event instanceof PickedDateChangeEvent) {
      this.#updateButtonText();
    }
  };
  /**
   * @param {Event} event
   */
  #handlePickedDateSet = (event) => {
    if (event instanceof PickedDateSetEvent) {
      const { beginDate, endDate } = event.detail;
      this.#selectedBeginDate = beginDate;
      this.#selectedEndDate = endDate;
      this.#updateButtonText();
    }
  };
  #handleFormSubmit = () => {
    if (this.selectionMode === DatePickerControlElement.SELECTION_MODE_SINGLE) {
      this.value = dateToString(this.#selectedBeginDate);
    } else if (this.selectionMode === DatePickerControlElement.SELECTION_MODE_RANGE) {
      this.value = dateRangeToString({
        beginDate: this.#selectedBeginDate,
        endDate: this.#selectedEndDate
      });
    } else {
      throw new Error("Invalid selection mode");
    }
    this.#updateButtonText();
  };
  #render() {
    this.#shadowRoot.appendChild(el("div", () => [
      el("slot", () => [
        at("name", "date-picker-controls"),
        el("button", () => [
          on("click", this.#openDatePicker),
          this.#buttonText = tx("Select Date")
        ])
      ]),
      this.#dialog = el("dialog", () => [
        this.#form = el("form", () => [
          at("method", "dialog"),
          on("submit", this.#handleFormSubmit),
          el("slot", () => [
            at("name", "date-picker-view"),
            el("f-date-picker-view", () => [])
          ]),
          el("slot", () => [
            at("name", "form-controls"),
            el("div", () => [
              el("button", () => [
                at("type", "button"),
                on("click", this.#closeDatePicker),
                tx("Cancel")
              ]),
              el("button", () => [
                at("type", "submit"),
                tx("Apply")
              ])
            ])
          ])
        ])
      ])
    ]));
  }
};

// dist/components/f-date-picker-dialog.js
customElements.define("f-date-picker-dialog", DatePickerDialogElement);
export {
  DatePickerDialogElement,
  DatePickerInlineElement,
  DatePickerMonthViewElement,
  DatePickerViewElement,
  DatePickerYearViewElement,
  PickedDateChangeEvent
};
//# sourceMappingURL=date-picker.js.map
