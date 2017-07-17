import Ember from 'ember';

/**
 *  Define the application error route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class ApplicationError
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend({
  actions: {
    /**
     *  Logout action in error page
     *
     *  @event invalidateSession
     */
    invalidateSession() {
      var session = this.get('session');

      if (session.get('isAuthenticated')) {
        session.invalidate();
      } else {
        this.transitionTo('login');
      }
    }
  }
});
