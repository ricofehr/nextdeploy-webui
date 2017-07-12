import Ember from 'ember';

/**
 *  This component manages the webui header menu
 *
 *  @module components/application-menu
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Display the help modal
     *
     *  @function
     */
    help() {
      this.set('modalHelp', true);
    },

    /**
     *  Reset the Search field
     *
     *  @function
     */
    resetSearch() {
      this.set('search', '');
    },

    /**
     *  Logout current user
     *
     *  @function
     */
    invalidateSession() {
      this.get('session').invalidate();
    },

    /**
     *  Open gitlab window
     *
     *  @function
     */
    openGitlab() {
      window.open('/gitlab', '_blank');
    },

    /**
     *  Toggle or untoggle menu
     *
     *  @function
     */
    toggleCollapsed() {
      if (this.get('collapsed')) { this.set('collapsed', false); }
      else { this.set('collapsed', true); }
    },
  },

  /**
   *  Flag to display the help modal
   *
   *  @type {Boolean}
   */
  modalHelp: false,

  /**
   *  Flag to collpase the menu
   *
   *  @type {Boolean}
   */
  collapsed: true,

  /**
   *  Return the current user in session
   *
   *  @function
   *  @returns {User} the session user object
   */
  currentUser: function() {
    return this.get('session').get('data.authenticated.user');
  }.property('session.data.authenticated.user.id'),

  /**
   *  Check if current user is admin
   *
   *  @function
   *  @returns {Boolean} True if admin
   */
  isAdmin: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level === 50) {
      return true;
    }

    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Check if current user is admin or lead
   *
   *  @function
   *  @returns {Boolean} True if admin or lead
   */
  isLead: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 40) {
      return true;
    }

    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Check if current user is admin, lead, or dev
   *
   *  @function
   *  @returns {Boolean} True if admin, lead, or dev
   */
  isDev: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 30) {
      return true;
    }

    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Check if current user is admin, lead, dev, or ProjectManager
   *
   *  @function
   *  @returns {Boolean} True if admin, lead, dev, or pm
   */
  isPM: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 20) {
      return true;
    }

    return false;
  }.property('session.data.authenticated.access_level')
});
