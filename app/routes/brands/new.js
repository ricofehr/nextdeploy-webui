import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) brands new route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class BrandsNew
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the model for new brand form
   *    - create a brand empty object
   *    - brands list
   *
   *  @function model
   *  @returns {Hash} a RSVP hash included brands, and brand empty object
   */
  model() {
    return Ember.RSVP.hash({
      brands: this.store.peekAll('brand'),
      brand: this.store.createRecord('brand')
    });
  },
});
