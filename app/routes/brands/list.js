import Ember from 'ember';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    return Ember.RSVP.hash({
      brands: this.store.peekAll('brand').sortBy('name'),
      projects: this.store.peekAll('project'),
      vms: this.store.peekAll('vm')
    });
  },
});