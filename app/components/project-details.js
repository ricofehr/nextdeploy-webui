import Ember from 'ember';

/**
 *  This component manages the project details modal
 *
 *  @module components/project-details
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  /**
   *  Sort property for users list
   *
   *  @type {String[]}
   */
  emailSorting: ['email'],

  /**
   *  Array of users sorted
   *
   *  @type {User[]}
   */
  usersSort: Ember.computed.sort('users', 'emailSorting'),

  actions: {
    /**
     *  Add or remove an user
     *
     *  @function
     */
    changeUsers: function(value) {
      var self = this;

      this.set('loadingModal', true);
      // set model properties from temporary buffer
      this.set('project_users', value);
      this.checkAdminUsers();
      this.flushBuffer();

      this.get('project').save().then(function() {
        self.set('loadingModal', false);
      });
    },

    /**
     *  Close the details modal
     *
     *  @function
     */
    closeDetails: function() {
      this.set('isShowingDetails', false);
      this.set('isBusy', false);
      this.set('project', null);
    }
  },

  /**
   *  Flag to display the modal
   *
   *  @type {Boolean}
   */
  loadingModal: false,

  /**
   *  Check if current user is admin or lead
   *
   *  @function
   *  @returns {Boolean} True if admin or lead
   */
  isLead: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 40) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Return ftp username for current project
   *
   *  @function
   *  @returns {String} The ftp username
   */
  getFtpUser: function() {
    var gitpath = '';

    if (!this.get('isShowingDetails')) {
      return;
    }

    gitpath = this.get('project').get('gitpath');
    if (!gitpath) { return ""; }

    // HACK find the ftp username from the gitpath value
    return gitpath.replace(/.*\//g, "");
  }.property('isShowingDetails'),

  /**
   *  Return ftp password for current project
   *
   *  @function
   *  @returns {String} The ftp password
   */
  getFtpPassword: function() {
    var ftppasswd = 'nextdeploy';
    var password = '';

    if (!this.get('isShowingDetails')) {
      return;
    }

    password = this.get('project').get('password');
    if (password && password.length > 0) {
      ftppasswd = password.substring(0,8);
    }

    return ftppasswd;
  }.property('isShowingDetails'),

  /**
   *  Return ftp hostname for current project
   *
   *  @function
   *  @returns {String} The ftp hostname
   */
  getFtpHost: function() {
    // HACK find the ftp host from the WebUI URI
    return 'f.' + window.location.hostname.replace(/^ui\./,'');
  }.property('project.gitpath'),

  /**
   *  Trigger when receives models
   *
   *  @function
   */
  didReceiveAttrs() {
    this._super(...arguments);
    this.initBuffer();
    this.set('loadingModal', false);
  },

  /**
   *  Init a buffer for array attributes
   *  HACK use a buffer to avoid weird issue with power-select
   *
   *  @function
   */
  initBuffer: function() {
    if (this.get('isShowingDetails')) {
      this.set('project_users', this.get('project').get('users').toArray());
    }
  },

  /**
   *  Flush a buffer for array attributes
   *  HACK use a buffer to avoid weird issue with power-select
   *
   *  @function
   */
  flushBuffer: function() {
    this.get('project').set('users', this.get('project_users'));
  },

  /**
   *  Ensure that no admin or himself are removed from the project
   *
   *  @function
   */
  checkAdminUsers: function() {
    var self = this;
    var user_id = this.get('session').get('data.authenticated.user.id');

    this.get('users').forEach(function (user) {
      if (user.get('group').get('access_level') === 50 ||
          parseInt(user.id) === user_id) {
        if (!self.get('project_users').contains(user)) {
          self.get('project_users').pushObject(user);
        }
      }
    });
  }
});
