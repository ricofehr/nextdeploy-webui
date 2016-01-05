var AuthenticatedRoute = require('../authenticated_route');

// Vm Ember Route Class (inherit from auth route because restricted)
var VmsByprojectRoute = AuthenticatedRoute.extend({
  // Get the vms following an project_id
  model: function(params) {
    return Ember.RSVP.hash({
      projectId: params.project_id,
      vms: this.store.all('vm')
    });
  },

  // Same template than the standard list of vms
  renderTemplate:function () {
    this.render('vms/list');

    // render the 2 type of modals
    this.render('vms/modaluris', {
         into: 'application',
         outlet: 'modaluris',
         controller: 'vms.modal',
    });

    this.render('vms/modaldetails', {
         into: 'application',
         outlet: 'modalvm',
         controller: 'vms.modal',
    });
  },

  // Setup the controller for vms.list with this model
  setupController: function(controller, model) {
    this.controllerFor('vms.list').setProperties({model: model.vms,
                                                  userId: 0,
                                                  projectId: model.projectId});
  },

  actions: {
    // Display modals on the fly
    showUri: function(model) {
      this.controllerFor('vms.modal').setProperties({model: model, isHTTPS: false});
      this.controllerFor('vms.modal').showUri();
    },

    showDetails: function(model) {
      this.controllerFor('vms.modal').setProperties({model: model});
      this.controllerFor('vms.modal').showDetails();
    },

    // close modals
    closeUri: function() {
      this.controllerFor('vms.modal').hideUri();
    },

    closeDetails: function() {
      this.controllerFor('vms.modal').hideDetails();
    },
  }
});

module.exports = VmsByprojectRoute;

