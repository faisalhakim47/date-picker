// @ts-check

/** @typedef {import('../date-picker-control-element.js').SelectionMode} SelectionMode */

/**
 * @typedef {object} SelectionModeSetEventDetail
 * @property {SelectionMode} selectionMode
 */

/**
 * @extends {CustomEvent<SelectionModeSetEventDetail>}
 */
export class SelectionModeSetEvent extends CustomEvent {
  static get EVENT_TYPE() {
    return 'selection-mode-set';
  }

  /** @type {SelectionMode} */
  #selectionMode;

  /**
   * @param {SelectionMode} selectionMode
   * @param {CustomEventInit<SelectionModeSetEventDetail>} [options]
   */
  constructor(selectionMode, options) {
    super(SelectionModeSetEvent.EVENT_TYPE, {
      ...options,
      detail: {
        ...options?.detail,
        selectionMode,
      },
    });

    this.#selectionMode = selectionMode;
  }

  get selectionMode() {
    return this.#selectionMode;
  }
}
