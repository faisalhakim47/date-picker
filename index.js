// @ts-check

import './src/index.js';
import { DatePickerDialogElement, DatePickerInlineElement, PickedDateChangeEvent } from './src/index.js';

window.addEventListener('load', function () {
  const form = document.getElementById('datePickerForm');

  if (!(form instanceof HTMLFormElement)) {
    throw new Error('The element is not an instance of HTMLFormElement.');
  }

  const inlineSingleDate = form.elements.namedItem('inline-single-date');

  if (!(inlineSingleDate instanceof DatePickerInlineElement)) {
    throw new Error('The element is not an instance of DatePickerInlineElement.');
  }

  inlineSingleDate.addEventListener(PickedDateChangeEvent.EVENT_TYPE, function (event) {
    console.log(PickedDateChangeEvent.name, event);
  });

  inlineSingleDate.addEventListener('input', function (event) {
    console.log(event.constructor.name, event);
  });

  const oeypayDate = form.elements.namedItem('oeypay-date');

  if (!(oeypayDate instanceof DatePickerDialogElement)) {
    throw new Error('The element is not an instance of DatePickerElement.');
  }

  oeypayDate.addEventListener(PickedDateChangeEvent.EVENT_TYPE, function (event) {
    console.log(PickedDateChangeEvent.name, event);
  });

  oeypayDate.addEventListener('input', function (event) {
    console.log(event.constructor.name, event.composedPath());
  });
});

// import { DatePickerInlineElement } from './src/index.js';

// window.addEventListener('load', function () {
//   const datePicker = document.querySelector('date-picker-view#oeypay-date-picker');

//   if (! (datePicker instanceof DatePickerInlineElement)) {
//     throw new Error('The element is not an instance of DatePickerInlineElement.');
//   }

//   const div = document.createElement('div');
//   div.style.display = 'flex';
//   div.style.flexDirection = 'row';
//   div.style.justifyContent = 'space-between';
//   div.style.alignItems = 'center';
//   div.style.gap = '1rem';

//   div.setAttribute('slot', 'year-month-controls');

//   const datePickerMonthView = document.createElement('date-picker-month-view');

//   datePickerMonthView.style.width = '96px';

//   div.appendChild(datePickerMonthView);
//   div.appendChild(document.createElement('date-picker-year-view'));

//   datePicker.appendChild(div);
// });


// window.addEventListener('load', function () {
//   setInterval(function () {
//     const datePicker = document.querySelector('date-picker');
//     if (datePicker?.hasAttribute('open')) {
//       datePicker?.removeAttribute('open');
//     }
//     else {
//       datePicker?.setAttribute('open', 'open');
//     }
//   }, 1000);
// });


// window.addEventListener('load', function () {
//   const datePicker = document.querySelector('date-picker');
//   const datePickerSubmitButton = document.querySelector('date-picker button[type="submit"]');

//   if (!(datePickerSubmitButton instanceof HTMLButtonElement)) {
//     throw new Error('The element is not an instance of HTMLButtonElement.');
//   }

//   datePickerSubmitButton.addEventListener('click', function () {
//     if (! (datePicker instanceof DatePickerElement)) {
//       throw new Error('The element is not an instance of HTMLDialogElement.');
//     }

//     if (!(datePickerSubmitButton instanceof HTMLButtonElement)) {
//       throw new Error('The element is not an instance of HTMLButtonElement.');
//     }

//     datePicker.requestSubmit();
//   });
// });


// window.addEventListener('load', function () {
//   const form = document.querySelector('datePickerForm');

//   if (form instanceof HTMLFormElement) {
//     form.addEventListener('submit', function (event) {
//       event.preventDefault();
//       console.log(event);
//     });
//   }
// });
