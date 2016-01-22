// Session sign-in Route Object
var SessionsNewRoute = Ember.Route.extend({
  // Empty model
  model: function() {
    var self = this;
    Ember.run.later(function(){
      self.reloadModel();
    }, 100000);
    return Ember.Object.create();
  },

  // load model datas into ember memory
  reloadModel: function() {
    var store = this.store;
    var self = this;

    if (App.AuthManager.isAuthenticated()) {
      store.findAll('brand').then(function(brands) {
        store.findAll('user').then(function(users) {
          store.findAll('project').then(function(projects) {
            store.findAll('vm').then(function(vms) {
              Ember.run.later(function(){
                self.reloadModel();
              }, 60000);
            });
          });
        });
      });
    } else {
      Ember.run.later(function(){
        self.reloadModel();
      }, 100000);
    }
  },

  renderTemplate:function () {
    this.render('sessions/new');

    // render the forgot modal
    this.render('sessions/modalforgot', {
         into: 'application',
         outlet: 'modalforgot',
         controller: 'sessions.modal',
    });

    // render the help modal
    this.render('sessions/modalhelp', {
         into: 'application',
         outlet: 'modalhelp',
         controller: 'sessions.modal',
    });
  },

  // load homepage messages
  loadMessages: function() {
    var store = this.store;
    var self = this;

    if (App.AuthManager.isAuthenticated()) {
      store.findAll('hpmessage').then(function(hpmessages) {
        self.controllerFor('sessions.new').set('hpmessages', hpmessages);
      });
    }
  }.observes('App.AuthManager.apiKey'),


  actions: {
    // Display modals on the fly
    forgotPassword: function(email, password) {
      this.controllerFor('sessions.modal').forgotPassword(email, password);
    },

    closeForgot: function() {
      this.controllerFor('sessions.modal').hideForgot();
    },

    // Display help modal on the fly
    help: function() {
      this.controllerFor('sessions.modal').showHelp();
    },

    closeHelp: function() {
      this.controllerFor('sessions.modal').hideHelp();
    },
  }
});

module.exports = SessionsNewRoute;

