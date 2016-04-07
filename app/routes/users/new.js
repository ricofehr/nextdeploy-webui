import Ember from 'ember';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {

    return Ember.RSVP.hash({
      groups: this.store.peekAll('group'),
      projects: this.store.peekAll('project'),
      users: this.store.peekAll('user'),
      user: this.store.createRecord('user', { quotavm: '3', layout: 'us' })
    });
  },
});