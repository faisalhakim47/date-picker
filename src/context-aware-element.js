export class ContextAwareElement extends HTMLElement {
  /**
   * @template {ContextAwareElement} T
   * @param {new () => T} constructor
   * @returns {T}
   */
  getContext(constructor) {
    let element = this;
    while (element) {
      if (element instanceof constructor) {
        return element;
      }
      element = element.parentNode;
    }
  }
}
