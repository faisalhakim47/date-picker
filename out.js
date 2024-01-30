(()=>{var d=class a extends CustomEvent{static get EVENT_TYPE(){return"month-view-change"}#t;constructor(e,t){super(a.EVENT_TYPE,{...t,detail:{...t?.detail,month:e}}),this.#t=e}get monthIndex(){return this.#t}};var c=class a extends CustomEvent{static get EVENT_TYPE(){return"year-view-change"}#t;constructor(e,t){super(a.EVENT_TYPE,{...t,detail:{...t?.detail,year:e}}),this.#t=e}get year(){return this.#t}};function i(a,e){let t=typeof a=="string"?document.createElement(a):a,s=typeof e=="function"?e(t):e;for(let o of s)if(o instanceof Attr)t.setAttributeNode(o);else if(o instanceof Node)t.appendChild(o);else if(typeof o=="function")o(t);else if(typeof o=="string"){let r=document.createTextNode(o);t.appendChild(r)}return t}function n(a,e){let t=document.createAttribute(a);return t.value=e,t}function l(a){return document.createTextNode(a)}function h(a,e,t){return function(s){let o=e;s.addEventListener(a,o,t)}}var p=class a extends HTMLElement{static#t=0;#n;#s=new Date;#e=this.#s.getFullYear();#i=this.#s.getMonth();#h=this.#s.getDate();#d=new Date(this.#e,this.#i,this.#h,0,0,0,0);#c;#a;#o;#m;#p=100;#E=275759;constructor(){super(),this.#n=a.#t++,this.#m=this.attachShadow({mode:"closed"}),this.#D()}connectedCallback(){this.#k()}get#f(){return this.lang||"en"}get#b(){let e=new Intl.DateTimeFormat(this.#f,{month:"long"});return[...Array(12).keys()].map(s=>{let o=new Date(2e3,s);return e.format(o)})}get#v(){let e=new Intl.DateTimeFormat(this.#f,{weekday:"short"}),t=[...Array(7).keys()],s=new Date(2e3,0,1);return s.setDate(s.getDate()-s.getDay()),t.map(o=>{let r=new Date(s);return r.setDate(r.getDate()+o),e.format(r)})}get#w(){let e=new Date(this.#e,this.#i,1,0,0,0,0),t=new Date(e);t.setDate(t.getDate()-t.getDay());let s=new Date(this.#e,this.#i+1,0,0,0,0,0),o=new Date(s);o.setDate(o.getDate()+(6-o.getDay()));let r=new Date(t),m=[{dates:[{date:new Date(r),isCurrMonth:!1,isPrevMonth:!0,isNextMonth:!1,isToday:!1,isWeekend:!1}].slice(0,0)}],x=0;for(;r.getTime()<=o.getTime()||m.length<=6;){let y=m[m.length-1],w=r.getDay(),b=r.getMonth(),v=(r.getFullYear()-this.#e)*12,D=v+b===this.#i,k=v+b<this.#i,E=v+b>this.#i,T=r.toDateString()===this.#d.toDateString(),I=w===0||w===6;y.dates.push({date:new Date(r),isCurrMonth:D,isPrevMonth:k,isNextMonth:E,isToday:T,isWeekend:I}),r.setDate(r.getDate()+1),x++,x===7&&(m.push({dates:[]}),x=0)}return m}#l(e){return`${e}-${this.#n}`}#r(e,t){this.#i!==e&&this.dispatchEvent(new d(e)),this.#e!==t&&this.dispatchEvent(new c(t)),this.#i=e,this.#e=t;let s=this.#x();this.#c.replaceWith(s),this.#c=s}#g(){let e=this.#o.selectedIndex,t=parseInt(this.#a.value,10),s=e-1;s<0?(this.#o.selectedIndex=11,this.#a.value=(t-1).toString(),this.#r(11,t-1)):(this.#o.selectedIndex=s,this.#r(s,t))}#u(){let e=this.#o.selectedIndex,t=parseInt(this.#a.value,10),s=e+1;s>11?(this.#o.selectedIndex=0,this.#a.value=(t+1).toString(),this.#r(0,t+1)):(this.#o.selectedIndex=s,this.#r(s,t))}#y(e){this.#d.toDateString()!==e.toDateString()&&(this.#d=new Date(e))}#D(){this.#m.appendChild(i("style",[e=>e.textContent=`
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

        form > header > button {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          width: var(--si-header-height);
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
      `]))}#k(){let e=i("form",[h("submit",t=>{t.preventDefault()}),i("header",[i("slot",[n("name","month-select"),i("label",[n("class","sr-only"),n("for",this.#l("month-select")),l("Month")]),this.#o=i("select",[n("id",this.#l("month-select")),n("name","month"),n("aria-label","Month"),h("change",t=>{t.preventDefault();let s=this.#o.selectedIndex,o=parseInt(this.#a.value,10);this.#r(s,o)}),...this.#b.map((t,s)=>i("option",[n("value",t),...s===this.#i?[n("selected","selected")]:[],l(t)]))])]),i("slot",[n("name","year-input"),i("label",[n("class","sr-only"),n("for",this.#l("year-input")),l("Year")]),this.#a=i("input",[n("id",this.#l("year-input")),n("type","number"),n("name","year"),n("aria-label","Year"),n("value",this.#e.toString()),n("min","100"),n("max","275759"),h("change",t=>{t.preventDefault();let s=this.#o.selectedIndex,o=parseInt(this.#a.value,10);o<this.#p&&(this.#a.value=this.#p.toString()),this.#r(s,o)})])]),i("button",[n("type","button"),h("click",t=>{t.preventDefault(),this.#g()}),i("slot",[n("name","prev-icon"),t=>t.innerHTML=`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="24" width="24" title="Previous"><path fill="currentColor" d="m432-480 156 156q11 11 11 28t-11 28q-11 11-28 11t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L432-480Z"/></svg>
            `])]),i("button",[n("type","button"),h("click",t=>{t.preventDefault(),this.#u()}),i("slot",[n("name","next-icon"),t=>t.innerHTML=`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="24" width="24" title="Next"><path fill="currentColor" d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z"/></svg>
            `])])]),i("table",[i("thead",[i("tr",[...this.#v.map(t=>i("th",[l(t)]))])]),this.#c=this.#x()])]);this.#m.appendChild(e)}#x(){return i("tbody",[...this.#w.map(e=>i("tr",[...e.dates.map(t=>i("td",[i("label",[n("class",[...t.isWeekend?["weekend"]:[],...t.isCurrMonth?[]:["other-month"]].join(" ")),i("input",[n("type","radio"),n("name","date"),n("value",t.date.toISOString()),...t.isToday?[n("checked","checked")]:[],h("click",()=>{this.#y(t.date),t.isPrevMonth?this.#g():t.isNextMonth&&this.#u()})]),i("span",[l(t.date.getDate().toString().padStart(2,"0"))])])]))]))])}};customElements.define("date-picker-inline",p);var f=class extends HTMLElement{#t;#n;connectedCallback(){this.#t=this.attachShadow({mode:"closed"}),this.#i(),this.#h()}#s=()=>{this.#n.showModal()};#e=()=>{this.#n.close()};#i(){this.#t.appendChild(i("style",[e=>e.textContent=`
        :host {
          --si-submit-button-height: 36px;
          --si-dialog-radius: 4px;
          --si-dialog-padding: 16px;
        }
        dialog {
          border: none;
          padding: var(--si-dialog-padding);
          border-radius: var(--si-dialog-radius);
        }
        dialog > form > div {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
        dialog > form > div > button {
          display: block;
          padding: 0 8px;
          height: var(--si-submit-button-height);
        }
      `]))}#h(){this.#t.appendChild(i("div",[i("button",[h("click",this.#s),l("Open")]),this.#n=i("dialog",[i("form",[n("method","dialog"),h("submit",()=>{this.#n.close()}),i("date-picker-inline",[]),i("div",[i("button",[n("type","button"),h("click",this.#e),l("Cancel")]),i("button",[n("type","submit"),l("Apply")])])])])]))}};customElements.define("date-picker",f);var g=class extends HTMLElement{#t;#n;#s="";constructor(){super(),this.#t=this.attachShadow({mode:"closed"})}connectedCallback(){this.#s=this.attributes.getNamedItem("default-text")?.value??"",this.#i(),this.addEventListener(c.EVENT_TYPE,this.#e)}disconnectedCallback(){this.removeEventListener(c.EVENT_TYPE,this.#e)}#e=e=>{e instanceof c&&(this.#n.nodeValue=e.detail.year.toString())};#i(){this.#t.appendChild(this.#n=l(this.#s))}};customElements.define("date-picker-year-view",g);var u=class extends HTMLElement{#t;#n;#s="";constructor(){super(),this.#t=this.attachShadow({mode:"closed"})}connectedCallback(){this.#s=this.attributes.getNamedItem("default-text")?.value??"",this.#i(),this.addEventListener(d.EVENT_TYPE,this.#e)}disconnectedCallback(){this.removeEventListener(d.EVENT_TYPE,this.#e)}#e=e=>{e instanceof d&&(this.#n.nodeValue=e.detail.month.toString())};#i(){this.#t.appendChild(this.#n=l(this.#s))}};customElements.define("date-picker-month-view",u);})();
