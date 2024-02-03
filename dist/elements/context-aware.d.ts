export class ContextAwareElement extends HTMLElement {
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
    requireContext<T extends ContextAwareElement>(constructor: new () => T): Promise<T>;
}
