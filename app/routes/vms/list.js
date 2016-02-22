import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {

    return Ember.RSVP.hash({
      vms: this.store.peekAll('vm').toArray().sort(function(a, b) {
        return Ember.compare(parseInt(b.id), parseInt(a.id));
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
