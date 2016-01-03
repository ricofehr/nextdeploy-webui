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
  },

  // Setup the controller for vms.list with this model
  setupController: function(controller, model) {
    this.controllerFor('vms.list').setProperties({model: model.vms,
                                                  userId: 0,
                                                  projectId: model.projectId});
  },
});

module.exports = VmsByprojectRoute;

