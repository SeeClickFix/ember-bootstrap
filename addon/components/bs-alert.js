import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { later, schedule } from '@ember/runloop';
import usesTransition from 'ember-bootstrap/utils/decorators/uses-transition';
import arg from 'ember-bootstrap/utils/decorators/arg';

/**
  Implements [Bootstrap alerts](http://getbootstrap.com/components/#alerts)

  ### Usage

  By default it is a user dismissible alert with a fade out animation, both of which can be disabled. Be sure to set the
  `type` property for proper styling.

  ```hbs
  <BsAlert @type="success">
    <strong>Well done!</strong> You successfully read this important alert message.
  </BsAlert>
  ```

  Optionally you can render a header for the alert using named blocks syntax:

  ```hbs
  <BsAlert>
    <:header>
      Well done!
    </:header>
    <:body>
      You successfully read this important alert message.
    </:body>
  </BsAlert>
  ```

  The header is rendered using a `<h4>` element by default. You can customize
  that one by setting `@headerTag` argument of `<BsAlert>`.

  *Besides invoking the component in a template as shown above, extending from it (subclassing) is supported as well.*

  @class Alert
  @namespace Components
  @extends Glimmer.Component
  @public
*/
export default class Alert extends Component {
  /**
   * A dismissible alert will have a close button in the upper right corner, that the user can click to dismiss
   * the alert.
   *
   * @property dismissible
   * @type boolean
   * @default true
   * @public
   */
  @arg
  dismissible = true;

  /**
   * If true the alert is completely hidden. Will be set when the fade animation has finished.
   *
   * @property hidden
   * @type boolean
   * @default false
   * @readonly
   * @private
   */
  @tracked
  hidden = !this.visible;

  /**
   * This property controls if the alert should be visible. If false it might still be in the DOM until the fade animation
   * has completed.
   *
   * When the alert is dismissed by user interaction this property will not update by using two-way bindings in order
   * to follow DDAU best practices. If you want to react to such changes, subscribe to the `onDismiss` action
   *
   * @property visible
   * @type boolean
   * @default true
   * @public
   */
  get visible() {
    let visible = this.args.visible;
    if (visible !== this._visibleArg) {
      // untracked bookkeeping, so the alert can be shown again after being dismissed once `@visible` changes
      // eslint-disable-next-line ember/no-side-effects
      this._visibleArg = visible;
      this._visibleArgChanges++;
    }
    if (this._dismissedAt === this._visibleArgChanges) {
      return false;
    }
    return visible !== undefined ? visible : true;
  }

  /**
   * `@visible` as last seen by `visible`, and how often it has changed. These are untracked, as `visible` updates them
   * while rendering.
   * @private
   */
  _visibleArg = this.args.visible;
  _visibleArgChanges = 0;

  /**
   * The value of `_visibleArgChanges` when the alert was dismissed, so the alert stays hidden until `@visible` changes.
   * @private
   */
  @tracked
  _dismissedAt = -1;

  /**
   * Set to false to disable the fade out animation when hiding the alert.
   *
   * @property fade
   * @type boolean
   * @default true
   * @public
   */
  @arg
  fade = true;

  get showAlert() {
    return this.visible && this.args.fade !== false;
  }

  /**
   * The duration of the fade out animation
   *
   * @property fadeDuration
   * @type number
   * @default 150
   * @public
   */
  @arg
  fadeDuration = 150;

  /**
   * Property for type styling
   *
   * For the available types see the [Bootstrap docs](https://getbootstrap.com/docs/4.3/components/alerts/)
   *
   * @property type
   * @type String
   * @public
   */

  /**
   * Use CSS transitions?
   *
   * @property usesTransition
   * @type boolean
   * @readonly
   * @private
   */
  @usesTransition('fade')
  usesTransition;

  /**
   * The action to be sent after the alert has been dismissed (including the CSS transition).
   *
   * @event onDismissed
   * @public
   */

  /**
   * The action is called when the close button is clicked.
   *
   * You can return false to prevent closing the alert automatically, and do that in your action by
   * setting `visible` to false.
   *
   * @event onDismiss
   * @public
   */

  @action
  dismiss() {
    if (this.args.onDismiss?.() !== false) {
      this._dismissedAt = this._visibleArgChanges;
    }
  }

  /**
   * Call to make the alert visible again after it has been hidden
   *
   * @method show
   * @private
   */
  show() {
    this.hidden = false;
  }

  /**
   * Call to hide the alert. If the `fade` property is true, this will fade out the alert before being finally
   * dismissed.
   *
   * @method hide
   * @private
   */
  hide() {
    if (this.hidden) {
      return;
    }

    if (this.usesTransition) {
      later(
        this,
        function () {
          if (!this.isDestroyed) {
            this.hidden = true;
            this.args.onDismissed?.();
          }
        },
        this.fadeDuration
      );
    } else {
      this.hidden = true;
      // hide() runs while rendering, and onDismissed may set @visible, which that render has already read
      schedule('afterRender', this, function () {
        if (!this.isDestroyed) {
          this.args.onDismissed?.();
        }
      });
    }
  }

  @action
  showOrHide() {
    if (this.visible) {
      this.show();
    } else {
      this.hide();
    }
  }
}
