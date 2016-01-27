// Session sign-in Route Object
var SessionsNewRoute = Ember.Route.extend({
  // Empty model
  model: function() {
    var self = this;
    Ember.run.later(function(){
      self.reloadModel();
    }, 100000);

    return Ember.RSVP.hash({
      hpmessages: this.store.all('hpmessage')
    });
  },

  // Setup the controller with thie model
  setupController: function(controller, model) {
    content = Ember.Object.create();
  
    this.controllerFor('sessions.new').setProperties({model: content});
    this.controllerFor('sessions.new').setProperties({hpmessages: model.hpmessages});
    this.controllerFor('sessions.new').sortModel();
  },

  // load model datas into ember memory
  reloadModel: function() {
    var store = this.store;
    var self = this;

    if (App.AuthManager.isAuthenticated()) {
      store.findAll('brand').then(function(brands) {
        store.findAll('user').then(function(users) {
          store.all('user').forEach(function(user) {
            if (user && !users.findBy('id', user.id)) {
              user.deleteRecord();
              user.get('vms').forEach(function(vm) {
                if (vm) {
                  vm.deleteRecord();
                }
              });

              user.get('projects').forEach(function(project) {
                if (project) project.get('users').removeObject(user);
              });

              user.get('group').get('users').removeObject(user);
            }
          });
          
          store.findAll('project').then(function(projects) {
            store.all('project').forEach(function(project) {
              if (project && !projects.findBy('id', project.id)) {
                project.deleteRecord();
                project.get('vms').forEach(function(vm) {
                  if (vm) {
                    vm.deleteRecord();
                  }
                });

                project.get('users').forEach(function(user) {
                  if (user) user.get('projects').removeObject(project);
                });

                project.get('brand').get('projects').removeObject(project);
              }
            });

            store.findAll('vm').then(function(vms) {
              store.all('vm').forEach(function(vm) {

                if (vm && !vms.findBy('id', vm.id)) {
                  vm.deleteRecord();
                  vm.get('user').get('vms').removeObject(vm);
                  vm.get('project').get('vms').removeObject(vm);
                }
              });

              store.unloadAll('hpmessage');
              store.findAll('hpmessage').then(function(hpmessages) {
                self.controllerFor('sessions.new').sortModel();

                Ember.run.later(function(){
                  self.reloadModel();
                }, 60000);
              });

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
  },

  // load homepage messages
  loadMessages: function() {
    var store = this.store;
    var self = this;

    if (App.AuthManager.isAuthenticated()) {
      store.findAll('hpmessage').then(function() {
        self.controllerFor('sessions.new').sortModel();
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
    }
  }
});

module.exports = SessionsNewRoute;

