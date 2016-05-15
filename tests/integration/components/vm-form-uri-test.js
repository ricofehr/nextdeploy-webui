import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('vm-form-uri', 'Integration | Component | vm form uri', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{vm-form-uri}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#vm-form-uri}}
      template block text
    {{/vm-form-uri}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
