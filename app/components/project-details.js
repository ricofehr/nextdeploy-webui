import Ember from 'ember';

export default Ember.Component.extend({
  loadingModal: false,
  // sort properties
  emailSorting: ['email'],

  // sort each listing items
  usersSort: Ember.computed.sort('users', 'emailSorting'),

  // trigger function when model changes
  didReceiveAttrs() {
    this._super(...arguments);
    this.initBuffer();
    this.set('loadingModal', false);
  },

  // use a buffer for array attributes for avoid weird issue with power-select
  initBuffer: function() {
    if (this.get('isShowingDetails')) {
      this.set('project_users', this.get('project').get('users').toArray());
    }
  },

  // use a buffer for array attributes for avoid weird issue with power-select
  flushBuffer: function() {
    this.get('project').set('users', this.get('project_users'));
  },

  // Return true if user is a Lead Dev
  isLead: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 40) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  // Return ftp username for current project
  getFtpUser: function() {
    var gitpath = '';

    if (!this.get('isShowingDetails')) {
      return;
    }

    gitpath = this.get('project').get('gitpath');
    if (!gitpath) { return ""; }

    return gitpath.replace(/.*\//g, "");
  }.property('isShowingDetails'),

  // Return ftp password for the current project
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

  // Return ftp host for current project
  getFtpHost: function() {
    return 'f.' + window.location.hostname.replace(/^ui\./,'');
  }.property('project.gitpath'),

  // we cant remove admin users or himself from a project
  checkAdminUsers: function() {
    var self = this;
    var user_id = this.get('session').get('data.authenticated.user.id');

    this.get('users').forEach(function (user) {
      if (user.get('group').get('access_level') === 50 || parseInt(user.id) === user_id) {
        if (!self.get('project_users').contains(user)) {
          self.get('project_users').pushObject(user);
        }
      }
    });
  },

  actions: {
    // add or remove an user
    changeUsers: function(value) {
      var self = this;

      this.set('loadingModal', true);
      // set model properties from temporary buffer
      this.set('project_users', value);
      this.checkAdminUsers();
      this.flushBuffer();

      this.get('project').save().then(function() {
        self.set('loadingModal', false);
        //self.initBuffer();
      });
    },

    // close the modal, reset showing variable
    closeDetails: function() {
      this.set('isShowingDetails', false);
      this.set('isBusy', false);
      this.set('project', null);
    }
  }
});
