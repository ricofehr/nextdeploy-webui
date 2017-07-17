import Ember from 'ember';

/**
 *  Define the default index route of the app
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Index
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend({
  /**
   *  Redirect to dashboard
   *
   *  @function
   */
  redirect: function() {
   this.transitionTo('dashboard');
  }
});
