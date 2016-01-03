var AuthenticatedRoute = require('../authenticated_route');

// Brand Ember Route Class (inherit from auth route because restricted)
var BrandsNewRoute = AuthenticatedRoute.extend({
  // Empty model
  model: function() {
    return Ember.RSVP.hash({
      brands: this.store.all('brand')
    });
  },

  // Setup controller
  setupController: function(controller, model) {
    content = Ember.Object.create();
    this.controllerFor('brands.new').setProperties({model: content});
    this.controllerFor('brands.new').clearForm();
    this.controllerFor('brands.new').setProperties({model: content, brands: model.brands});
  },
});

module.exports = BrandsNewRoute;

