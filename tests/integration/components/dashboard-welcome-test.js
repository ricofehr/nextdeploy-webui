import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('dashboard-welcome', 'Integration | Component | dashboard welcome', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{dashboard-welcome}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#dashboard-welcome}}
      template block text
    {{/dashboard-welcome}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
