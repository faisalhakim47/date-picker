class CalendarViewChangeEvent extends CustomEvent{static get EVENT_TYPE(){return"calendar-view-change"}constructor(options){super(CalendarViewChangeEvent.EVENT_TYPE,options)}}class DateRelatedEvent extends CustomEvent{#beginDate;#endDate;constructor(type,dateRange,options){super(type,{...options,detail:{...options?.detail,...dateRange}}),this.#beginDate=dateRange.beginDate,this.#endDate=dateRange.endDate}get beginDate(){return this.#beginDate}get endDate(){return this.#endDate}}class SelectedDateChangeEvent extends DateRelatedEvent{static get EVENT_TYPE(){return"selected-date-change"}constructor(dateRange,options){super(SelectedDateChangeEvent.EVENT_TYPE,dateRange,options)}}class SelectedDateSetEvent extends DateRelatedEvent{static get EVENT_TYPE(){return"selected-date-set"}constructor(dateRange,options){super(SelectedDateSetEvent.EVENT_TYPE,dateRange,options)}}class SelectionModeSetEvent extends CustomEvent{static get EVENT_TYPE(){return"selection-mode-set"}#selectionMode;constructor(selectionMode,options){super(SelectionModeSetEvent.EVENT_TYPE,{...options,detail:{...options?.detail,selectionMode:selectionMode}}),this.#selectionMode=selectionMode}get selectionMode(){return this.#selectionMode}}class YearMonthViewChangeEvent extends CustomEvent{static get EVENT_TYPE(){return"year-month-view-change"}#year;#monthIndex;constructor(year,monthIndex,monthLabel,options){super(YearMonthViewChangeEvent.EVENT_TYPE,{...options,detail:{...options?.detail,year:year,monthIndex:monthIndex,monthLabel:monthLabel}}),this.#year=year,this.#monthIndex=monthIndex}get year(){return this.#year}get monthIndex(){return this.#monthIndex}}function dateToString(date){if(isInvalidDate(date))return"";const year=date.getFullYear(),month=date.getMonth()+1,day=date.getDate();return`${year}-${month.toString().padStart(2,"0")}-${day.toString().padStart(2,"0")}`}function isInvalidDate(anyDate){if(!anyDate)return!0;const date=new Date(anyDate);return null===date||isNaN(date.getTime())}function dateToNumber(date){if(isInvalidDate(date))return 0;const dateString=dateToString(date);return parseInt(dateString.replace(/-/g,""),10)}function dateStringToDate(dateString){const[yearStr,monthStr,rawDateStr]=dateString.split("-"),dateStr=(rawDateStr||"").split("T")[0].split(" ")[0],year=parseInt(yearStr,10),month=parseInt(monthStr,10),date=parseInt(dateStr,10);return new Date(year,month-1,date)}function el(tagNameOrElement,propFn){const element="string"==typeof tagNameOrElement?document.createElement(tagNameOrElement):tagNameOrElement,props=propFn(element);for(const prop of props)if(prop instanceof Attr)element.setAttributeNode(prop);else if(prop instanceof Node)element.appendChild(prop);else if("function"==typeof prop)prop(element);else if("string"==typeof prop){const text=document.createTextNode(prop);element.appendChild(text)}return element}function at(localName,value){const attr=document.createAttribute(localName);return attr.value=value,attr}function tx(data){return document.createTextNode(data)}function on(type,listener,options){return function(element){const bypassTypingListener=listener;element.addEventListener(type,bypassTypingListener,options)}}class ContextAwareElement extends HTMLElement{async requireContext(constructor,checkingInterval=50){return new Promise((resolve=>{setTimeout((()=>{const context=this.#traceContext(constructor);if(context instanceof constructor)resolve(context);else{const retryThreshold=5e3/checkingInterval;let numOfRetries=0;const interval=setInterval((()=>{const context=this.#traceContext(constructor);if(context instanceof constructor)clearInterval(interval),resolve(context);else{if(numOfRetries>retryThreshold)throw clearInterval(interval),new Error(`Failed to find the context of ${constructor.name} after ${retryThreshold*checkingInterval}ms`);numOfRetries++}}),checkingInterval)}}))}))}#traceContext(constructor){let element=this;for(;element;){if(element instanceof constructor)return element;element=element instanceof ShadowRoot?element.host:element.parentNode}return null}}class PickedDateSetEvent extends DateRelatedEvent{static get EVENT_TYPE(){return"picked-date-set"}constructor(dateRange,options){super(PickedDateSetEvent.EVENT_TYPE,dateRange,options)}}class DatePickerControlElement extends ContextAwareElement{static get formAssociated(){return!0}static TIME_UNIT_DAY="day";static SELECTION_MODE_SINGLE="single";static SELECTION_MODE_RANGE="range";static#AVAILABLE_TIME_UNITS=[DatePickerControlElement.TIME_UNIT_DAY];static#AVAILABLE_SELECTION_MODES=[DatePickerControlElement.SELECTION_MODE_SINGLE,DatePickerControlElement.SELECTION_MODE_RANGE];#internals=this.attachInternals();#timeUnit="day";#selectionMode="single";#beginDate;#endDate;connectedCallback(){if(this.hasAttribute("value")&&(this.value=this.getAttribute("value")),this.hasAttribute("time-unit")){const timeUnit=this.getAttribute("time-unit");this.timeUnit=timeUnit}if(this.hasAttribute("selection-mode")){const selectionMode=this.getAttribute("selection-mode");this.selectionMode=selectionMode}}get timeUnit(){return this.#timeUnit}set timeUnit(timeUnit){DatePickerControlElement.#AVAILABLE_TIME_UNITS.includes(timeUnit)?this.#timeUnit=timeUnit:console.warn("Invalid time unit",timeUnit)}get selectionMode(){return this.#selectionMode}set selectionMode(selectionMode){DatePickerControlElement.#AVAILABLE_SELECTION_MODES.includes(selectionMode)?this.#selectionMode=selectionMode:console.warn("Invalid selection mode",selectionMode)}get value(){let dateFormatter=null;if(this.#timeUnit!==DatePickerControlElement.TIME_UNIT_DAY)throw new Error("Invalid time unit");if(dateFormatter=dateToString,this.#selectionMode===DatePickerControlElement.SELECTION_MODE_RANGE)return this.#beginDate instanceof Date&&this.#endDate instanceof Date?`${dateFormatter(this.#beginDate)}/${dateFormatter(this.#endDate)}`:null;if(this.#selectionMode===DatePickerControlElement.SELECTION_MODE_SINGLE)return this.#beginDate instanceof Date?dateFormatter(this.#beginDate):null;throw new Error("Invalid selection mode")}set value(value){if(!value)return this.#beginDate=null,this.#endDate=null,this.#internals.setFormValue(null),this.removeAttribute("value"),void this.dispatchEvent(new PickedDateSetEvent({beginDate:null,endDate:null}));let dateParserFn=null;if(this.#timeUnit!==DatePickerControlElement.TIME_UNIT_DAY)throw new Error("Invalid time unit");if(dateParserFn=dateStringToDate,this.#selectionMode===DatePickerControlElement.SELECTION_MODE_RANGE){if(!value?.includes("/"))return void console.warn("Invalid date range format",value);const[beginDateStr,endDateStr]=value.split("/"),beginDate=dateParserFn(beginDateStr),endDate=dateParserFn(endDateStr);isInvalidDate(beginDate)?(this.#beginDate=null,this.#endDate=null,this.#internals.setFormValue(null),this.removeAttribute("value"),this.dispatchEvent(new PickedDateSetEvent({beginDate:null,endDate:null}))):(this.#beginDate=beginDate,isInvalidDate(endDate)?(this.#endDate=null,this.#internals.setFormValue(beginDateStr),this.dispatchEvent(new PickedDateSetEvent({beginDate:beginDate,endDate:null}))):(this.#endDate=endDate,this.#internals.setFormValue(`${beginDateStr}/${endDateStr}`),this.dispatchEvent(new PickedDateSetEvent({beginDate:beginDate,endDate:endDate}))))}else{if(this.#selectionMode!==DatePickerControlElement.SELECTION_MODE_SINGLE)throw new Error("Invalid selection mode");{const date=dateParserFn(value);isInvalidDate(date)?(this.#beginDate=null,this.#internals.setFormValue(null),this.removeAttribute("value"),this.dispatchEvent(new PickedDateSetEvent({beginDate:null,endDate:null}))):(this.#beginDate=date,this.#internals.setFormValue(dateToString(date)),this.dispatchEvent(new PickedDateSetEvent({beginDate:date,endDate:null})))}}const[beginDateStr,endDateStr]=(value??"").split("/"),beginDate=beginDateStr?new Date(beginDateStr):new Date(1/0),endDate=endDateStr?new Date(endDateStr):new Date(1/0),isInvalidBeginDate=isInvalidDate(beginDate),isInvalidEndDate=isInvalidDate(endDate);if(isInvalidBeginDate)this.#beginDate=null,this.#endDate=null,this.#internals.setFormValue(null),this.removeAttribute("value"),this.dispatchEvent(new PickedDateSetEvent({beginDate:null,endDate:null}));else{const beginDateStr=dateToString(beginDate);if(this.#beginDate=beginDate,isInvalidEndDate)this.#endDate=null,this.#internals.setFormValue(beginDateStr),this.dispatchEvent(new PickedDateSetEvent({beginDate:beginDate,endDate:null}));else{const endDateStr=dateToString(endDate);this.#endDate=endDate,this.#internals.setFormValue(`${beginDateStr}/${endDateStr}`),this.dispatchEvent(new PickedDateSetEvent({beginDate:beginDate,endDate:endDate}))}}}get beginDateValue(){return this.#beginDate instanceof Date?new Date(this.#beginDate):null}get endDateValue(){return this.#endDate instanceof Date?new Date(this.#endDate):null}get form(){return this.#internals.form}get name(){return this.attributes.getNamedItem("name")?.nodeValue}get type(){return this.localName}get validity(){return this.#internals.validity}get validationMessage(){return this.#internals.validationMessage}get willValidate(){return this.#internals.willValidate}checkValidity(){return this.#internals.checkValidity()}reportValidity(){return this.#internals.reportValidity()}}var _a;class DatePickerViewElement extends ContextAwareElement{static#ID_INC=0;static#STYLES=function(){const style=new CSSStyleSheet;return style.replace('\n:host {\n  --si-width: 336px;\n  --si-calendar-label-margin: 8px;\n  --si-calendar-label-text-color: dimgray;\n  --si-cell-size: calc(var(--si-width) / 7);\n  --si-cell-width: var(--si-cell-size);\n  --si-cell-height: var(--si-cell-size);\n  --si-cell-bg-color: white;\n  --si-cell-text-color: black;\n  --si-cell-font-weight: normal;\n  --si-cell-selected-bg-color: aliceblue;\n  --si-cell-selected-text-color: black;\n  --si-cell-selected-font-weight: bold;\n  --si-cell-weekend-text-color: red;\n  --si-cell-other-month-text-color: silver;\n  --si-cell-other-month-weekend-text-color: tomato;\n  --si-cell-font-size: 16px;\n  --si-inner-cell-selected-bg-color: lightblue;\n  --si-inner-cell-padding: 10px;\n  --si-inner-cell-size: min(\n    calc(var(--si-cell-width) - var(--si-inner-cell-padding)),\n    calc(var(--si-cell-height) - var(--si-inner-cell-padding))\n  );\n  --si-header-height: calc(var(--si-cell-size) - 4px);\n  --si-section-height: calc(\n      var(--si-header-height)\n      + var(--si-calendar-label-margin)\n      + var(--si-header-height)\n      + var(--si-calendar-label-margin)\n      + var(--si-cell-height)\n      + var(--si-cell-height)\n      + var(--si-cell-height)\n      + var(--si-cell-height)\n      + var(--si-cell-height)\n      + var(--si-cell-height)\n  );\n  --si-section-width: var(--si-width);\n  display: block;\n  font-family: sans-serif;\n  width: var(--si-width);\n  height: var(--si-section-height);\n}\n\n.sr-only {\n  display: none;\n  visibility: hidden;\n}\n\nsection {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: var(--si-section-width);\n  height: var(--si-section-height);\n}\n\nsection > header {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  height: var(--si-header-height);\n}\n\nsection > header > .year-month-pagination {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n}\n\nsection > header > .year-month-pagination > button {\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  width: var(--si-cell-size);\n  height: var(--si-header-height);\n  margin: 0;\n  padding: 0;\n  border: var(--si-button-border, 1px solid none);\n  background-color: var(--si-button-bg-color, none);\n}\n\nsection select[name="month"] {\n  box-sizing: border-box;\n  height: var(--si-header-height);\n  padding: 0 8px;\n}\n\nsection input[name="year"] {\n  box-sizing: border-box;\n  display: block;\n  width: 96px;\n  height: var(--si-header-height);\n  padding: 0 8px;\n}\n\nsection > table {\n  border-collapse: collapse;\n  border-spacing: 0;\n  width: var(--si-width);\n}\n\nsection > table,\nsection > table > thead > tr > th,\nsection > table > tbody > tr > td {\n  border: none;\n}\n\nsection > table > thead > tr > th,\nsection > table > thead > tr > th > span,\nsection > table > tbody > tr > td,\nsection > table > tbody > tr > td > label {\n  box-sizing: border-box;\n  width: var(--si-cell-width);\n  height: var(--si-cell-height);\n  padding: 0;\n  margin: 0;\n  font-size: var(--si-cell-font-size);\n}\n\nsection > table > thead > tr > th > span {\n  -webkit-user-select: none;\n  user-select: none;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  line-height: 1;\n  margin-top: var(--si-calendar-label-margin);\n  margin-bottom: var(--si-calendar-label-margin);\n  font-weight: normal;\n  color: var(--si-calendar-label-text-color);\n}\n\nsection > table > tbody > tr > td > label {\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n}\n\nsection > table > tbody > tr > td > label.range-selected {\n  background-color: var(--si-cell-selected-bg-color);\n}\n\nsection > table > tbody > tr > td > label.range-selected-first {\n  border-top-left-radius: 50%;\n  border-bottom-left-radius: 50%;\n}\n\nsection > table > tbody > tr > td > label.range-selected-last {\n  border-top-right-radius: 50%;\n  border-bottom-right-radius: 50%;\n}\n\nsection > table > tbody > tr > td > label > input {\n  display: none;\n  visibility: hidden;\n}\n\nsection > table > tbody > tr > td > label > span {\n  -webkit-user-select: none;\n  user-select: none;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  width: var(--si-inner-cell-size);\n  height: var(--si-inner-cell-size);\n  border-radius: 50%;\n}\n\nsection > table > tbody > tr > td > label > span > span {\n  display: block;\n  padding: 0;\n  margin: 0;\n  font-variant-numeric: normal;\n  line-height: 1;\n}\n\nsection > table > tbody > tr > td > label:has(input:checked) > span {\n  background-color: var(--si-inner-cell-selected-bg-color);\n}\n\nsection > table > tbody > tr > td > label:has(input:checked) > span > span {\n  color: var(--si-cell-selected-text-color, white);\n  font-weight: var(--si-cell-selected-font-weight, bold);\n}\n\nsection > table > tbody > tr > td > label.weekend > span > span {\n  color: var(--si-cell-weekend-text-color);\n}\n\nsection > table > tbody > tr > td > label.other-month > span > span {\n  color: var(--si-cell-other-month-text-color);\n}\n\nsection > table > tbody > tr > td > label.other-month.weekend > span > span {\n  color: var(--si-cell-other-month-weekend-text-color);\n}\n    '),[style]}();static get observedAttributes(){return["lang","timeperiod"]}#shadowRoot=this.attachShadow({mode:"closed"});#idSufix=_a.#ID_INC++;#calendarTbody;#yearInput;#monthSelect;#yearMonthControlsSlot;#minYear=100;#maxYear=275759;#yearView=0;#monthIndexView=0;#selectionMode=DatePickerControlElement.SELECTION_MODE_SINGLE;#selectedBeginDate;#selectedEndDate;#isDateDisabled=date=>!1;async connectedCallback(){this.#shadowRoot.adoptedStyleSheets=_a.#STYLES,this.#render();const controlCtx=await this.requireContext(DatePickerControlElement),viewCtx=await this.requireContext(_a);this.#selectionMode=controlCtx.selectionMode,this.#selectedBeginDate=controlCtx.beginDateValue,this.#selectedEndDate=controlCtx.endDateValue,controlCtx.addEventListener(SelectedDateSetEvent.EVENT_TYPE,this.#handleSelectedDateSet),controlCtx.addEventListener(SelectionModeSetEvent.EVENT_TYPE,this.#handleSelectionModeSet),viewCtx.addEventListener(CalendarViewChangeEvent.EVENT_TYPE,this.#handleCalendarViewChange);const defaultDate=this.#selectedBeginDate instanceof Date?this.#selectedBeginDate:new Date;this.#setYearMonthView(defaultDate.getFullYear(),defaultDate.getMonth())}async disconnectedCallback(){const controlCtx=await this.requireContext(DatePickerControlElement),viewCtx=await this.requireContext(_a);controlCtx.removeEventListener(SelectedDateSetEvent.EVENT_TYPE,this.#handleSelectedDateSet),controlCtx.removeEventListener(SelectionModeSetEvent.EVENT_TYPE,this.#handleSelectionModeSet),viewCtx.removeEventListener(CalendarViewChangeEvent.EVENT_TYPE,this.#handleCalendarViewChange)}get monthNames(){const formatter=new Intl.DateTimeFormat(this.#locale,{month:"long"});return[...Array(12).keys()].map((monthIndex=>{const date=new Date(2e3,monthIndex);return formatter.format(date)}))}get dayShortNames(){const formatter=new Intl.DateTimeFormat(this.#locale,{weekday:"short"}),dayIndexes=[...Array(7).keys()],firstDayOfWeekDate=new Date(2e3,0,1);return firstDayOfWeekDate.setDate(firstDayOfWeekDate.getDate()-firstDayOfWeekDate.getDay()),dayIndexes.map((dayIndex=>{const date=new Date(firstDayOfWeekDate);return date.setDate(date.getDate()+dayIndex),formatter.format(date)}))}get yearView(){return this.#yearView}get monthIndexView(){return this.#monthIndexView}setSelectedBeginDate(date){isInvalidDate(date)?this.#selectedBeginDate=null:this.#selectedBeginDate=date,this.#selectedEndDate=null,this.#patchRangeSelection()}setSelectedEndDate(date){if(!(this.#selectedBeginDate instanceof Date))throw new Error("Begin date must be set first");if(isInvalidDate(date))this.#selectedEndDate=null;else{if(date.getTime()<this.#selectedBeginDate.getTime())return void this.setSelectedBeginDate(date);this.#selectedEndDate=new Date(date)}this.#patchRangeSelection()}async setDisabledFilter(filterFn){this.#isDateDisabled=filterFn;(await this.requireContext(_a)).dispatchEvent(new CalendarViewChangeEvent)}async#setYearMonthView(year,monthIndex){this.#yearView=year,this.#monthIndexView=monthIndex;const monthLabel=this.monthNames[monthIndex];this.#monthSelect.selectedIndex=monthIndex,this.#yearInput.value=year.toString();const viewCtx=await this.requireContext(_a);viewCtx.dispatchEvent(new YearMonthViewChangeEvent(year,monthIndex,monthLabel)),viewCtx.dispatchEvent(new CalendarViewChangeEvent)}#handleCalendarViewChange=event=>{if(event instanceof CalendarViewChangeEvent){const newCalendar=this.#renderCalendar();this.#calendarTbody.replaceWith(newCalendar),this.#calendarTbody=newCalendar,this.#patchRangeSelection()}};get#datesByWeekView(){const year=this.yearView,monthIndex=this.monthIndexView,beginOfMonthDate=new Date(year,monthIndex,1,0,0,0,0),beginOfWeekOfMonthDate=new Date(beginOfMonthDate);beginOfWeekOfMonthDate.setDate(beginOfWeekOfMonthDate.getDate()-beginOfWeekOfMonthDate.getDay());const endOfMonthDate=new Date(year,monthIndex+1,0,0,0,0,0),endOfWeekOfMonthDate=new Date(endOfMonthDate);endOfWeekOfMonthDate.setDate(endOfWeekOfMonthDate.getDate()+(6-endOfWeekOfMonthDate.getDay()));let date=new Date(beginOfWeekOfMonthDate);const weeksView=[{dates:[{date:new Date(date),isCurrMonth:!1,isPrevMonth:!0,isNextMonth:!1,isToday:!1,isWeekend:!1,isDisabled:!1}].slice(0,0)}];let dayIndex=0;const selectedDateString=isInvalidDate(this.#selectedBeginDate)?null:dateToString(this.#selectedBeginDate);for(;date.getTime()<=endOfWeekOfMonthDate.getTime()||weeksView.length<=6;){const latestWeek=weeksView[weeksView.length-1],dateDayIndex=date.getDay(),dateMonthIndex=date.getMonth(),yearViewDiff=12*(date.getFullYear()-this.yearView),isCurrMonth=yearViewDiff+dateMonthIndex===this.monthIndexView,isPrevMonth=yearViewDiff+dateMonthIndex<this.monthIndexView,isNextMonth=yearViewDiff+dateMonthIndex>this.monthIndexView,isToday=dateToString(date)===selectedDateString,isWeekend=0===dateDayIndex||6===dateDayIndex,isDisabled="function"==typeof this.#isDateDisabled&&this.#isDateDisabled(date);latestWeek.dates.push({date:new Date(date),numericDate:dateToNumber(date),isCurrMonth:isCurrMonth,isPrevMonth:isPrevMonth,isNextMonth:isNextMonth,isToday:isToday,isWeekend:isWeekend,isDisabled:isDisabled}),date.setDate(date.getDate()+1),dayIndex++,7===dayIndex&&(weeksView.push({dates:[]}),dayIndex=0)}return weeksView}#id(name){return`${name}-${this.#idSufix}`}get#locale(){return this.lang||"en"}#viewPrevMonth(){const monthIndex=this.#monthSelect.selectedIndex,year=parseInt(this.#yearInput.value,10),prevMonthIndex=monthIndex-1;prevMonthIndex<0?(this.#monthSelect.selectedIndex=11,this.#yearInput.value=(year-1).toString(),this.#setYearMonthView(year-1,11)):(this.#monthSelect.selectedIndex=prevMonthIndex,this.#setYearMonthView(year,prevMonthIndex))}#viewNextMonth(){const monthIndex=this.#monthSelect.selectedIndex,year=parseInt(this.#yearInput.value,10),nextMonthIndex=monthIndex+1;nextMonthIndex>11?(this.#monthSelect.selectedIndex=0,this.#yearInput.value=(year+1).toString(),this.#setYearMonthView(year+1,0)):(this.#monthSelect.selectedIndex=nextMonthIndex,this.#setYearMonthView(year,nextMonthIndex))}async#handleDateSelect(date){if(this.#selectionMode===DatePickerControlElement.SELECTION_MODE_SINGLE)this.#selectedBeginDate instanceof Date&&this.#selectedBeginDate.getTime()===date.getTime()?this.setSelectedBeginDate(null):this.setSelectedBeginDate(date);else{if(this.#selectionMode!==DatePickerControlElement.SELECTION_MODE_RANGE)throw new Error("Invalid selection mode: "+this.#selectionMode);this.#selectedBeginDate instanceof Date?date.getTime()<this.#selectedBeginDate.getTime()?this.setSelectedBeginDate(date):this.#selectedBeginDate.getTime()===date.getTime()?this.setSelectedBeginDate(null):this.#selectedEndDate instanceof Date?this.setSelectedBeginDate(date):this.setSelectedEndDate(date):this.setSelectedBeginDate(date)}(await this.requireContext(DatePickerControlElement)).dispatchEvent(new SelectedDateChangeEvent({beginDate:this.#selectedBeginDate,endDate:this.#selectedEndDate}))}#handleSelectionModeSet=event=>{event instanceof SelectionModeSetEvent&&(this.#selectionMode=event.detail.selectionMode,this.setSelectedEndDate(null))};#handleSelectedDateSet=event=>{event instanceof SelectedDateSetEvent&&(this.#selectedBeginDate=event.detail.beginDate,this.#selectedEndDate=event.detail.endDate,this.#patchRangeSelection())};#render(){this.#shadowRoot.appendChild(el("section",(()=>[el("header",(()=>[this.#yearMonthControlsSlot=el("slot",(()=>[at("name","year-month-controls"),el("label",(()=>[at("class","sr-only"),at("for",this.#id("month-select")),tx("Month")])),this.#monthSelect=el("select",(()=>[at("id",this.#id("month-select")),at("name","month"),at("aria-label","Month"),on("change",(event=>{event.preventDefault();const monthIndex=this.#monthSelect.selectedIndex,year=parseInt(this.#yearInput.value,10);this.#setYearMonthView(year,monthIndex)})),...this.monthNames.map(((monthName,index)=>el("option",(()=>[at("value",monthName),...index===this.monthIndexView?[at("selected","selected")]:[],tx(monthName)]))))])),el("label",(()=>[at("class","sr-only"),at("for",this.#id("year-input")),tx("Year")])),this.#yearInput=el("input",(()=>[at("id",this.#id("year-input")),at("type","number"),at("name","year"),at("aria-label","Year"),at("value",this.yearView.toString()),at("min",this.#minYear.toString()),at("max",this.#maxYear.toString()),on("change",(event=>{const monthIndex=this.#monthSelect.selectedIndex,year=parseInt(this.#yearInput.value,10);year<this.#minYear?(event.preventDefault(),this.#yearInput.setCustomValidity(`Year must be greater than or equal to ${this.#minYear}`),this.#yearInput.reportValidity()):year>this.#maxYear&&(event.preventDefault(),this.#yearInput.setCustomValidity(`Year must be less than or equal to ${this.#maxYear}`),this.#yearInput.reportValidity()),this.#setYearMonthView(year,monthIndex)}))]))])),el("div",(()=>[at("class","year-month-pagination"),el("button",(()=>[at("type","button"),on("click",(event=>{event.preventDefault(),this.#viewPrevMonth()})),el("slot",(()=>[at("name","prev-icon"),slot=>slot.innerHTML='\n                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="24" width="24" title="Previous"><path fill="currentColor" d="m432-480 156 156q11 11 11 28t-11 28q-11 11-28 11t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L432-480Z"/></svg>\n              ']))])),el("button",(()=>[at("type","button"),on("click",(event=>{event.preventDefault(),this.#viewNextMonth()})),el("slot",(()=>[at("name","next-icon"),slot=>slot.innerHTML='\n                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="24" width="24" title="Next"><path fill="currentColor" d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z"/></svg>\n              ']))]))]))])),el("table",(()=>[el("thead",(()=>[el("tr",(()=>[...this.dayShortNames.map((dayShortName=>el("th",(()=>[el("span",(()=>[tx(dayShortName)]))]))))]))])),this.#calendarTbody=el("tbody",(()=>[]))]))])))}#renderCalendar(){return el("tbody",(()=>[...this.#datesByWeekView.map((week=>el("tr",(()=>[...week.dates.map((date=>el("td",(()=>[el("label",(()=>[at("class",[...date.isWeekend?["weekend"]:[],...date.isCurrMonth?[]:["other-month"]].join(" ")),el("input",(()=>[at("type","checkbox"),at("name","date"),at("value",date.date.toISOString()),...date.isDisabled?[at("disabled","disabled")]:[],...date.isToday?[at("checked","checked")]:[],on("change",(event=>{try{this.#handleDateSelect(date.date),date.isPrevMonth?this.#viewPrevMonth():date.isNextMonth&&this.#viewNextMonth()}catch(error){throw event.preventDefault(),error}}))])),el("span",(()=>[el("span",(()=>[tx(date.date.getDate().toString().padStart(2,"0"))]))]))]))]))))]))))]))}#patchRangeSelection(){if(!(this.#calendarTbody instanceof HTMLTableSectionElement))return;const beginDate=this.#selectedBeginDate,endDate=this.#selectedEndDate,beginNumericDate=dateToNumber(beginDate),endNumericDate=dateToNumber(endDate),isSingleSelect=this.#selectionMode===DatePickerControlElement.SELECTION_MODE_SINGLE,treeWalker=document.createTreeWalker(this.#calendarTbody,NodeFilter.SHOW_ELEMENT,{acceptNode:node=>node instanceof HTMLInputElement&&"date"===node.name?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP});let input=treeWalker.currentNode;for(;input instanceof Node;){if(input=treeWalker.nextNode(),!(input instanceof HTMLInputElement))continue;const label=input.labels.item(0);if(!(label instanceof HTMLLabelElement))continue;label.classList.remove("range-selected"),label.classList.remove("range-selected-first"),label.classList.remove("range-selected-last");const numericDate=dateToNumber(new Date(input.value)),isFirst=numericDate===beginNumericDate,isLast=numericDate===endNumericDate;if(isFirst||isLast?(input.checked=!0,input.setAttribute("checked","checked")):(input.checked=!1,input.removeAttribute("checked")),isSingleSelect)continue;numericDate>=beginNumericDate&&numericDate<=endNumericDate&&label.classList.add("range-selected"),isFirst?label.classList.add("range-selected-first"):isLast&&label.classList.add("range-selected-last")}}}_a=DatePickerViewElement,customElements.define("f-date-picker-view",DatePickerViewElement);class DatePickerInlineElement extends DatePickerControlElement{static#STYLES=function(){const style=new CSSStyleSheet;return style.replace("\n    "),[style]}();static get formAssociated(){return!0}static get observedAttributes(){return["value","time-unit","selection-mode"]}#shadowRoot=this.attachShadow({mode:"closed"});connectedCallback(){super.connectedCallback(),this.#shadowRoot.adoptedStyleSheets=DatePickerInlineElement.#STYLES,this.#render()}async attributeChangedCallback(name,oldValue,newValue){if("value"===name){this.value=newValue;(await this.requireContext(DatePickerControlElement)).dispatchEvent(new PickedDateSetEvent({beginDate:this.beginDateValue,endDate:this.endDateValue}))}else if("time-unit"===name)this.timeUnit=newValue;else if("selection-mode"===name){this.selectionMode=newValue;(await this.requireContext(DatePickerControlElement)).dispatchEvent(new SelectionModeSetEvent(this.selectionMode))}}#render(){this.#shadowRoot.appendChild(el("slot",(()=>[at("name","date-picker-view"),el("f-date-picker-view",(()=>[]))])))}}customElements.define("f-date-picker-inline",DatePickerInlineElement);class DatePickerMonthViewElement extends ContextAwareElement{#shadowRoot=this.attachShadow({mode:"closed"});#text;async connectedCallback(){this.#render();const viewCtx=await this.requireContext(DatePickerViewElement);viewCtx.addEventListener(YearMonthViewChangeEvent.EVENT_TYPE,this.#handleMonthViewChange),this.#text.nodeValue=viewCtx.monthNames[viewCtx.monthIndexView]}async disconnectedCallback(){(await this.requireContext(DatePickerViewElement)).removeEventListener(YearMonthViewChangeEvent.EVENT_TYPE,this.#handleMonthViewChange)}#handleMonthViewChange=event=>{event instanceof YearMonthViewChangeEvent&&(this.#text.nodeValue=event.detail.monthLabel.toString())};#render(){this.#shadowRoot.appendChild(this.#text=tx(""))}}customElements.define("f-date-picker-month-view",DatePickerMonthViewElement);class DatePickerYearViewElement extends ContextAwareElement{static get requiredContexts(){return[DatePickerViewElement]}#shadowRoot=this.attachShadow({mode:"closed"});#text;async connectedCallback(){this.#render();(await this.requireContext(DatePickerViewElement)).addEventListener(YearMonthViewChangeEvent.EVENT_TYPE,this.#handleChange)}async disconnectedCallback(){const viewCtx=await this.requireContext(DatePickerViewElement);viewCtx.removeEventListener(YearMonthViewChangeEvent.EVENT_TYPE,this.#handleChange),this.#text.nodeValue=viewCtx.yearView?.toString()}#handleChange=event=>{event instanceof YearMonthViewChangeEvent&&(this.#text.nodeValue=event.detail.year.toString())};#render(){this.#shadowRoot.appendChild(this.#text=tx(""))}}customElements.define("f-date-picker-year-view",DatePickerYearViewElement);class PickedDateChangeEvent extends DateRelatedEvent{static get EVENT_TYPE(){return"change"}constructor(dateRange,options){super(PickedDateChangeEvent.EVENT_TYPE,dateRange,options)}}class DatePickerDialogElement extends DatePickerControlElement{static#STYLES=function(){const style=new CSSStyleSheet;return style.replace("\n:host {\n  --si-input-button-height: 36px;\n  --si-submit-button-height: 36px;\n  --si-dialog-radius: 4px;\n  --si-dialog-padding: 16px;\n}\nbutton {\n  display: block;\n  padding: 0 8px;\n  height: var(--si-input-button-height);\n}\ndialog {\n  border: none;\n  padding: var(--si-dialog-padding);\n  border-radius: var(--si-dialog-radius);\n}\ndialog > form > slot > div {\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n  margin-top: 8px;\n}\ndialog > form > slot > div > button {\n  display: block;\n  padding: 0 8px;\n  height: var(--si-submit-button-height);\n}\n    "),[style]}();static get formAssociated(){return!0}static get observedAttributes(){return["open","value"]}#shadowRoot=this.attachShadow({mode:"closed"});#buttonText;#dialog;#form;#selectedBeginDate;#selectedEndDate;async connectedCallback(){const controlCtx=await this.requireContext(DatePickerControlElement);controlCtx.addEventListener(PickedDateChangeEvent.EVENT_TYPE,this.#handlePickedDateChange),controlCtx.addEventListener(PickedDateSetEvent.EVENT_TYPE,this.#handlePickedDateSet),controlCtx.addEventListener(SelectedDateChangeEvent.EVENT_TYPE,this.#handleSelectedDateChange),super.connectedCallback(),this.#shadowRoot.adoptedStyleSheets=DatePickerDialogElement.#STYLES,this.#render(),this.#dialog.addEventListener("open",this.#handleDialogOpen),this.#dialog.addEventListener("close",this.#handleDialogClose),this.hasAttribute("open")?this.#openDatePicker():this.#closeDatePicker(),this.#updateButtonText()}async disconnectedCallback(){this.#dialog.removeEventListener("open",this.#handleDialogOpen),this.#dialog.removeEventListener("close",this.#handleDialogClose);const controlCtx=await this.requireContext(DatePickerControlElement);controlCtx.removeEventListener(PickedDateChangeEvent.EVENT_TYPE,this.#handlePickedDateChange),controlCtx.removeEventListener(PickedDateSetEvent.EVENT_TYPE,this.#handlePickedDateSet),controlCtx.removeEventListener(SelectedDateChangeEvent.EVENT_TYPE,this.#handleSelectedDateChange)}attributeChangedCallback(name,oldValue,newValue){"open"===name?null===newValue?this.#closeDatePicker():this.#openDatePicker():"value"===name&&(this.value=null===newValue?null:newValue,this.#updateButtonText())}requestSubmit=()=>{this.#form.requestSubmit()};openDatePicker(){this.#openDatePicker()}closeDatePicker(){this.#closeDatePicker()}#updateButtonText(){this.beginDateValue instanceof Date?this.#buttonText instanceof Text&&(this.#buttonText.nodeValue=`Selected Date: ${this.value}`):this.#buttonText instanceof Text&&(this.#buttonText.nodeValue="Select Date")}#openDatePicker=async()=>{if(this.#dialog instanceof HTMLDialogElement){(await this.requireContext(DatePickerControlElement)).dispatchEvent(new SelectedDateSetEvent({beginDate:this.#selectedBeginDate,endDate:this.#selectedEndDate})),this.#dialog.showModal(),this.hasAttribute("open")||this.setAttribute("open","")}};#closeDatePicker=()=>{this.#dialog instanceof HTMLDialogElement&&this.#dialog.close()};#handleDialogOpen=async()=>{this.hasAttribute("open")||this.setAttribute("open","")};#handleDialogClose=()=>{this.hasAttribute("open")&&this.removeAttribute("open")};#handleSelectedDateChange=event=>{if(event instanceof SelectedDateChangeEvent){const{beginDate:beginDate,endDate:endDate}=event.detail;this.#selectedBeginDate=beginDate,this.#selectedEndDate=endDate}};#handlePickedDateChange=event=>{event instanceof PickedDateChangeEvent&&this.#updateButtonText()};#handlePickedDateSet=event=>{if(event instanceof PickedDateSetEvent){const{beginDate:beginDate,endDate:endDate}=event.detail;this.#selectedBeginDate=beginDate,this.#selectedEndDate=endDate,this.#updateButtonText()}};#handleFormSubmit=()=>{if(this.selectionMode===DatePickerControlElement.SELECTION_MODE_SINGLE)this.value=dateToString(this.#selectedBeginDate);else{if(this.selectionMode!==DatePickerControlElement.SELECTION_MODE_RANGE)throw new Error("Invalid selection mode");this.value=function({beginDate:beginDate,endDate:endDate}){return isInvalidDate(beginDate)||isInvalidDate(endDate)?"":`${dateToString(beginDate)}/${dateToString(endDate)}`}({beginDate:this.#selectedBeginDate,endDate:this.#selectedEndDate})}this.#updateButtonText()};#render(){this.#shadowRoot.appendChild(el("div",(()=>[el("slot",(()=>[at("name","date-picker-controls"),el("button",(()=>[on("click",this.#openDatePicker),this.#buttonText=tx("Select Date")]))])),this.#dialog=el("dialog",(()=>[this.#form=el("form",(()=>[at("method","dialog"),on("submit",this.#handleFormSubmit),el("slot",(()=>[at("name","date-picker-view"),el("f-date-picker-view",(()=>[]))])),el("slot",(()=>[at("name","form-controls"),el("div",(()=>[el("button",(()=>[at("type","button"),on("click",this.#closeDatePicker),tx("Cancel")])),el("button",(()=>[at("type","submit"),tx("Apply")]))]))]))]))]))])))}}customElements.define("f-date-picker-dialog",DatePickerDialogElement);export{DatePickerDialogElement,DatePickerInlineElement,DatePickerMonthViewElement,DatePickerViewElement,DatePickerYearViewElement,PickedDateChangeEvent};
//# sourceMappingURL=date-picker.js.map
