import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {

    return Ember.RSVP.hash({
      groups: this.store.peekAll('group'),
      users: this.store.peekAll('user').sortBy('email'),
      sshkeys: this.store.peekAll('sshkey'),
      vms: this.store.peekAll('vm')
    });
  },

  // Setup the controller for vms.list with this model
  setupController: function(controller, model) {
    this.controllerFor('users.list').setProperties({model: model,
                                                  groupId: 0,
                                                  projectId: 0});
  }
});