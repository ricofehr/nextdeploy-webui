var AuthenticatedRoute = require('../authenticated_route');

// Project Ember Route Class (inherit from auth route because restricted)
var ProjectsListRoute = AuthenticatedRoute.extend({
  // Get all projects object, but name must be valid
  model: function() {
    return this.store.all('project');
  },

  renderTemplate:function () {
    this.render('projects/list') ;

    // render the modal
    this.render('projects/modaldetails', {
         into: 'application',
         outlet: 'modalproject',
         controller: 'projects.modal',
    });
  },

  // Setup the controller
  setupController: function(controller, model) {
    this.controllerFor('projects.list').setProperties({model: model, 
                                                  userId: 0,
                                                  brandId: 0});
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

module.exports = ProjectsListRoute;

