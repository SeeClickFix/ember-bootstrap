import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupNoDeprecations from '../../helpers/setup-no-deprecations';
import sinon from 'sinon';

module('Integration | Helper | bs-on-window', function (hooks) {
  setupRenderingTest(hooks);
  setupNoDeprecations(hooks);

  test('it calls the callback for events on window', async function (assert) {
    this.handler = sinon.spy();
    await render(hbs`{{bs-on-window "resize" this.handler}}`);

    window.dispatchEvent(new Event('resize'));
    assert.ok(this.handler.calledOnce, 'callback was called');
    assert.strictEqual(this.handler.firstCall.args[0].type, 'resize', 'callback receives the event');
  });

  test('it removes the listener when it is destroyed', async function (assert) {
    this.handler = sinon.spy();
    this.set('show', true);
    await render(hbs`{{#if this.show}}{{bs-on-window "resize" this.handler}}{{/if}}`);

    this.set('show', false);
    await settled();

    window.dispatchEvent(new Event('resize'));
    assert.ok(this.handler.notCalled, 'callback was not called after teardown');
  });
});
