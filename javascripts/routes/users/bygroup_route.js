var AuthenticatedRoute = require('../authenticated_route');

// User Ember Route Class (inherit from auth route because restricted)
var UsersBygroupRoute = AuthenticatedRoute.extend({
  // Get the users following an group_id
  model: function(params) {
   return Ember.RSVP.hash({
      groupId: params.group_id,
      users: this.store.all('user')
    });
  },

  // Same template than the standard list of users
  renderTemplate:function () {
    this.render('users/list') ;
  },

  // Setup the controller
  setupController: function(controller, model) {
    this.controllerFor('users.list').setProperties({content: model.users, 
                                                  groupId: model.groupId,
                                                  projectId: 0});
  }
});

module.exports = UsersBygroupRoute;

