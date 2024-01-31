// @ts-check

export class DatePickerSubmitEvent extends CustomEvent {
  static get EVENT_TYPE() {
    return 'date-picker-submit';
  }

  constructor() {
    super(DatePickerSubmitEvent.EVENT_TYPE);
  }
}
