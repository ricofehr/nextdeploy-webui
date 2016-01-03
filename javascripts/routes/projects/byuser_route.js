var AuthenticatedRoute = require('../authenticated_route');

// Project Ember Route Class (inherit from auth route because restricted)
var ProjectsByuserRoute = AuthenticatedRoute.extend({
  // Get the projects following an brand_id
  model: function(params) {
    return Ember.RSVP.hash({
      userId: params.user_id,
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
                                                  userId: model.userId,
                                                  brandId: 0});
  },
});

module.exports = ProjectsByuserRoute;

