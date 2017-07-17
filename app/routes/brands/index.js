import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) brands index route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class BrandsIndex
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Redirect to brands.list
   *
   *  @method redirect
   */
  redirect: function() {
    this.transitionTo('brands.list');
  }
});
