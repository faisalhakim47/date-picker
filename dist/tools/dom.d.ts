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
/**
 * @template {keyof HTMLElementTagNameMap} TagName
 * @template {HTMLElementTagNameMap[TagName]} Elm
 * @param {TagName|Elm} tagNameOrElement
 * @param {(element: HTMLElementTagNameMap[TagName]|Elm) => Array<Prop<TagName>>} propFn
 * @returns {HTMLElementTagNameMap[TagName]|Elm}
 */
export function el<TagName extends keyof HTMLElementTagNameMap, Elm extends HTMLElementTagNameMap[TagName]>(tagNameOrElement: TagName | Elm, propFn: (element: Elm | HTMLElementTagNameMap[TagName]) => Prop<TagName>[]): Elm | HTMLElementTagNameMap[TagName];
/**
   * @param {string} localName
   * @param {string} value
   * @returns {Attr}
   */
export function at(localName: string, value: string): Attr;
/**
   * @param {string} data
   * @returns {Text}
   */
export function tx(data: string): Text;
/**
   * @template {keyof HTMLElementTagNameMap} TagName
   * @template {keyof HTMLElementEventMap} EventName
   * @param {EventName} type
   * @param {(this: HTMLElementTagNameMap[TagName], event: HTMLElementEventMap[EventName]) => void} listener
   * @param {boolean|AddEventListenerOptions} [options]
   * @returns {(element: HTMLElementTagNameMap[TagName]) => void}
   */
export function on<TagName extends keyof HTMLElementTagNameMap, EventName extends keyof HTMLElementEventMap>(type: EventName, listener: (this: HTMLElementTagNameMap[TagName], event: HTMLElementEventMap[EventName]) => void, options?: boolean | AddEventListenerOptions): (element: HTMLElementTagNameMap[TagName]) => void;
export type BasicProp = Node | Attr | string;
export type FnProp<TagName extends keyof HTMLElementTagNameMap> = (element: HTMLElementTagNameMap[TagName]) => void;
export type Prop<TagName extends keyof HTMLElementTagNameMap> = BasicProp | FnProp<TagName> | void;
