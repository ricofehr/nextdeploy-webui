import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
   model(params) {

    return Ember.RSVP.hash({
      brands: this.store.peekAll('brand'),
      brand: this.store.peekRecord('brand', params.brand_id),
    });
  },
});