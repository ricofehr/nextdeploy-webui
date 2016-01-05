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

    // render the modal
    this.render('projects/modaldetails', {
         into: 'application',
         outlet: 'modalproject',
         controller: 'projects.modal',
    });
  },

  // Setup the controller
  setupController: function(controller, model) {
    this.controllerFor('projects.list').setProperties({model: model.projects,
                                                  userId: 0,
                                                  brandId: model.brandId});
  },

  actions: {
    showDetails: function(model) {
      this.controllerFor('projects.modal').setProperties({content:model});
      this.controllerFor('projects.modal').showDetails();
    },

    closeDetails: function() {
      this.controllerFor('projects.modal').hideDetails();
    },
  }
});

module.exports = ProjectsBybrandRoute;

