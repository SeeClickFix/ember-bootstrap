import GlobalEventListenerHelper from 'ember-bootstrap/utils/global-event-listener-helper';

/**
 * Adds an event listener to `window` for as long as the helper is rendered:
 * `{{bs-on-window "resize" this.handler}}`
 *
 * @class BsOnWindowHelper
 * @private
 */
export default class BsOnWindowHelper extends GlobalEventListenerHelper {
  get eventTarget() {
    return typeof window !== 'undefined' ? window : undefined;
  }
}
