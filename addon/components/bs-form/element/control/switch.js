import { action } from '@ember/object';
import { tagName } from '@ember-decorators/component';
import Control from '../control';

/**

 @class FormElementControlSwitch
 @namespace Components
 @extends Components.FormElementControl
 @private
 */
@tagName('')
export default class FormElementControlSwitch extends Control {
  @action
  handleClick(event) {
    this.onChange(event.target.checked);
  }
}
