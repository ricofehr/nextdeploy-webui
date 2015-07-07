var AuthenticatedRoute = require('../authenticated_route');

// Vm Ember Route Class (inherit from auth route because restricted)
var VmsListRoute = AuthenticatedRoute.extend({
  // Init model for the list
  model: function() {
    // Get all vms from ember datas
    return this.store.all('vm').filterBy('project').sort(['project', 'user.email']) 
  },
  /*
  setupController: function(controller, model){
    this._super(controller, model);
    this.startRefreshing();
  },
  startRefreshing: function(){
    this.set('refreshing', true);
    Ember.run.later(this, this.refresh, 10000);
  },
  refresh: function(){
    if(!this.get('refreshing')) return;
    this.store.find('vm');
    
    Ember.run.later(this, this.refresh, 30000);
  },
  actions:{
    willTransition: function(){
      this.set('refreshing', false);
    }
  }
  */
});

module.exports = VmsListRoute;

