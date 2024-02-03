// @ts-check
/**
 * @typedef {Node|Attr|string} BasicProp
 */
/**
 * @template {keyof HTMLElementTagNameMap} TagName
 * @typedef {(element: HTMLElementTagNameMap[TagName]) => void} FnProp
 */
/**
 * @template {keyof HTMLElementTagNameMap} TagName
 * @typedef {BasicProp|FnProp<TagName>|void} Prop
 */
// let padding = 0;
/**
 * @template {keyof HTMLElementTagNameMap} TagName
 * @template {HTMLElementTagNameMap[TagName]} Elm
 * @param {TagName|Elm} tagNameOrElement
 * @param {(element: HTMLElementTagNameMap[TagName]|Elm) => Array<Prop<TagName>>} propFn
 * @returns {HTMLElementTagNameMap[TagName]|Elm}
 */
export function el(tagNameOrElement, propFn) {
    // console.log(`${' '.repeat(padding)}<${tagNameOrElement}>`);
    // padding += 2;
    /** @type {HTMLElementTagNameMap[TagName]|Elm} */
    const element = (typeof tagNameOrElement === 'string')
        ? document.createElement(tagNameOrElement)
        : tagNameOrElement;
    const props = propFn(element);
    for (const prop of props) {
        if (prop instanceof Attr) {
            element.setAttributeNode(prop);
        }
        else if (prop instanceof Node) {
            element.appendChild(prop);
        }
        else if (typeof prop === 'function') {
            prop(element);
        }
        else if (typeof prop === 'string') {
            const text = document.createTextNode(prop);
            element.appendChild(text);
        }
    }
    // padding -= 2;
    // console.log(`${' '.repeat(padding)}</${tagNameOrElement}>`);
    return element;
}
/**
   * @param {string} localName
   * @param {string} value
   * @returns {Attr}
   */
export function at(localName, value) {
    const attr = document.createAttribute(localName);
    attr.value = value;
    return attr;
}
/**
   * @param {string} data
   * @returns {Text}
   */
export function tx(data) {
    const text = document.createTextNode(data);
    return text;
}
/**
   * @template {keyof HTMLElementTagNameMap} TagName
   * @template {keyof HTMLElementEventMap} EventName
   * @param {EventName} type
   * @param {(this: HTMLElementTagNameMap[TagName], event: HTMLElementEventMap[EventName]) => void} listener
   * @param {boolean|AddEventListenerOptions} [options]
   * @returns {(element: HTMLElementTagNameMap[TagName]) => void}
   */
export function on(type, listener, options) {
    return function (element) {
        /** @type {any} */
        const bypassTypingListener = listener;
        element.addEventListener(type, bypassTypingListener, options);
    };
}
//# sourceMappingURL=dom.js.map