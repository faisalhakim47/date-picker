var S=class n extends CustomEvent{static get EVENT_TYPE(){return"calendar-view-change"}constructor(e){super(n.EVENT_TYPE,e)}};var D=class extends CustomEvent{#s;#n;constructor(e,t,i){super(e,{...i,detail:{...i?.detail,...t}}),this.#s=t.beginDate,this.#n=t.endDate}get beginDate(){return this.#s}get endDate(){return this.#n}};var C=class n extends D{static get EVENT_TYPE(){return"selected-date-change"}constructor(e,t){super(n.EVENT_TYPE,e,t)}};var I=class n extends D{static get EVENT_TYPE(){return"selected-date-set"}constructor(e,t){super(n.EVENT_TYPE,e,t)}};var N=class n extends CustomEvent{static get EVENT_TYPE(){return"selection-mode-set"}#s;constructor(e,t){super(n.EVENT_TYPE,{...t,detail:{...t?.detail,selectionMode:e}}),this.#s=e}get selectionMode(){return this.#s}};var b=class n extends CustomEvent{static get EVENT_TYPE(){return"year-month-view-change"}#s;#n;constructor(e,t,i,s){super(n.EVENT_TYPE,{...s,detail:{...s?.detail,year:e,monthIndex:t,monthLabel:i}}),this.#s=e,this.#n=t}get year(){return this.#s}get monthIndex(){return this.#n}};function q({beginDate:n,endDate:e}){if(g(n)||g(e))return"";let t=f(n),i=f(e);return`${t}/${i}`}function f(n){return g(n)?"":n.toISOString().split("T")[0]}function g(n){if(!n)return!0;let e=new Date(n);return e===null||isNaN(e.getTime())}function L(n){if(g(n))return 0;let e=f(n);return parseInt(e.replace(/-/g,""),10)}function U(n){let[e,t,i]=n.split("-"),s=(i||"").split("T")[0].split(" ")[0],d=parseInt(e,10),m=parseInt(t,10),r=parseInt(s,10);return new Date(d,m-1,r)}function a(n,e){let t=typeof n=="string"?document.createElement(n):n,i=e(t);for(let s of i)if(s instanceof Attr)t.setAttributeNode(s);else if(s instanceof Node)t.appendChild(s);else if(typeof s=="function")s(t);else if(typeof s=="string"){let d=document.createTextNode(s);t.appendChild(d)}return t}function o(n,e){let t=document.createAttribute(n);return t.value=e,t}function p(n){return document.createTextNode(n)}function x(n,e,t){return function(i){let s=e;i.addEventListener(n,s,t)}}var w=class extends HTMLElement{async requireContext(e){return new Promise((t,i)=>{setTimeout(()=>{let s=this;for(;s instanceof Node;){if(s instanceof e){t(s);return}s instanceof ShadowRoot?s=s.host:s=s.parentNode}console.warn(`Context ${e.name} not found`),i(new Error(`Context ${e.name} not found`))})})}};var h=class n extends D{static get EVENT_TYPE(){return"picked-date-set"}constructor(e,t){super(n.EVENT_TYPE,e,t)}};var l=class n extends w{static get formAssociated(){return!0}static TIME_UNIT_DAY="day";static SELECTION_MODE_SINGLE="single";static SELECTION_MODE_RANGE="range";static#s=[n.TIME_UNIT_DAY];static#n=[n.SELECTION_MODE_SINGLE,n.SELECTION_MODE_RANGE];#e=this.attachInternals();#a="day";#r="single";#t;#i;connectedCallback(){if(this.hasAttribute("value")&&(this.value=this.getAttribute("value")),this.hasAttribute("time-unit")){let e=this.getAttribute("time-unit");this.timeUnit=e}if(this.hasAttribute("selection-mode")){let e=this.getAttribute("selection-mode");this.selectionMode=e}}get timeUnit(){return this.#a}set timeUnit(e){if(!n.#s.includes(e)){console.warn("Invalid time unit",e);return}this.#a=e}get selectionMode(){return this.#r}set selectionMode(e){if(!n.#n.includes(e)){console.warn("Invalid selection mode",e);return}this.#r=e}get value(){let e=null;if(this.#a===n.TIME_UNIT_DAY)e=f;else throw new Error("Invalid time unit");if(this.#r===n.SELECTION_MODE_RANGE)return this.#t instanceof Date&&this.#i instanceof Date?`${e(this.#t)}/${e(this.#i)}`:null;if(this.#r===n.SELECTION_MODE_SINGLE)return this.#t instanceof Date?e(this.#t):null;throw new Error("Invalid selection mode")}set value(e){if(!e){this.#t=null,this.#i=null,this.#e.setFormValue(null),this.removeAttribute("value"),this.dispatchEvent(new h({beginDate:null,endDate:null}));return}let t=null;if(this.#a===n.TIME_UNIT_DAY)t=U;else throw new Error("Invalid time unit");if(this.#r===n.SELECTION_MODE_RANGE){if(!e?.includes("/")){console.warn("Invalid date range format",e);return}let[u,v]=e.split("/"),T=t(u),y=t(v);g(T)?(this.#t=null,this.#i=null,this.#e.setFormValue(null),this.removeAttribute("value"),this.dispatchEvent(new h({beginDate:null,endDate:null}))):(this.#t=T,g(y)?(this.#i=null,this.#e.setFormValue(u),this.dispatchEvent(new h({beginDate:T,endDate:null}))):(this.#i=y,this.#e.setFormValue(`${u}/${v}`),this.dispatchEvent(new h({beginDate:T,endDate:y}))))}else if(this.#r===n.SELECTION_MODE_SINGLE){let u=t(e);g(u)?(this.#t=null,this.#e.setFormValue(null),this.removeAttribute("value"),this.dispatchEvent(new h({beginDate:null,endDate:null}))):(this.#t=u,this.#e.setFormValue(f(u)),this.dispatchEvent(new h({beginDate:u,endDate:null})))}else throw new Error("Invalid selection mode");let[i,s]=(e??"").split("/"),d=i?new Date(i):new Date(1/0),m=s?new Date(s):new Date(1/0),r=g(d),c=g(m);if(r)this.#t=null,this.#i=null,this.#e.setFormValue(null),this.removeAttribute("value"),this.dispatchEvent(new h({beginDate:null,endDate:null}));else{let u=f(d);if(this.#t=d,c)this.#i=null,this.#e.setFormValue(u),this.dispatchEvent(new h({beginDate:d,endDate:null}));else{let v=f(m);this.#i=m,this.#e.setFormValue(`${u}/${v}`),this.dispatchEvent(new h({beginDate:d,endDate:m}))}}}get beginDateValue(){return this.#t instanceof Date?new Date(this.#t):null}get endDateValue(){return this.#i instanceof Date?new Date(this.#i):null}get form(){return this.#e.form}get name(){return this.attributes.getNamedItem("name")?.nodeValue}get type(){return this.localName}get validity(){return this.#e.validity}get validationMessage(){return this.#e.validationMessage}get willValidate(){return this.#e.willValidate}checkValidity(){return this.#e.checkValidity()}reportValidity(){return this.#e.reportValidity()}};var k,E=class extends w{static#s=0;static#n=function(){let e=new CSSStyleSheet;return e.replace(`
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
    `),[e]}();static get observedAttributes(){return["lang","timeperiod"]}#e=this.attachShadow({mode:"closed"});#a=k.#s++;#r;#t;#i;#u;#m=100;#d=275759;#g=0;#p=0;#c=l.SELECTION_MODE_SINGLE;#o;#l;#f=e=>!1;async connectedCallback(){this.#e.adoptedStyleSheets=k.#n,this.#I();let e=await this.requireContext(l),t=await this.requireContext(k);this.#c=e.selectionMode,this.#o=e.beginDateValue,this.#l=e.endDateValue,e.addEventListener(I.EVENT_TYPE,this.#y),e.addEventListener(N.EVENT_TYPE,this.#T),t.addEventListener(S.EVENT_TYPE,this.#v);let i=this.#o instanceof Date?this.#o:new Date;this.#h(i.getUTCFullYear(),i.getUTCMonth())}async disconnectedCallback(){let e=await this.requireContext(l),t=await this.requireContext(k);e.removeEventListener(I.EVENT_TYPE,this.#y),e.removeEventListener(N.EVENT_TYPE,this.#T),t.removeEventListener(S.EVENT_TYPE,this.#v)}get monthNames(){let e=new Intl.DateTimeFormat(this.#D,{month:"long"});return[...Array(12).keys()].map(i=>{let s=new Date(2e3,i);return e.format(s)})}get dayShortNames(){let e=new Intl.DateTimeFormat(this.#D,{weekday:"short"}),t=[...Array(7).keys()],i=new Date(2e3,0,1);return i.setUTCDate(i.getUTCDate()-i.getUTCDay()),t.map(s=>{let d=new Date(i);return d.setUTCDate(d.getUTCDate()+s),e.format(d)})}get yearView(){return this.#g}get monthIndexView(){return this.#p}setSelectedBeginDate(e){g(e)?this.#o=null:this.#o=e,this.#l=null,this.#b()}setSelectedEndDate(e){if(!(this.#o instanceof Date))throw new Error("Begin date must be set first");if(g(e))this.#l=null;else{if(e.getTime()<this.#o.getTime()){this.setSelectedBeginDate(e);return}this.#l=new Date(e)}this.#b()}async setDisabledFilter(e){this.#f=e,(await this.requireContext(k)).dispatchEvent(new S)}async#h(e,t){this.#g=e,this.#p=t;let i=this.monthNames[t];this.#i.selectedIndex=t,this.#t.value=e.toString();let s=await this.requireContext(k);s.dispatchEvent(new b(e,t,i)),s.dispatchEvent(new S)}#v=e=>{if(e instanceof S){let t=this.#N();this.#r.replaceWith(t),this.#r=t,this.#b()}};get#S(){let e=this.yearView,t=this.monthIndexView,i=new Date(e,t,1,0,0,0,0),s=new Date(i);s.setUTCDate(s.getUTCDate()-s.getUTCDay());let d=new Date(e,t+1,0,0,0,0,0),m=new Date(d);m.setUTCDate(m.getUTCDate()+(6-m.getUTCDay()));let r=new Date(s),c=[{dates:[{date:new Date(r),isCurrMonth:!1,isPrevMonth:!0,isNextMonth:!1,isToday:!1,isWeekend:!1,isDisabled:!1}].slice(0,0)}],u=0,v=g(this.#o)?null:f(this.#o);for(;r.getTime()<=m.getTime()||c.length<=6;){let T=c[c.length-1],y=r.getUTCDay(),Y=r.getUTCMonth(),O=(r.getUTCFullYear()-this.yearView)*12,F=O+Y===this.monthIndexView,R=O+Y<this.monthIndexView,B=O+Y>this.monthIndexView,z=f(r)===v,$=y===0||y===6,G=typeof this.#f=="function"?this.#f(r):!1;T.dates.push({date:new Date(r),numericDate:L(r),isCurrMonth:F,isPrevMonth:R,isNextMonth:B,isToday:z,isWeekend:$,isDisabled:G}),r.setUTCDate(r.getUTCDate()+1),u++,u===7&&(c.push({dates:[]}),u=0)}return c}#E(e){return`${e}-${this.#a}`}get#D(){return this.lang||"en"}#x(){let e=this.#i.selectedIndex,t=parseInt(this.#t.value,10),i=e-1;i<0?(this.#i.selectedIndex=11,this.#t.value=(t-1).toString(),this.#h(t-1,11)):(this.#i.selectedIndex=i,this.#h(t,i))}#w(){let e=this.#i.selectedIndex,t=parseInt(this.#t.value,10),i=e+1;i>11?(this.#i.selectedIndex=0,this.#t.value=(t+1).toString(),this.#h(t+1,0)):(this.#i.selectedIndex=i,this.#h(t,i))}async#C(e){if(this.#c===l.SELECTION_MODE_SINGLE)this.#o instanceof Date?this.#o.getTime()===e.getTime()?this.setSelectedBeginDate(null):this.setSelectedBeginDate(e):this.setSelectedBeginDate(e);else if(this.#c===l.SELECTION_MODE_RANGE)this.#o instanceof Date?e.getTime()<this.#o.getTime()?this.setSelectedBeginDate(e):this.#o.getTime()===e.getTime()?this.setSelectedBeginDate(null):this.#l instanceof Date?this.setSelectedBeginDate(e):this.setSelectedEndDate(e):this.setSelectedBeginDate(e);else throw new Error("Invalid selection mode: "+this.#c);(await this.requireContext(l)).dispatchEvent(new C({beginDate:this.#o,endDate:this.#l}))}#T=e=>{e instanceof N&&(this.#c=e.detail.selectionMode,this.setSelectedEndDate(null))};#y=e=>{e instanceof I&&(this.#o=e.detail.beginDate,this.#l=e.detail.endDate,this.#b())};#I(){this.#e.appendChild(a("section",()=>[a("header",()=>[this.#u=a("slot",()=>[o("name","year-month-controls"),a("label",()=>[o("class","sr-only"),o("for",this.#E("month-select")),p("Month")]),this.#i=a("select",()=>[o("id",this.#E("month-select")),o("name","month"),o("aria-label","Month"),x("change",e=>{e.preventDefault();let t=this.#i.selectedIndex,i=parseInt(this.#t.value,10);this.#h(i,t)}),...this.monthNames.map((e,t)=>a("option",()=>[o("value",e),...t===this.monthIndexView?[o("selected","selected")]:[],p(e)]))]),a("label",()=>[o("class","sr-only"),o("for",this.#E("year-input")),p("Year")]),this.#t=a("input",()=>[o("id",this.#E("year-input")),o("type","number"),o("name","year"),o("aria-label","Year"),o("value",this.yearView.toString()),o("min",this.#m.toString()),o("max",this.#d.toString()),x("change",e=>{let t=this.#i.selectedIndex,i=parseInt(this.#t.value,10);i<this.#m?(e.preventDefault(),this.#t.setCustomValidity(`Year must be greater than or equal to ${this.#m}`),this.#t.reportValidity()):i>this.#d&&(e.preventDefault(),this.#t.setCustomValidity(`Year must be less than or equal to ${this.#d}`),this.#t.reportValidity()),this.#h(i,t)})])]),a("div",()=>[o("class","year-month-pagination"),a("button",()=>[o("type","button"),x("click",e=>{e.preventDefault(),this.#x()}),a("slot",()=>[o("name","prev-icon"),e=>e.innerHTML=`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="24" width="24" title="Previous"><path fill="currentColor" d="m432-480 156 156q11 11 11 28t-11 28q-11 11-28 11t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L432-480Z"/></svg>
              `])]),a("button",()=>[o("type","button"),x("click",e=>{e.preventDefault(),this.#w()}),a("slot",()=>[o("name","next-icon"),e=>e.innerHTML=`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="24" width="24" title="Next"><path fill="currentColor" d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z"/></svg>
              `])])])]),a("table",()=>[a("thead",()=>[a("tr",()=>[...this.dayShortNames.map(e=>a("th",()=>[a("span",()=>[p(e)])]))])]),this.#r=a("tbody",()=>[])])]))}#N(){return a("tbody",()=>[...this.#S.map(e=>a("tr",()=>[...e.dates.map(t=>a("td",()=>[a("label",()=>[o("class",[...t.isWeekend?["weekend"]:[],...t.isCurrMonth?[]:["other-month"]].join(" ")),a("input",()=>[o("type","checkbox"),o("name","date"),o("value",t.date.toISOString()),...t.isDisabled?[o("disabled","disabled")]:[],...t.isToday?[o("checked","checked")]:[],x("change",i=>{try{this.#C(t.date),t.isPrevMonth?this.#x():t.isNextMonth&&this.#w()}catch(s){throw i.preventDefault(),s}})]),a("span",()=>[a("span",()=>[p(t.date.getUTCDate().toString().padStart(2,"0"))])])])]))]))])}#b(){if(!(this.#r instanceof HTMLTableSectionElement))return;let e=this.#o,t=this.#l,i=L(e),s=L(t),d=this.#c===l.SELECTION_MODE_SINGLE,m=document.createTreeWalker(this.#r,NodeFilter.SHOW_ELEMENT,{acceptNode(c){return c instanceof HTMLInputElement&&c.name==="date"?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}}),r=m.currentNode;for(;r instanceof Node;){if(r=m.nextNode(),!(r instanceof HTMLInputElement))continue;let c=r.labels.item(0);if(!(c instanceof HTMLLabelElement))continue;c.classList.remove("range-selected"),c.classList.remove("range-selected-first"),c.classList.remove("range-selected-last");let u=new Date(r.value),v=L(u),T=v===i,y=v===s;if(T||y?(r.checked=!0,r.setAttribute("checked","checked")):(r.checked=!1,r.removeAttribute("checked")),d)continue;v>=i&&v<=s&&c.classList.add("range-selected"),T?c.classList.add("range-selected-first"):y&&c.classList.add("range-selected-last")}}};k=E;customElements.define("f-date-picker-view",E);var M=class n extends l{static#s=function(){let e=new CSSStyleSheet;return e.replace(`
    `),[e]}();static get formAssociated(){return!0}static get observedAttributes(){return["value","time-unit","selection-mode"]}#n=this.attachShadow({mode:"closed"});connectedCallback(){super.connectedCallback(),this.#n.adoptedStyleSheets=n.#s,this.#e()}async attributeChangedCallback(e,t,i){e==="value"?(this.value=i,(await this.requireContext(l)).dispatchEvent(new h({beginDate:this.beginDateValue,endDate:this.endDateValue}))):e==="time-unit"?this.timeUnit=i:e==="selection-mode"&&(this.selectionMode=i,(await this.requireContext(l)).dispatchEvent(new N(this.selectionMode)))}#e(){this.#n.appendChild(a("slot",()=>[o("name","date-picker-view"),a("f-date-picker-view",()=>[])]))}};customElements.define("f-date-picker-inline",M);var P=class extends w{#s=this.attachShadow({mode:"closed"});#n;async connectedCallback(){this.#a();let e=await this.requireContext(E);e.addEventListener(b.EVENT_TYPE,this.#e),this.#n.nodeValue=e.monthNames[e.monthIndexView]}async disconnectedCallback(){(await this.requireContext(E)).removeEventListener(b.EVENT_TYPE,this.#e)}#e=e=>{e instanceof b&&(this.#n.nodeValue=e.detail.monthLabel.toString())};#a(){this.#s.appendChild(this.#n=p(""))}};customElements.define("f-date-picker-month-view",P);var _=class extends w{static get requiredContexts(){return[E]}#s=this.attachShadow({mode:"closed"});#n;async connectedCallback(){this.#a(),(await this.requireContext(E)).addEventListener(b.EVENT_TYPE,this.#e)}async disconnectedCallback(){let e=await this.requireContext(E);e.removeEventListener(b.EVENT_TYPE,this.#e),this.#n.nodeValue=e.yearView?.toString()}#e=e=>{e instanceof b&&(this.#n.nodeValue=e.detail.year.toString())};#a(){this.#s.appendChild(this.#n=p(""))}};customElements.define("f-date-picker-year-view",_);var V=class n extends D{static get EVENT_TYPE(){return"change"}constructor(e,t){super(n.EVENT_TYPE,e,t)}};var A=class n extends l{static#s=function(){let e=new CSSStyleSheet;return e.replace(`
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
    `),[e]}();static get formAssociated(){return!0}static get observedAttributes(){return["open","value"]}#n=this.attachShadow({mode:"closed"});#e;#a;#r;#t;#i;async connectedCallback(){let e=await this.requireContext(l);e.addEventListener(V.EVENT_TYPE,this.#o),e.addEventListener(h.EVENT_TYPE,this.#l),e.addEventListener(C.EVENT_TYPE,this.#c),super.connectedCallback(),this.#n.adoptedStyleSheets=n.#s,this.#h(),this.#a.addEventListener("open",this.#g),this.#a.addEventListener("close",this.#p),this.hasAttribute("open")?this.#m():this.#d(),this.#u()}async disconnectedCallback(){this.#a.removeEventListener("open",this.#g),this.#a.removeEventListener("close",this.#p);let e=await this.requireContext(l);e.removeEventListener(V.EVENT_TYPE,this.#o),e.removeEventListener(h.EVENT_TYPE,this.#l),e.removeEventListener(C.EVENT_TYPE,this.#c)}attributeChangedCallback(e,t,i){e==="open"?i===null?this.#d():this.#m():e==="value"&&(i===null?this.value=null:this.value=i,this.#u())}requestSubmit=()=>{this.#r.requestSubmit()};closeDatePicker(){this.#d()}#u(){this.beginDateValue instanceof Date?this.#e instanceof Text&&(this.#e.nodeValue=`Selected Date: ${this.value}`):this.#e instanceof Text&&(this.#e.nodeValue="Select Date")}#m=async()=>{this.#a instanceof HTMLDialogElement&&((await this.requireContext(l)).dispatchEvent(new I({beginDate:this.#t,endDate:this.#i})),this.#a.showModal(),this.hasAttribute("open")||this.setAttribute("open",""))};#d=()=>{this.#a instanceof HTMLDialogElement&&this.#a.close()};#g=async()=>{this.hasAttribute("open")||this.setAttribute("open","")};#p=()=>{this.hasAttribute("open")&&this.removeAttribute("open")};#c=e=>{if(e instanceof C){let{beginDate:t,endDate:i}=e.detail;this.#t=t,this.#i=i}};#o=e=>{e instanceof V&&this.#u()};#l=e=>{if(e instanceof h){let{beginDate:t,endDate:i}=e.detail;this.#t=t,this.#i=i,this.#u()}};#f=()=>{if(this.selectionMode===l.SELECTION_MODE_SINGLE)this.value=f(this.#t);else if(this.selectionMode===l.SELECTION_MODE_RANGE)this.value=q({beginDate:this.#t,endDate:this.#i});else throw new Error("Invalid selection mode");this.#u()};#h(){this.#n.appendChild(a("div",()=>[a("slot",()=>[o("name","date-picker-controls"),a("button",()=>[x("click",this.#m),this.#e=p("Select Date")])]),this.#a=a("dialog",()=>[this.#r=a("form",()=>[o("method","dialog"),x("submit",this.#f),a("slot",()=>[o("name","date-picker-view"),a("f-date-picker-view",()=>[])]),a("slot",()=>[o("name","form-controls"),a("div",()=>[a("button",()=>[o("type","button"),x("click",this.#d),p("Cancel")]),a("button",()=>[o("type","submit"),p("Apply")])])])])])]))}};customElements.define("f-date-picker-dialog",A);export{A as DatePickerDialogElement,M as DatePickerInlineElement,P as DatePickerMonthViewElement,E as DatePickerViewElement,_ as DatePickerYearViewElement,V as PickedDateChangeEvent};
//# sourceMappingURL=date-picker.js.map
