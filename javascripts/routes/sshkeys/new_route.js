var AuthenticatedRoute = require('../authenticated_route');

// Sshkey Ember Route Class (inherit from auth route because restricted)
var SshkeysNewRoute = AuthenticatedRoute.extend({
  // Return all users for the sshkey create form
  model: function() {
    return this.store.find('user', params.user_id);
  },

  // Setup the controller with the model
  setupController: function(controller, model) {
    content = Ember.Object.create();
    content.set('user', model);
    controller.set('model', content);
  }
});

module.exports = SshkeysNewRoute;

