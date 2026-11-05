import { tagName } from '@ember-decorators/component';
import Control from '../control';
import defaultValue from 'ember-bootstrap/utils/default-decorator';

/**

 @class FormElementControlRadio
 @namespace Components
 @extends Components.FormElementControl
 @private
 */
@tagName('')
export default class FormElementControlRadio extends Control {
  /**
   * @property inline
   * @type {Boolean}
   * @default false
   * @public
   */
  @defaultValue
  inline = false;
}
