import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define (authenticated) dashboard route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Dashboard
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the posts for the homepage Wall
   *
   *  @function
   *  @returns {Hash[]} included posts list
   */
  model() {
    return Ember.RSVP.hash({
      posts: this.store.peekAll('hpmessage')
    });
  }
});
