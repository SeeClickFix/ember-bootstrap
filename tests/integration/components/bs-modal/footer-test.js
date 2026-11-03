import { setComponentTemplate } from '@ember/component';
import templateOnly from '@ember/component/template-only';
import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { test, defaultButtonClass } from '../../../helpers/bootstrap';
import hbs from 'htmlbars-inline-precompile';
import setupNoDeprecations from '../../../helpers/setup-no-deprecations';

module('Integration | Component | bs-modal/footer', function (hooks) {
  setupRenderingTest(hooks);
  setupNoDeprecations(hooks);

  test('Footer has close button', async function (assert) {
    await render(hbs`<BsModal::Footer @closeTitle="close" />`);

    assert.dom('.modal-footer').exists({ count: 1 }, 'Modal footer exists.');
    assert.dom('.modal-footer button').exists({ count: 1 }, 'Modal has button.');
    assert.dom('.modal-footer button').hasClass('btn-primary', 'Button is a primary button.');
    assert.strictEqual(
      this.element.querySelector('.modal-footer button').getAttribute('type'),
      'button',
      'Submit button is of type button.'
    );
    assert.dom('.modal-footer button').hasText('close', 'Button title is correct.');
  });

  test('Footer can have submit button', async function (assert) {
    await render(hbs`<BsModal::Footer @closeTitle="close" @submitTitle="submit" />`);

    assert.dom('.modal-footer button').exists({ count: 2 }, 'Modal footer has two button.');
    assert.dom('.modal-footer button:first-child').hasClass(defaultButtonClass(), 'Close button is a default button.');
    assert.strictEqual(
      this.element.querySelector('.modal-footer button:first-child').getAttribute('type'),
      'button',
      'Close button is of type button.'
    );
    assert.dom('.modal-footer button:first-child').hasText('close', 'Close button title is correct.');
    assert.dom('.modal-footer button:last-child').hasClass('btn-primary', 'Submit button is a primary button.');
    assert.strictEqual(
      this.element.querySelector('.modal-footer button:last-child').getAttribute('type'),
      'submit',
      'Submit button is of type submit.'
    );
    assert.dom('.modal-footer button:last-child').hasText('submit', 'Submit button title is correct.');
  });

  test('Clicking submit button calls onSubmit and prevents native form submission', async function (assert) {
    let submitCount = 0;
    this.set('submit', () => submitCount++);
    let defaultPrevented;
    let listener = (event) => {
      defaultPrevented = event.defaultPrevented;
      // never let the test runner page navigate, even if the footer fails to prevent it
      event.preventDefault();
    };
    window.addEventListener('submit', listener);
    try {
      await render(hbs`<BsModal::Footer @closeTitle="close" @submitTitle="submit" @onSubmit={{this.submit}} />`);
      await click('.modal-footer button:last-child');
    } finally {
      window.removeEventListener('submit', listener);
    }

    assert.strictEqual(submitCount, 1, 'onSubmit is called once.');
    assert.true(defaultPrevented, 'Native form submission is prevented.');
  });

  module('native form submission', function (hooks) {
    hooks.beforeEach(function () {
      this.defaultPrevented = undefined;
      this.listener = (event) => {
        this.defaultPrevented = event.defaultPrevented;
        // never let the test runner page navigate
        event.preventDefault();
      };
      window.addEventListener('submit', this.listener);
    });

    hooks.afterEach(function () {
      window.removeEventListener('submit', this.listener);
    });

    test('it is not prevented without onSubmit', async function (assert) {
      await render(hbs`<BsModal::Footer @closeTitle="close" @submitTitle="submit" />`);
      await click('.modal-footer button:last-child');

      assert.false(this.defaultPrevented, 'Native form submission is not prevented.');
    });

    test('it is not prevented when the footer has an action attribute', async function (assert) {
      let submitCount = 0;
      this.set('submit', () => submitCount++);
      await render(
        hbs`<BsModal::Footer @closeTitle="close" @submitTitle="submit" @onSubmit={{this.submit}} action="/export" method="post" />`
      );
      await click('.modal-footer button:last-child');

      assert.strictEqual(submitCount, 1, 'onSubmit is called once.');
      assert.false(this.defaultPrevented, 'Native form submission is not prevented.');
    });

    test('a custom buttonComponent submits the footer', async function (assert) {
      let submitCount = 0;
      this.set('submit', () => submitCount++);
      this.CustomButton = setComponentTemplate(
        hbs`<button type="button" class="custom-button" ...attributes>{{yield}}</button>`,
        templateOnly()
      );
      await render(
        hbs`<BsModal::Footer @closeTitle="close" @submitTitle="submit" @onSubmit={{this.submit}} @buttonComponent={{this.CustomButton}} />`
      );
      await click('.modal-footer button:last-child');

      assert.strictEqual(submitCount, 1, 'onSubmit is called once.');
      assert.true(this.defaultPrevented, 'Native form submission is prevented.');
    });
  });

  test('Footer can have a custom submitButtonType', async function (assert) {
    await render(hbs`<BsModal::Footer @closeTitle="close" @submitTitle="submit" @submitButtonType="danger" />`);
    assert.dom('.modal-footer button:last-child').hasClass('btn-danger', 'Submit button is a danger button.');
  });

  test('Footer can have custom block content', async function (assert) {
    await render(hbs`<BsModal::Footer @closeTitle="close" @submitTitle="submit">custom</BsModal::Footer>`);

    assert.dom('.modal-footer button').doesNotExist('Modal footer has no buttons.');
    assert.dom('.modal-footer').hasText('custom', 'Block content is shown.');
  });

  test('submitDisabled disables submit button', async function (assert) {
    this.set('disabled', true);
    await render(hbs`<BsModal::Footer @closeTitle="close" @submitTitle="submit" @submitDisabled={{this.disabled}} />`);

    assert.dom('.modal-footer button').exists({ count: 2 }, 'Modal footer has two button.');
    assert.notOk(
      this.element.querySelector('.modal-footer button:first-child').disabled,
      'Close button is not disabled.'
    );
    assert.ok(this.element.querySelector('.modal-footer button:last-child').disabled, 'Submit button is disabled.');

    this.set('disabled', false);

    assert.notOk(
      this.element.querySelector('.modal-footer button:last-child').disabled,
      'Submit button is not disabled.'
    );
  });
});
