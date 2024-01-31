// @ts-check

export class ContextAwareElement extends HTMLElement {
  connectedCallback() {
    this.#checkRequiredContexts();
  }

  #checkRequiredContexts() {
    const requiredContexts = this.constructor['requiredContexts'];
    if (Array.isArray(requiredContexts)) {
      for (const requiredContext of requiredContexts) {
        if (!this.getContext(requiredContext)) {
          console.warn(`Element ${this.localName} requires context ${requiredContext.name}`);
        }
      }
    }
  }

  /**
   * @template {ContextAwareElement} T
   * @param {new () => T} constructor
   * @returns {T}
   */
  getContext(constructor) {
    /** @type {Node} */
    let element = this;
    while (element) {
      if (element instanceof constructor) {
        return element;
      }
      element = element.parentNode;
    }
  }
}
