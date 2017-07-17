import Ember from 'ember';

/**
 *  This component manages the project details modal
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class ProjectDetails
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  /**
   *  Sort property for users list
   *
   *  @attribute
   *  @type {String[]}
   */
  emailSorting: ['email'],

  /**
   *  Array of users sorted
   *
   *  @attribute
   *  @type {User[]}
   */
  usersSort: Ember.computed.sort('users', 'emailSorting'),

  actions: {
    /**
     *  Add or remove an user
     *
     *  @event changeUsers
     *  @param {User[]} value
     */
    changeUsers: function(value) {
      var self = this;

      this.set('loadingModal', true);
      // set model properties from temporary buffer
      this.set('project.users', value);
      this.checkAdminUsers();

      this.get('project').save().then(function() {
        self.set('loadingModal', false);
      });
    },

    /**
     *  Close the details modal
     *
     *  @event closeDetails
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
   *  @property loadingModal
   *  @type {Boolean}
   */
  loadingModal: false,

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
   *  Return ftp username for current project
   *
   *  @function getFtpUser
   *  @returns {String} The ftp username
   */
  getFtpUser: function() {
    var gitpath = '';

    if (!this.get('isShowingDetails')) {
      return;
    }

    gitpath = this.get('project').get('gitpath');
    if (!gitpath) {
      return "";
    }

    // HACK find the ftp username from the gitpath value
    return gitpath.replace(/.*\//g, "");
  }.property('isShowingDetails'),

  /**
   *  Return ftp password for current project
   *
   *  @function getFtpPassword
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
   *  @function getFtpHost
   *  @returns {String} The ftp hostname
   */
  getFtpHost: function() {
    // HACK find the ftp host from the WebUI URI
    return 'f.' + window.location.hostname.replace(/^ui\./,'');
  }.property('project.gitpath'),

  /**
   *  Trigger when receives models
   *
   *  @method didReceiveAttrs
   */
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('loadingModal', false);
  },

  /**
   *  Ensure that no admin or himself are removed from the project
   *
   *  @method checkAdminUsers
   */
  checkAdminUsers: function() {
    var self = this;
    var userId = this.get('session').get('data.authenticated.user.id');

    this.get('users').forEach(function (user) {
      if (user.get('group').get('access_level') === 50 ||
          parseInt(user.id) === userId) {
        if (!self.get('project.users').contains(user)) {
          self.get('project.users').pushObject(user);
        }
      }
    });
  }
});
