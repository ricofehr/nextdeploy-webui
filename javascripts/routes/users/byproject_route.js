var AuthenticatedRoute = require('../authenticated_route');

// User Ember Route Class (inherit from auth route because restricted)
var UsersByprojectRoute = AuthenticatedRoute.extend({
  // Get the users following an project_id
  model: function(params) {
    return Ember.RSVP.hash({
      projectId: params.project_id,
      users: this.store.all('user')
    });
  },

  // Same template than the standard list of users
  renderTemplate:function () {
    this.render('users/list');
  },

  // Setup the controller
  setupController: function(controller, model) {
    this.controllerFor('users.list').setProperties({model: model.users,
                                                  groupId: 0,
                                                  projectId: model.projectId});
  }
});

module.exports = UsersByprojectRoute;

