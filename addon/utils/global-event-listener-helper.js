import Helper from '@ember/component/helper';
import { assert } from '@ember/debug';

/**
 * Base class for the `bs-on-document` and `bs-on-window` helpers. It adds an event listener to the global event
 * target returned by `eventTarget`, replaces it when the arguments change, and removes it when the helper is
 * destroyed. Named arguments (e.g. `capture=true`) are passed as listener options.
 *
 * When the global is missing or is not an event target (FastBoot defines a `window` without `addEventListener`), it
 * does nothing.
 *
 * @class GlobalEventListenerHelper
 * @private
 */
export default class GlobalEventListenerHelper extends Helper {
  /**
   * @property eventTarget
   * @type EventTarget|undefined
   * @private
   */
  get eventTarget() {
    return undefined;
  }

  listener = null;

  compute([eventName, callback], options) {
    assert(`The event name passed to ${this.constructor.name} must be a string`, typeof eventName === 'string');
    assert(`The callback passed to ${this.constructor.name} must be a function`, typeof callback === 'function');

    this.removeListener();

    let target = this.eventTarget;
    if (typeof target?.addEventListener === 'function') {
      options = { ...options };
      target.addEventListener(eventName, callback, options);
      this.listener = { target, eventName, callback, options };
    }
  }

  removeListener() {
    if (this.listener) {
      let { target, eventName, callback, options } = this.listener;
      target.removeEventListener(eventName, callback, options);
      this.listener = null;
    }
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.removeListener();
  }
}
