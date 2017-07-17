import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) brands edit route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class BrandsEdit
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the current model
   *
   *  @function model
   *  @param {Hash} params String => String (with brand id)
   *  @returns {Hash} a RSVP hash included brands, and the brand object targetted
   */
  model(params) {
    return Ember.RSVP.hash({
      brands: this.store.peekAll('brand'),
      brand: this.store.findRecord('brand', params.brand_id, { reload: true }),
    });
  },
});
