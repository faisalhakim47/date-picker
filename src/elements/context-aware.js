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
   * @param {number} [checkingInterval]
   * @returns {Promise<T>}
   */
  async requireContext(constructor, checkingInterval = 50) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const context = this.#traceContext(constructor);
        if (context instanceof constructor) {
          resolve(context);
        }
        else {
          const timeThreshold = 5000;
          const retryThreshold = timeThreshold / checkingInterval;
          let numOfRetries = 0;
          const interval = setInterval(() => {
            const context = this.#traceContext(constructor);
            if (context instanceof constructor) {
              clearInterval(interval);
              resolve(context);
            }
            else if (numOfRetries > retryThreshold) {
              clearInterval(interval);
              throw new Error(`Failed to find the context of ${constructor.name} after ${retryThreshold * checkingInterval}ms`);
            }
            else {
              numOfRetries++;
            }
          }, checkingInterval);
        }
      });
    });
  }

  /**
   * @template {ContextAwareElement} T
   * @param {new () => T} constructor
   * @returns {T}
   */
  #traceContext(constructor) {
    /** @type {Node} */
    let element = this;
    while (element) {
      if (element instanceof constructor) {
        return element;
      }
      if (element instanceof ShadowRoot) {
        element = element.host;
      }
      else {
        element = element.parentNode;
      }
    }
    return null;
  }
}
