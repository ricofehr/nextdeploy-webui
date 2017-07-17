import Ember from 'ember';
import config from '../config/environment';

/**
 *  This component manages user form
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class UserForm
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  /**
   *  Sort property for projects list
   *
   *  @attribute projectSorting
   *  @type {String[]}
   */
  projectSorting: ['name'],

  /**
   *  Array of projects sorted
   *
   *  @attribute projectSort
   *  @type {Project[]}
   */
  projectSort: Ember.computed.sort('projects', 'projectSorting'),

  actions: {
    /**
     *  Apply changes on the form following the group value
     *
     *  @event changeGroup
     *  @param {Group} group
     */
    changeGroup: function(group) {
      var accessLevelUser = null;
      var accessLevelCurrent = this.get('session').get('data.authenticated.access_level');

      // default is never create project
      this.set('isProjectCreateRo', true);
      this.set('isProjectCreateDisplay', false);

      // default is never create user
      this.set('isUserCreateRo', true);
      this.set('isUserCreateDisplay', false);

      // default is not recv vms
      this.set('isRecvVmsDisplay', false);

      this.set('user.group', group);
      if (!this.get('user.group') || !this.get('user.group.id')) {
        return;
      }

      accessLevelUser = this.get('user.group').get('access_level');

      // an admin can always create project
      if (accessLevelUser >= 50) {
        this.set('user.is_project_create', true);
        this.set('user.is_user_create', true);
      }

      if (accessLevelUser < 40) {
        this.set('user.is_project_create', false);
        this.set('user.is_user_create', false);
        this.set('user.is_recv_vms', false);
      } else {
        this.set('isProjectCreateDisplay', true);
        this.set('isUserCreateDisplay', true);
        this.set('isRecvVmsDisplay', true);
      }

      // Only ProjectLead can have project-creation right
      if (accessLevelCurrent >= 50 && accessLevelUser < 50 && accessLevelUser >= 40) {
        this.set('isProjectCreateRo', false);
        this.set('isUserCreateRo', false);
      }

    },

    /**
     *  Display openvpn server ca
     *
     *  @event dlOvpnCa
     */
    dlOvpnCa: function() {
      var self = this;

      Ember.$.ajax({
        url: config.APP.APIHost + '/api/v1/user/ovpnca',
        type: "GET",
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') },
        /**
         * A function to be called if the request fails.
         */
        error: function(jqXHR) {
          if (jqXHR.status === 401) { self.set('error401', true); }
          else { self.set('error500', true); }
        },

        success: function(results) {
           self.set('ovpn_ca', results);
        }
      });
    },

    /**
     *  Display openvpn client key
     *
     *  @event dlOvpnKey
     */
    dlOvpnKey: function() {
      var self = this;

      Ember.$.ajax({
        url: config.APP.APIHost + '/api/v1/user/ovpnkey',
        type: "GET",
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') },
        /**
         * A function to be called if the request fails.
         */
        error: function(jqXHR) {
          if (jqXHR.status === 401) { self.set('error401', true); }
          else { self.set('error500', true); }
        },

        success: function(results) {
           self.set('ovpn_key', results);
        }
      });
    },

    /**
     *  Display openvpn client crt
     *
     *  @event dlOvpnCrt
     */
    dlOvpnCrt: function() {
      var self = this;

      Ember.$.ajax({
        url: config.APP.APIHost + '/api/v1/user/ovpncrt',
        type: "GET",
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') },
        /**
         * A function to be called if the request fails.
         */
        error: function(jqXHR) {
          if (jqXHR.status === 401) { self.set('error401', true); }
          else { self.set('error500', true); }
        },

        success: function(results) {
           self.set('ovpn_crt', results);
        }
      });
    },

    /**
     *  Display openvpn setting file
     *
     *  @event dlOvpnConf
     */
    dlOvpnConf: function() {
      var self = this;

      Ember.$.ajax({
        url: config.APP.APIHost + '/api/v1/user/ovpnconf',
        type: "GET",
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') },
        /**
         * A function to be called if the request fails.
         */
        error: function(jqXHR) {
          if (jqXHR.status === 401) { self.set('error401', true); }
          else { self.set('error500', true); }
        },

        success: function(results) {
           self.set('ovpn_conf', results);
        }
      });
    },

    /**
     *  Submit form for create or update current object
     *
     *  @event postItem
     */
    postItem: function() {
      var router = this.get('router');
      var user = this.get('user');
      var accessLevel = this.get('session').get('data.authenticated.access_level');

      // rdirect to users list if success
      var pass = function() {
        // return tu user list if project lead, else homepage
        if (accessLevel >= 40) {
          router.transitionTo('users.list');
        } else {
          router.transitionTo('index');
        }
      };

      // or display error page if request failed
      var fail = function(){
        router.transitionTo('error');
      };

      // check if form is valid
      if (!this.get('isFormValid')) {
        return;
      }

      // loading modal and send request to the server
      router.transitionTo('loading');
      user.save().then(pass, fail);
    }
  },

  /**
   *  quota power-select values
   *
   *  @property quotavmlist
   *  @type {String[]}
   */
  quotavmlist: ['0','1','2','3','4','5','6','7','8','9','10','15','20','30','50','100'],

  /**
   *  nbitems by pages power-select values
   *
   *  @property nbpageslist
   *  @type {Integer[]}
   */
  nbpageslist: [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],

  /**
   *  layout power-select values
   *
   *  @property layoutlist
   *  @type {String[]}
   */
  layoutlist: ['fr','us','es','de'],

  /**
   *  Is is_project_create field is read-only
   *
   *  @property isProjectCreateRo
   *  @type {Boolean}
   */
  isProjectCreateRo: true,

  /**
   *  Is is_user_create field is read-only
   *
   *  @property isUserCreateRo
   *  @type {Boolean}
   */
  isUserCreateRo: true,

  /**
   *  Ensure email is well formed
   *
   *  @function errorEmail
   *  @returns {Boolean} true if no valid field
   */
  errorEmail: function() {
    var email = this.get('user.email');
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(email)) {
      return true;
    }

    return false;
  }.property('user.email'),

  /**
   *  Ensure email is unique
   *
   *  @function errorEmailUnique
   *  @returns {Boolean} true if no valid field
   */
  errorEmailUnique: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');
    var users = this.get('users');
    var email = this.get('user.email');
    var errorEmail = false;
    var currentId = this.get('user.id');

    // set id to 0 if we create a new user
    if (currentId == null) {
      currentId = 0;
    }

    if (accessLevel === 50) {
      if (!users || users.length === 0) { return; }

      users.forEach(function (item) {
        if (item.id !== currentId) {
          if (item.get('user.email') === email) {
            errorEmail = true;
          }
        }
      });
    } else {
      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/users/" + currentId + "/email/" + email,
        global: false,
        headers: {
          'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token')
        }
      })
      .done(function() {
        errorEmail = false;
      })
      .fail(function() {
        errorEmail = true;
      });
    }

    return errorEmail;
  }.property('user.email'),

  /**
   *  Ensure firstname is filled
   *
   *  @function errorFirstname
   *  @returns {Boolean} true if no valid field
   */
  errorFirstname: function() {
    var firstname = this.get('user.firstname');

    if (!firstname) {
      return true;
    }

    return false;
  }.property('user.firstname'),

  /**
   *  Ensure lastname is filled
   *
   *  @function errorLastname
   *  @returns {Boolean} true if no valid field
   */
  errorLastname: function() {
    var lastname = this.get('user.lastname');

    if (!lastname) {
      return true;
    }

    return false;
  }.property('user.lastname'),

  /**
   *  Ensure company is filled
   *
   *  @function errorCompany
   *  @returns {Boolean} true if no valid field
   */
  errorCompany: function() {
    var company = this.get('user.company');

    if (!company) {
      return true;
    }

    return false;
  }.property('user.company'),

  /**
   *  Ensure group is filled
   *
   *  @function errorGroup
   *  @returns {Boolean} true if no valid field
   */
  errorGroup: function() {
    var group = this.get('user.group.id');

    if (!group) {
      return true;
    }

    return false;
  }.property('user.group'),

  /**
   *  Ensure password is well formed
   *
   *  @function errorPassword
   *  @returns {Boolean} true if no valid field
   */
  errorPassword: function() {
    var password = this.get('user.password');
    var errorPassword = false;

    if (password && password.length < 8) {
      errorPassword = true;
    }

    if (!password || password.length === 0) {
      errorPassword = true;
      if (this.get('user.id')) {
        errorPassword = false;
        this.set('user.is_credentials_send', false);
      }
    }

    return errorPassword;
  }.property('user.password'),

  /**
   *  Ensure password-confirmation is well formed
   *
   *  @function errorPasswordConfirmation
   *  @returns {Boolean} true if no valid field
   */
  errorPasswordConfirmation: function() {
    var passwordConfirmation = this.get('user.password_confirmation');
    var errorPasswordConfirmation = false;

    if (passwordConfirmation && passwordConfirmation.length < 8) {
      errorPasswordConfirmation = true;
    }

    if (!passwordConfirmation || passwordConfirmation.length === 0) {
      errorPasswordConfirmation = true;
      if (this.get('user.id')) {
        errorPasswordConfirmation = false;
      }
    }

    return errorPasswordConfirmation;
  }.property('user.password', 'user.password_confirmation'),

  /**
   *  Ensure Password and Password-confirmation are same
   *
   *  @function errorSamePassword
   *  @returns {Boolean} true if no valid field
   */
  errorSamePassword: function() {
    var password = this.get('user.password');
    var password2 = this.get('user.password_confirmation');
    var errorPassword = false;

    if (password !== password2) {
      errorPassword = true;
    }

    return errorPassword;
  }.property('user.password', 'user.password_confirmation'),


  /**
   *  Ensure password attribute is not empty and follows password constraints
   *
   *  @function successPassword
   *  @returns {Boolean} true if valid field
   */
  successPassword: function() {
    var password = this.get('user.password');
    var successPassword = true;

    if (password && password.length < 8) {
      successPassword = false;
    }

    if (!password || password.length === 0) {
      successPassword = false;
    }

    return successPassword;
  }.property('user.password'),

  /**
   *  Ensure password_confirmation is not empty and follows password constraints
   *
   *  @function successPasswordConfirmation
   *  @returns {Boolean} true if valid field
   */
  successPasswordConfirmation: function() {
    var passwordConfirmation = this.get('user.password_confirmation');
    var successPasswordConfirmation = true;

    if (passwordConfirmation && passwordConfirmation.length < 8) {
      successPasswordConfirmation = false;
    }

    if (!passwordConfirmation || passwordConfirmation.length === 0) {
      successPasswordConfirmation = false;
    }

    return successPasswordConfirmation;
  }.property('user.password', 'user.password_confirmation'),

  /**
   *  Ensure that password and password_confirmation are equals
   *
   *  @function successSamePassword
   *  @returns {Boolean} true if valid field
   */
  successSamePassword: function() {
    var password = this.get('user.password');
    var password2 = this.get('user.password_confirmation');
    var successPassword = true;

    if (password !== password2) {
      successPassword = false;
    }

    return successPassword;
  }.property('user.password', 'user.password_confirmation'),

  /**
   *  Ensures all form fields are valids before submit
   *
   *  @function isFormValid
   *  @returns {Boolean}
   */
  isFormValid: function() {
    if (!this.get('errorFirstname') &&
        !this.get('errorLastname') &&
        !this.get('errorEmail') &&
        !this.get('errorEmailUnique') &&
        !this.get('errorCompany') &&
        !this.get('errorGroup') &&
        !this.get('errorPassword') &&
        !this.get('errorPasswordConfirmation') &&
        !this.get('errorSamePassword')) {
      return true;
    }
    return false;
  }.property('errorFirstname', 'errorLastname', 'errorEmail', 'errorEmailUnique',
             'errorCompany', 'errorGroup', 'errorPassword',
             'errorPasswordConfirmation', 'errorSamePassword'),

  /**
   *  Disabled state if current user is neither admin, neither lead
   *
   *  @function isDisableLead
   *  @returns {Boolean} True if disabled
   */
  isDisableLead: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel >= 40) {
      return false;
    }
    return true;
  }.property('user.id'),

  /**
   *  Disabled state if current user is neither admin, neither lead with userCreate right
   *
   *  @function isDisableAdmin
   *  @returns {Boolean} True if disabled
   */
  isDisableAdmin: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');
    var formId = parseInt(this.get('user.id'));
    var userCreate = this.get('session').get('data.authenticated.user.is_user_create');

    if (!formId && userCreate) {
      return false;
    }

    if (parseInt(accessLevel) >= 50) {
      return false;
    }

    return true;
  }.property('user.id'),

  /**
   *  Disabled state if current user is no admin
   *
   *  @function isDisableRealAdmin
   *  @returns {Boolean} True if disabled
   */
  isDisableRealAdmin: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (parseInt(accessLevel) >= 50) {
      return false;
    }

    return true;
  }.property('user.id'),

  /**
   *  Disabled state for projects list
   *
   *  @function isDisableProjectList
   *  @returns {Boolean} True if disabled
   */
  isDisableProjectList: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');
    var groupAccess = 0;
    var formId = parseInt(this.get('user.id'));
    var userCreate = this.get('session').get('data.authenticated.user.is_user_create');

    if (this.get('user.group') && this.get('user.group').get('access_level')) {
      groupAccess = this.get('user.group').get('access_level');
    }

    if (accessLevel < 50 || groupAccess === 50) {
      if (groupAccess === 50) {
        this.set('user.projects', this.get('projects').toArray());
        return true;
      }

      if (!formId && userCreate) {
        return false;
      }
      return true;
    }
    return false;
  }.property('user.id', 'user.group'),

  /**
   *  Disabled state if current user is not the same as current form / or admin
   *
   *  @function isDisable
   *  @returns {Boolean} True if disabled
   */
  isDisable: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');
    var currentId = this.get('session').get('data.authenticated.user.id');
    var formId = parseInt(this.get('user.id'));
    var userCreate = this.get('session').get('data.authenticated.user.is_user_create');

    if (accessLevel >= 50) {
      return false;
    }

    if (!formId && userCreate) {
      return false;
    }

    if (currentId === formId) {
      return false;
    }

    return true;
  }.property('user.id'),

  /**
   *  Check if current user is admin
   *
   *  @function isAdmin
   *  @returns {Boolean} True if admin
   */
  isAdmin: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel >= 50) {
      return true;
    }

    return false;
  }.property('session.data.authenticated.user.id'),

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
  }.property('session.data.authenticated.user.id'),

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
  }.property('session.data.authenticated.user.id'),

  /**
   *  Check if current user is same as current form / or admin
   *
   *  @function isEnable
   *  @returns {Boolean}
   */
  isEnable: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');
    var currentId = this.get('session').get('data.authenticated.user.id');
    var formId = parseInt(this.get('user.id'));
    var userCreate = this.get('session').get('data.authenticated.user.is_user_create');

    if (accessLevel >= 50) {
      return true;
    }

    if (!formId && userCreate) {
      return true;
    }

    if (currentId === formId) {
      return true;
    }

    return false;
  }.property('user.id'),

  /**
   *  Check if form user is allowed by ssh key
   *
   *  @function isSSH
   *  @returns {Boolean}
   */
  isSSH: function() {
    var accessLevelUser;
    var accessLevel = this.get('session').get('data.authenticated.access_level');
    var currentId = this.get('session').get('data.authenticated.user.id');
    var userId = this.get('user.id');

    if (userId == null || !userId) {
      return false;
    }

    accessLevelUser = this.get('user.group').get('access_level');
    if (accessLevelUser < 30) {
      return false;
    }

    if (accessLevel >= 50) {
      return true;
    }

    if (currentId === parseInt(userId)) {
      return true;
    }

    return false;
  }.property('user.id'),

  /**
   *  Check if current id is equal to authenticated user
   *
   *  @function isSelf
   *  @returns {Boolean}
   */
  isSelf: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');
    var currentId = this.get('session').get('data.authenticated.user.id');
    var userId = this.get('user.id');

    if (accessLevel >= 50) { return true; }
    if (parseInt(userId) === currentId) { return true; }
    return false;
  }.property('user.id'),

  /**
   *  Trigger when receives models
   *
   *  @method didReceiveAttrs
   */
  didReceiveAttrs() {
    this._super(...arguments);
    this.cleanModel();
    this.initModel();
  },

  /**
   *  Hide some groups by accessLevel user
   *
   *  @method groupsFilter
   */
  groupsFilter: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');
    var currentId = this.get('session').get('data.authenticated.user.id');
    var userId = this.get('user.id');

    this.get('groups').forEach(function(group) {
      group.set('isShow', true);
      if (!userId || parseInt(userId) !== currentId) {
        if (parseInt(accessLevel) === 40 && parseInt(group.get('access_level')) >= 40) {
          group.set('isShow', false);
        }
      }
    });
  },

  /**
   *  Delete records unsaved or deleted
   *
   *  @method cleanModel
   */
  cleanModel: function() {
    var cleanProjects = this.store.peekAll('project').filterBy('id', null);

    cleanProjects.forEach(function (clean) {
      if (clean) { clean.deleteRecord(); }
    });
  },

  /**
   *  Init current model
   *
   *  @method initModel
   */
  initModel: function() {
    // HACK fix weird issue for permit select 0 into power-select
    this.get('user').set('quotavm', '' + this.get('user').get('quotavm'));
    this.get('user').set('quotaprod', '' + this.get('user').get('quotaprod'));

    this.groupsFilter();
  }
});
