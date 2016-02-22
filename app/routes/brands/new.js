import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
   model() {

    return Ember.RSVP.hash({
      brands: this.store.peekAll('brand'),
      brand: this.store.createRecord('brand')
    });
  },
});