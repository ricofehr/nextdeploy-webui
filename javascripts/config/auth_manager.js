// Manage authentification session
var AuthManager = Ember.Object.extend({

  // Load the current user if the cookies exist and is valid
  init: function() {
    this._super();
    var accessToken = $.cookie('access_token');
    if (!Ember.isEmpty(accessToken)) {
      this.authenticate(accessToken);
    }
  },

  // get access_level
  access_level: function() {
    var apiKey = this.get('apiKey');
    if(!apiKey) {
      this.init();
    }

    return this.get('apiKey.access_level');
  },

  // get project creation right
  is_project_create: function() {
    var apiKey = this.get('apiKey');
    if(!apiKey) {
      this.init();
    }

    return this.get('apiKey.is_project_create');
  },

  // Determine if the user is currently authenticated.
  isAuthenticated: function() {
    return !Ember.isEmpty(this.get('apiKey.accessToken')) && !Ember.isEmpty(this.get('apiKey.user'));
  },

  ajaxSetup: function(token) {
    $.ajaxSetup({
      headers: { 'Authorization': 'Token token=' + token }
    });
  },

  ajaxSetupSync: function(token) {
    $.ajaxSetup({
      headers: { 'Authorization': 'Token token=' + token },
      async: false
    });
  },

  //init apikey object from user model
  initUser: function(user, group, access_token, access_level, is_project_create) {
    var apiKey = App.ApiKey.create({
          accessToken: access_token,
          user: user,
          group: group,
          accessLevel: access_level,
          is_project_create: is_project_create
    });

    this.set('apiKey', apiKey);
  },

  authenticate: function(accessToken) {
    this.ajaxSetup(accessToken);

    $.get('/api/v1/user', [], function(results) {
      var user = results.user.id;
      var group = results.user.group;
      var is_project_create = results.user.is_project_create;
      var auth_token = results.user.authentication_token;

      $.get('/api/v1/group', [], function(results) {
        App.AuthManager.initUser(user, group, auth_token, results.group.access_level, is_project_create);
      })
    });
  },

  // Log out the user
  reset: function() {
    this.set('apiKey', null);
    this.ajaxSetup('none');
    // reset app for to be sure to empty all data store (ember issue known)
    App.reset();
    // ugly hack ... because after app.rest we need to reload page
    window.location.href = window.location.toString().substr(0, window.location.toString().indexOf('#'));
  },

  // Ensure that when the apiKey changes, we store the data in cookies in order for us to load
  // the user when the browser is refreshed.
  apiKeyObserver: function() {
    if (Ember.isEmpty(this.get('apiKey'))) {
      $.removeCookie('access_token');
    } else {
      $.cookie('access_token', this.get('apiKey.accessToken'));
    }
  }.observes('apiKey')
});

// Reset the authentication if any ember data request returns a 401 unauthorized error
DS.rejectionHandler = function(reason) {
  if (reason.status === 401) {
    App.AuthManager.reset();
  }
  throw reason;
};

module.exports = AuthManager;
