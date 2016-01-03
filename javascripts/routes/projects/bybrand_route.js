var AuthenticatedRoute = require('../authenticated_route');

// Project Ember Route Class (inherit from auth route because restricted)
var ProjectsBybrandRoute = AuthenticatedRoute.extend({
  // Get the projects following an brand_id
  model: function(params) {
    return Ember.RSVP.hash({
      brandId: params.brand_id,
      projects: this.store.all('project')
    });
  },

  // Same template than the standard list
  renderTemplate:function () {
    this.render('projects/list');
  },

  // Setup the controller
  setupController: function(controller, model) {
    this.controllerFor('projects.list').setProperties({model: model.projects,
                                                  userId: 0,
                                                  brandId: model.brandId});
  },
});

module.exports = ProjectsBybrandRoute;

