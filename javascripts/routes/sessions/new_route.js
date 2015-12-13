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

    store.findAll('brand').then(function(brands) {
      self.controllerFor('brands.list').setProperties({content: brands});
      store.findAll('user').then(function(users) {
        self.controllerFor('users.list').setProperties({content: users});
        store.findAll('project').then(function(projects) {
          self.controllerFor('projects.list').setProperties({content: projects});
          store.findAll('vm').then(function(vms) {
            self.controllerFor('vms.list').setProperties({content: vms});
            self.controllerFor('vms.list').sortModel();
            Ember.run.later(function(){
              self.reloadModel();
            }, 60000);
          });
        });
      });
    });
  },

  renderTemplate:function () {
    this.render('sessions/new') ;

    // render the forgot modal
    this.render('sessions/modalforgot', {
         into: 'application',
         outlet: 'modalforgot',
         controller: 'sessions.modal',
    });
  },
  
  actions: {
    // Display modals on the fly
    forgotPassword: function(email, password) {
      this.controllerFor('sessions.modal').forgotPassword(email, password);
    },

    closeForgot: function() {
      this.controllerFor('sessions.modal').hideForgot();
    },
  }
});

module.exports = SessionsNewRoute;

