import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
   model(params) {

    return Ember.RSVP.hash({
      groups: this.store.peekAll('group'),
      projects: this.store.peekAll('project'),
      user: this.store.findRecord('user', params.user_id),
      users: this.store.peekAll('user')
    });
  },
});