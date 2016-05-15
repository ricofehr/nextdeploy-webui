import Ember from 'ember';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {

    return Ember.RSVP.hash({
      groups: this.store.peekAll('group').sortBy('access_level').reverse(),
      projects: this.store.peekAll('project'),
      users: this.store.peekAll('user'),
      user: this.store.createRecord('user', { quotavm: '4', quotaprod: '0', layout: 'fr', is_credentials_send: true })
    });
  },
});