// @ts-check

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
  async requireContext(constructor) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        /** @type {Node} */
        let element = this;

        while (element instanceof Node) {
          if (element instanceof constructor) {
            resolve(element);
            return;
          }

          if (element instanceof ShadowRoot) {
            element = element.host;
          }
          else {
            element = element.parentNode;
          }
        }

        console.warn(`Context ${constructor.name} not found`);

        reject(new Error(`Context ${constructor.name} not found`));
      });
    });
  }
}
