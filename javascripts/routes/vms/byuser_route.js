var AuthenticatedRoute = require('../authenticated_route');

// Vm Ember Route Class (inherit from auth route because restricted)
var VmsByuserRoute = AuthenticatedRoute.extend({
  // Get the vms following an user_id
  model: function(params) {
    return Ember.RSVP.hash({
      userId: params.user_id,
      vms: this.store.all('vm')
    });
  },

  // Same template than the standard list of vms
  renderTemplate:function () {
    this.render('vms/list') ;
  },

  // Setup the controller for vms.list with this model
  setupController: function(controller, model) {
    this.controllerFor('vms.list').setProperties({model: model.vms, 
                                                  userId: model.userId,
                                                  projectId: 0});
  },
});

module.exports = VmsByuserRoute;

