var AuthenticatedRoute = require('../authenticated_route');

// Project Ember Route Class (inherit from auth route because restricted)
var ProjectsListRoute = AuthenticatedRoute.extend({
  // Get all projects object, but name must be valid
  model: function() {
    return this.store.all('project').filterBy('name');
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

  actions: {
    showDetails: function(model) {
      this.controllerFor('projects.modal').setProperties({model:model});
      this.controllerFor('projects.modal').showDetails();
    },

    closeDetails: function() {
      this.controllerFor('projects.modal').hideDetails();
    },
  }
});

module.exports = ProjectsListRoute;

