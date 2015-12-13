var AuthenticatedRoute = require('../authenticated_route');

// User Ember Route Class (inherit from auth route because restricted)
var UsersListRoute = AuthenticatedRoute.extend({
  // Get all users for thie model
  model: function() {
    return this.store.all('user');
  },

  // Setup the controller
  setupController: function(controller, model) {
    this.controllerFor('users.list').setProperties({content: model, 
                                                  groupId: 0,
                                                  projectId: 0});
  }
});

module.exports = UsersListRoute;

