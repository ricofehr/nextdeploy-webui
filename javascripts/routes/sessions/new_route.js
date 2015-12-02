// Session sign-in Route Object
var SessionsNewRoute = Ember.Route.extend({
  // Empty model
  model: function() {
    return Ember.Object.create();
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

