import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {

    return Ember.RSVP.hash({
      // sort by status, prod flag and id
      vms: this.store.peekAll('vm').toArray().sort(function(a, b) {
        var prod_a = a.get('is_prod') ? 1 : 0;
        var prod_b = b.get('is_prod') ? 1 : 0;
        var status_a = parseInt(a.get('status'));
        var status_b = parseInt(b.get('status'));

        if (status_a !== 1) {
          status_a = status_a > 1 ? 0 : (-status_a)
        }
    
        if (status_b !== 1) {
          status_b = status_b > 1 ? 0 : (-status_b)    
        }
        
        var comp_status = Ember.compare(status_b, status_a);
        var comp_prod = Ember.compare(prod_b, prod_a);

        if (comp_status === 0 && comp_prod === 0) {
          return Ember.compare(parseInt(b.get('id')), parseInt(a.get('id')));
        }

        if (comp_status === 0) {
          return comp_prod;
        }

        return comp_status;
      })
    });
  },

  // Setup the controller for vms.list with this model
  setupController: function(controller, model) {
    this.controllerFor('vms.list').setProperties({model: model,
                                                  userId: 0,
                                                  projectId: 0});
  }
});
