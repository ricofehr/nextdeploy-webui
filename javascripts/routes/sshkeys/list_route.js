var AuthenticatedRoute = require('../authenticated_route');

// Sshkey Ember Route Class (inherit from auth route because restricted)
var SshkeysListRoute = AuthenticatedRoute.extend({
  model: function(params) {
    //return this.store.find('sshkey', { user_id: params.user_id }) ;
    return this.store.find('user', params.user_id);
    // return Ember.RSVP.hash({
    //   sshkeys: this.store.find('sshkey', { user_id: params.user_id }),
    //   user: this.store.find('user', params.user_id) 
    // });
  },

  // // Same template than the standard list of sshkeys
  // renderTemplate:function () {
  //   this.render('sshkeys/list');
  // },

  // // Setup the controller for sshkeys.list with this model
  // setupController: function(controller, model) {
  //   this._super(controller, model);
  //   // Create a content empty object
  //   // content = Ember.Object.create() ;
    
  //   // // Bind models to the controller
  //   // controller.set('model', content);
  //   // controller.set('sshkeys', model.sshkeys) ;
  //   // controller.set('user', model.user) ;
  // },
});

module.exports = SshkeysListRoute;

