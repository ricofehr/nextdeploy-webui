import Ember from 'ember';

/**
 *  This component manages the welcome message on the homepage Wall
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class DashboardWelcome
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  /**
   *  Return the current user in session
   *
   *  @function currentUser
   *  @returns {User} the session user object
   */
  currentUser: function() {
    return this.get('session').get('data.authenticated.user');
  }.property('session.data.authenticated.user.id')
});
