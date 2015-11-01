var AuthenticatedRoute = require('../authenticated_route');

// Vm Ember Route Class (inherit from auth route because restricted)
var VmsListRoute = AuthenticatedRoute.extend({
  // Init model for the list
  model: function() {
    // Get all vms from ember datas
    return this.store.all('vm').filterBy('project');
  },

  renderTemplate:function () {
    this.render('vms/list') ;

    // render the 2 type of modals
    this.render('vms/modaluris', {
         into: 'application',
         outlet: 'modaluris',
         controller: 'vms.modal',
    });

    this.render('vms/modaldetails', {
         into: 'application',
         outlet: 'modalvm',
         controller: 'vms.modal',
    });
  },
  
  actions: {
    // Display modals on the fly
    showUri: function(model) {
      this.controllerFor('vms.modal').setProperties({model:model});
      this.controllerFor('vms.modal').showUri();
    },

    showDetails: function(model) {
      this.controllerFor('vms.modal').setProperties({model:model});
      this.controllerFor('vms.modal').showDetails();
    },

    // close modals
    closeUri: function() {
      this.controllerFor('vms.modal').hideUri();
      // return this.disconnectOutlet({
      //   outlet: 'modaluris',
      //   parentView: 'application'
      // });
    },

    closeDetails: function() {
      this.controllerFor('vms.modal').hideDetails();
      // return this.disconnectOutlet({
      //   outlet: 'modalvm',
      //   parentView: 'application'
      // });
    },
  }
});

module.exports = VmsListRoute;

