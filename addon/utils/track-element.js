import { modifier } from 'ember-modifier';

/**
 * Returns a modifier that stores the element it is installed on as `context[property]`.
 *
 * @private
 */
export default function trackElement(context, property) {
  return modifier(
    (element) => {
      context[property] = element;
    },
    // ember-modifier 3 deprecates function-based modifiers without this, 4 ignores it
    { eager: false }
  );
}
