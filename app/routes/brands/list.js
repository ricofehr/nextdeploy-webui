import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) brands list route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class BrandsList
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the model for brands list
   *    - brands arrays
   *    - projects arrays
   *    - vms arrays
   *
   *  @function model
   *  @returns {Hash} a RSVP hash included brands, projects and vms
   */
  model() {
    return Ember.RSVP.hash({
      brands: this.store.peekAll('brand').sortBy('name'),
      projects: this.store.peekAll('project'),
      vms: this.store.peekAll('vm')
    });
  },
});
