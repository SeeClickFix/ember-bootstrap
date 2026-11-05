import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupNoDeprecations from '../../helpers/setup-no-deprecations';
import sinon from 'sinon';

module('Integration | Helper | bs-on-document', function (hooks) {
  setupRenderingTest(hooks);
  setupNoDeprecations(hooks);

  test('it calls the callback for events on document', async function (assert) {
    this.handler = sinon.spy();
    await render(hbs`{{bs-on-document "click" this.handler}}`);

    document.dispatchEvent(new Event('click'));
    assert.ok(this.handler.calledOnce, 'callback was called');
    assert.strictEqual(this.handler.firstCall.args[0].type, 'click', 'callback receives the event');
  });

  test('it removes the listener when it is destroyed', async function (assert) {
    this.handler = sinon.spy();
    this.set('show', true);
    await render(hbs`{{#if this.show}}{{bs-on-document "click" this.handler}}{{/if}}`);

    this.set('show', false);
    await settled();

    document.dispatchEvent(new Event('click'));
    assert.ok(this.handler.notCalled, 'callback was not called after teardown');
  });

  test('it replaces the listener when the event name changes', async function (assert) {
    this.handler = sinon.spy();
    this.set('eventName', 'click');
    await render(hbs`{{bs-on-document this.eventName this.handler}}`);

    this.set('eventName', 'keydown');
    await settled();

    document.dispatchEvent(new Event('click'));
    assert.ok(this.handler.notCalled, 'old event is not listened to anymore');

    document.dispatchEvent(new Event('keydown'));
    assert.ok(this.handler.calledOnce, 'new event is listened to');
  });

  test('it replaces the listener when the callback changes', async function (assert) {
    let first = sinon.spy();
    let second = sinon.spy();
    this.set('handler', first);
    await render(hbs`{{bs-on-document "click" this.handler}}`);

    this.set('handler', second);
    await settled();

    document.dispatchEvent(new Event('click'));
    assert.ok(first.notCalled, 'old callback is not called anymore');
    assert.ok(second.calledOnce, 'new callback is called');
  });

  test('it supports capture=true and removes the capturing listener', async function (assert) {
    this.handler = sinon.spy();
    this.stopPropagation = (e) => e.stopPropagation();
    this.set('show', true);
    await render(hbs`
      <button type="button" {{on "click" this.stopPropagation}}>Button</button>
      {{#if this.show}}{{bs-on-document "click" this.handler capture=true}}{{/if}}
    `);

    await click('button');
    assert.ok(this.handler.calledOnce, 'capturing listener is called although the event does not bubble up');

    this.set('show', false);
    await settled();

    await click('button');
    document.dispatchEvent(new Event('click'));
    assert.ok(this.handler.calledOnce, 'capturing listener was removed');
  });
});
