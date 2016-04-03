import Ember from 'ember';

export default Ember.Component.extend({
  modalHelp: false,
  collapsed: true,

  // return current user properties
  currentUser: function() {
    return this.get('session').get('data.authenticated.user');
  }.property('session.data.authenticated.user.id'),

  // Return true if user is an admin
  isAdmin: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level === 50) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  // Return true if user is a Lead Dev
  isLead: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 40) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  // Return true if user is a Dev or more
  isDev: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 30) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  // Return true if user is a Pm or more
  isPM: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 20) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  actions: {
    // display help modal
    help() {
      this.set('modalHelp', true);
    },

    // logout current user
    invalidateSession() {
      this.get('session').invalidate();
    },

    // open gitlab window
    openGitlab() {
      window.open('/gitlab', '_blank');
    },

    // Toggle or untoggle menu
    toggleCollapsed() {
      if (this.get('collapsed')) { this.set('collapsed', false); }
      else { this.set('collapsed', true); }
    },
  }

});