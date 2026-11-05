import { action } from '@ember/object';
import { tagName } from '@ember-decorators/component';
import Control from '../control';

/**

 @class FormElementControlCheckbox
 @namespace Components
 @extends Components.FormElementControl
 @private
 */
@tagName('')
export default class FormElementControlCheckbox extends Control {
  @action
  handleClick(event) {
    this.onChange(event.target.checked);
  }
}
