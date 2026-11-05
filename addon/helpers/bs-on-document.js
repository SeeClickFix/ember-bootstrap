import GlobalEventListenerHelper from 'ember-bootstrap/utils/global-event-listener-helper';

/**
 * Adds an event listener to `document` for as long as the helper is rendered:
 * `{{bs-on-document "click" this.handler capture=true}}`
 *
 * @class BsOnDocumentHelper
 * @private
 */
export default class BsOnDocumentHelper extends GlobalEventListenerHelper {
  get eventTarget() {
    return typeof document !== 'undefined' ? document : undefined;
  }
}
