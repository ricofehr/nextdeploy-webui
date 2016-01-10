var AuthManager = require('../config/auth_manager');

// The default Route class for the main view of ember app
var ApplicationRoute = Ember.Route.extend({
  // Init an new authmanager object
  init: function() {
    this._super();
    App.AuthManager = AuthManager.create();
  },

  events: {
    // Unload all objects in ember memory
    logout: function() {
      $.ajax({url: '/api/v1/users/sign_out', type: "DELETE"});
      // Redirect to login page and clear data store
      App.AuthManager.reset();
    }
  }
});

module.exports = ApplicationRoute;

