import Ember from 'ember';

/**
 *  This component manages the help modal
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class ApplicationHelp
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  /**
   *  Check if current user is admin
   *
   *  @function isAdmin
   *  @returns {Boolean} True if admin
   */
  isAdmin: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel === 50) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Check if current user is admin or lead
   *
   *  @function isLead
   *  @returns {Boolean} True if admin or lead
   */
  isLead: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel >= 40) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Check if current user is admin, lead, or dev
   *
   *  @function isDev
   *  @returns {Boolean} True if admin, lead, or dev
   */
  isDev: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel >= 30) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Check if current user is admin, lead, dev, or ProjectManager
   *
   *  @function isPM
   *  @returns {Boolean} True if admin, lead, dev, or pm
   */
  isPM: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel >= 20) { return true; }
    return false;
  }.property('session.data.authenticated.access_level')
});
