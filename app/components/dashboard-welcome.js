import Ember from 'ember';

/**
 *  This component manages the welcome message on the homepage Wall
 *
 *  @module components/dashboard-welcome
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  /**
   *  Return the current user in session
   *
   *  @function
   *  @returns {User} the session user object
   */
  currentUser: function() {
    return this.get('session').get('data.authenticated.user');
  }.property('session.data.authenticated.user.id')
});
