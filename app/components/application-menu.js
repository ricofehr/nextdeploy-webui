import Ember from 'ember';

/**
 *  This component manages the webui header menu
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class ApplicationMenu
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Display the help modal
     *
     *  @event help
     */
    help() {
      this.set('modalHelp', true);
    },

    /**
     *  Reset the Search field
     *
     *  @event resetSearch
     */
    resetSearch() {
      this.set('search', '');
    },

    /**
     *  Logout current user
     *
     *  @event invalidateSession
     */
    invalidateSession() {
      this.get('session').invalidate();
    },

    /**
     *  Open gitlab window
     *
     *  @event openGitlab
     */
    openGitlab() {
      window.open('/gitlab', '_blank');
    },

    /**
     *  Toggle or untoggle menu
     *
     *  @event toggleCollapsed
     */
    toggleCollapsed() {
      if (this.get('collapsed')) { this.set('collapsed', false); }
      else { this.set('collapsed', true); }
    },
  },

  /**
   *  Flag to display the help modal
   *
   *  @property modalHelp
   *  @type {Boolean}
   */
  modalHelp: false,

  /**
   *  Flag to collpase the menu
   *
   *  @property collapsed
   *  @type {Boolean}
   */
  collapsed: true,

  /**
   *  Return the current user in session
   *
   *  @function currentUser
   *  @returns {User} the session user object
   */
  currentUser: function() {
    return this.get('session').get('data.authenticated.user');
  }.property('session.data.authenticated.user.id'),

  /**
   *  Check if current user is admin
   *
   *  @function isAdmin
   *  @returns {Boolean} True if admin
   */
  isAdmin: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel === 50) {
      return true;
    }

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

    if (accessLevel >= 40) {
      return true;
    }

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

    if (accessLevel >= 30) {
      return true;
    }

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

    if (accessLevel >= 20) {
      return true;
    }

    return false;
  }.property('session.data.authenticated.access_level')
});
