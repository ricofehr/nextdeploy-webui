import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('dashboard-hpmessages', 'Integration | Component | dashboard hpmessages', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{dashboard-hpmessages}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#dashboard-hpmessages}}
      template block text
    {{/dashboard-hpmessages}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
