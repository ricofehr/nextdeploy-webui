import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) users index route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class UsersIndex
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Redirect to users.list
   *
   *  @method redirect
   */
  redirect: function() {
    this.transitionTo('users.list');
  }
});
