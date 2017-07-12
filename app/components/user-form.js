import Ember from 'ember';
import config from '../config/environment';

/**
 *  This component manages user form
 *
 *  @module components/user-form
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  /**
   *  Sort property for projects list
   *
   *  @type {String[]}
   */
  projectSorting: ['name'],

  /**
   *  Array of projects sorted
   *
   *  @type {Project[]}
   */
  projectSort: Ember.computed.sort('projects', 'projectSorting'),

  actions: {
    /**
     *  Apply changes on the form following the group value
     *
     *  @function
     *  @param {Group} group
     */
    changeGroup: function(group) {
      var access_level_user = null;
      var access_level_current = this.get('session').get('data.authenticated.access_level');

      // default is never create project
      this.set('is_project_create_ro', true);
      this.set('is_project_create_display', false);

      // default is never create user
      this.set('is_user_create_ro', true);
      this.set('is_user_create_display', false);

      // default is not recv vms
      this.set('is_recv_vms_display', false);

      this.set('user.group', group);
      if (!this.get('user.group') || !this.get('user.group.id')) {
        return;
      }

      access_level_user = this.get('user.group').get('access_level');

      // an admin can always create project
      if (access_level_user >= 50) {
        this.set('user.is_project_create', true);
        this.set('user.is_user_create', true);
      }

      if (access_level_user < 40) {
        this.set('user.is_project_create', false);
        this.set('user.is_user_create', false);
        this.set('user.is_recv_vms', false);

      } else {
        this.set('is_project_create_display', true);
        this.set('is_user_create_display', true);
        this.set('is_recv_vms_display', true);
      }

      // Only ProjectLead can have project-creation right
      if (access_level_current >= 50 && access_level_user < 50 && access_level_user >= 40) {
        this.set('is_project_create_ro', false);
        this.set('is_user_create_ro', false);
      }

    },

    /**
     *  Apply power-select change on model
     *
     *  @function
     *  @param {String} property
     *  @param {String} value
     */
    changeProperty: function(property, value) {
      this.set(property, value);
    },

    /**
     *  Apply toggles change on model
     *
     *  @function
     *  @param {Boolean} disabled if toggle field is on disabled state
     *  @param {String} property the attribute name
     *  @param {Boolean} toggle the value
     */
    toggleFlagUser: function(disabled, property, toggle) {
      if (disabled) {
        return;
      }

      this.get('user').set(property, toggle.newValue);
    },

    /**
     *  Display openvpn server ca
     *
     *  @function
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
     *  @function
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
     *  @function
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
     *  @function
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
     *  @function
     */
    postItem: function() {
      var router = this.get('router');
      var user = this.get('user');
      var access_level = this.get('session').get('data.authenticated.access_level');

      // rdirect to users list if success
      var pass = function() {
        // return tu user list if project lead, else homepage
        if (access_level >= 40) {
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
      if (!this.formIsValid()) {
        return;
      }

      // set model properties from temporary buffer
      this.flushBuffer();

      // loading modal and send request to the server
      router.transitionTo('loading');
      user.save().then(pass, fail);
    }
  },

  /**
   *  quota power-select values
   *
   *  @type {String[]}
   */
  quotavmlist: ['0','1','2','3','4','5','6','7','8','9','10','15','20','30','50','100'],

  /**
   *  nbitems by pages power-select values
   *
   *  @type {Integer[]}
   */
  nbpageslist: [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],

  /**
   *  layout power-select values
   *
   *  @type {String[]}
   */
  layoutlist: ['fr','us','es','de'],

  /**
   *  Is is_project_create field is read-only
   *
   *  @type {Boolean}
   */
  is_project_create_ro: true,

  /**
   *  Is is_user_create field is read-only
   *
   *  @type {Boolean}
   */
  is_user_create_ro: true,

  /**
   *  Password is ok
   *
   *  @type {Boolean}
   */
  successPassword: false,

  /**
   *  Password-confirmation is ok
   *
   *  @type {Boolean}
   */
  successPasswordConfirmation: false,

  /**
   *  Password and Password-confirmation are different
   *
   *  @type {Boolean}
   */
  successSamePassword: false,

  /**
   *  Ensure email is well formed
   *
   *  @function
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
   *  @function
   *  @returns {Boolean} true if no valid field
   */
  errorEmailUnique: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var users = this.get('users');
    var email = this.get('user.email');
    var errorEmail = false;
    var current_id = this.get('user.id');

    // set id to 0 if we create a new user
    if (current_id == null) {
      current_id = 0;
    }

    if (access_level === 50) {
      if (!users || users.length === 0) { return; }

      users.forEach(function (item) {
        if (item.id !== current_id) {
          if (item.get('user.email') === email) {
            errorEmail = true;
          }
        }
      });
    } else {
      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/users/" + current_id + "/email/" + email,
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
   *  @function
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
   *  @function
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
   *  @function
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
   *  @function
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
   *  Ensure password attribute is not empty and follows password constraints
   *
   *  @function
   *  @returns {Boolean} true if no valid field
   */
  errorPassword: function() {
    var password = this.get('user.password');
    var errorPassword = false;
    var successPassword = true;

    if (password && password.length < 8) {
      errorPassword = true;
      successPassword = false;
    }

    if (!password || password.length === 0) {
      errorPassword = true;
      if (this.get('user.id')) {
        errorPassword = false;
        this.set('user.is_credentials_send', false);
      }
      successPassword = false;
    }

    this.set('successPassword', successPassword);

    return errorPassword;
  }.property('user.password'),

  /**
   *  Ensure password_confirmation is not empty and follows password constraints
   *
   *  @function
   *  @returns {Boolean} true if no valid field
   */
  errorPasswordConfirmation: function() {
    var passwordConfirmation = this.get('user.password_confirmation');
    var errorPasswordConfirmation = false;
    var successPasswordConfirmation = true;

    if (passwordConfirmation && passwordConfirmation.length < 8) {
      errorPasswordConfirmation = true;
      successPasswordConfirmation = false;
    }

    if (!passwordConfirmation || passwordConfirmation.length === 0) {
      errorPasswordConfirmation = true;
      if (this.get('user.id')) {
        errorPasswordConfirmation = false;
      }
      successPasswordConfirmation = false;
    }

    this.set('successPasswordConfirmation', successPasswordConfirmation);

    return errorPasswordConfirmation;
  }.property('user.password_confirmation'),

  /**
   *  Ensure that password and password_confirmation are equals
   *
   *  @function
   *  @returns {Boolean} true if no valid field
   */
  errorSamePassword: function() {
    var password = this.get('user.password');
    var password2 = this.get('user.password_confirmation');
    var errorPassword = false;
    var successPassword = true;

    if (password !== password2) {
      errorPassword = true;
      successPassword = false;
    }

    this.set('successSamePassword', successPassword);

    return errorPassword;
  }.property('user.password', 'user.password_confirmation'),

  /**
   *  Disabled state if current user is neither admin, neither lead
   *
   *  @function
   *  @returns {Boolean} True if disabled
   */
  isDisableLead: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 40) {
      return false;
    }
    return true;
  }.property('user.id'),

  /**
   *  Disabled state if current user is neither admin, neither lead with user_create right
   *
   *  @function
   *  @returns {Boolean} True if disabled
   */
  isDisableAdmin: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var form_id = parseInt(this.get('user.id'));
    var user_create = this.get('session').get('data.authenticated.user.is_user_create');

    if (!form_id && user_create) {
      return false;
    }

    if (parseInt(access_level) >= 50) {
      return false;
    }

    return true;
  }.property('user.id'),

  /**
   *  Disabled state if current user is no admin
   *
   *  @function
   *  @returns {Boolean} True if disabled
   */
  isDisableRealAdmin: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (parseInt(access_level) >= 50) { return false; }
    return true;
  }.property('user.id'),

  /**
   *  Disabled state for projects list
   *
   *  @function
   *  @returns {Boolean} True if disabled
   */
  isDisableProjectList: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var group_access = 0;
    var form_id = parseInt(this.get('user.id'));
    var user_create = this.get('session').get('data.authenticated.user.is_user_create');

    if (this.get('user.group') && this.get('user.group').get('access_level')) {
      group_access = this.get('user.group').get('access_level');
    }

    if (access_level < 50 || group_access === 50) {
      if (group_access === 50) {
        this.set('user_projects', this.get('projects').toArray());
        return true;
      }

      if (!form_id && user_create) {
        return false;
      }
      return true;
    }
    return false;
  }.property('user.id', 'user.group'),

  /**
   *  Disabled state if current user is not the same as current form / or admin
   *
   *  @function
   *  @returns {Boolean} True if disabled
   */
  isDisable: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var current_id = this.get('session').get('data.authenticated.user.id');
    var form_id = parseInt(this.get('user.id'));
    var user_create = this.get('session').get('data.authenticated.user.is_user_create');

    if (access_level >= 50) {
      return false;
    }

    if (!form_id && user_create) {
      return false;
    }

    if (current_id === form_id) {
      return false;
    }

    return true;
  }.property('user.id'),

  /**
   *  Check if current user is admin
   *
   *  @function
   *  @returns {Boolean} True if admin
   */
  isAdmin: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 50) {
      return true;
    }

    return false;
  }.property('session.data.authenticated.user.id'),

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
  }.property('session.data.authenticated.user.id'),

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
  }.property('session.data.authenticated.user.id'),

  /**
   *  Check if current user is same as current form / or admin
   *
   *  @function
   *  @returns {Boolean}
   */
  isEnable: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var current_id = this.get('session').get('data.authenticated.user.id');
    var form_id = parseInt(this.get('user.id'));
    var user_create = this.get('session').get('data.authenticated.user.is_user_create');

    if (access_level >= 50) {
      return true;
    }

    if (!form_id && user_create) {
      return true;
    }

    if (current_id === form_id) {
      return true;
    }

    return false;
  }.property('user.id'),

  /**
   *  Check if form user is allowed by ssh key
   *
   *  @function
   *  @returns {Boolean}
   */
  isSSH: function() {
    var access_level_user;
    var access_level = this.get('session').get('data.authenticated.access_level');
    var current_id = this.get('session').get('data.authenticated.user.id');
    var user_id = this.get('user.id');

    if (user_id == null || !user_id) {
      return false;
    }

    access_level_user = this.get('user.group').get('access_level');
    if (access_level_user < 30) {
      return false;
    }

    if (access_level >= 50) {
      return true;
    }

    if (current_id === parseInt(user_id)) {
      return true;
    }

    return false;
  }.property('user.id'),

  /**
   *  Check if current id is equal to authenticated user
   *
   *  @function
   *  @returns {Boolean}
   */
  isSelf: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var current_id = this.get('session').get('data.authenticated.user.id');
    var user_id = this.get('user.id');

    if (access_level >= 50) { return true; }
    if (parseInt(user_id) === current_id) { return true; }
    return false;
  }.property('user.id'),

  /**
   *  Trigger when receives models
   *
   *  @function
   */
  didReceiveAttrs() {
    this._super(...arguments);
    this.cleanModel();
    this.initBuffer();
    this.initModel();
  },

  /**
   *  Hide some groups by access_level user
   *
   *  @function
   */
  groupsFilter: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var current_id = this.get('session').get('data.authenticated.user.id');
    var user_id = this.get('user.id');

    this.get('groups').forEach(function(group) {
      group.set('isShow', true);
      if (!user_id || parseInt(user_id) !== current_id) {
        if (parseInt(access_level) === 40 && parseInt(group.get('access_level')) >= 40) {
          group.set('isShow', false);
        }
      }
    });
  },

  /**
   *  Delete records unsaved or deleted
   *
   *  @function
   */
  cleanModel: function() {
    var cleanProjects = this.store.peekAll('project').filterBy('id', null);

    cleanProjects.forEach(function (clean) {
      if (clean) { clean.deleteRecord(); }
    });
  },

  /**
   *  Init a buffer for array attributes
   *  HACK use a buffer to avoid weird issue with power-select
   *
   *  @function
   */
  initBuffer: function() {
    this.set('user_projects', this.get('user').get('projects').toArray());
  },

  /**
   *  Flush a buffer for array attributes
   *  HACK use a buffer to avoid weird issue with power-select
   *
   *  @function
   */
  flushBuffer: function() {
    this.get('user').set('projects', this.get('user_projects'));
  },

  /**
   *  Init current model
   *
   *  @function
   */
  initModel: function() {
    // fix weird issue for permit select 0 into power-select
    this.get('user').set('quotavm', '' + this.get('user').get('quotavm'));
    this.get('user').set('quotaprod', '' + this.get('user').get('quotaprod'));

    this.groupsFilter();
    this.formIsValid();
  },

  /**
   *  Ensures all form fields are valids before submit
   *
   *  @function
   */
  formIsValid: function() {
    if (!this.get('errorFirstname') &&
        !this.get('errorLastname') &&
        !this.get('errorEmail') &&
        !this.get('errorEmail2') &&
        !this.get('errorCompany') &&
        !this.get('errorGroup') &&
        !this.get('errorPassword') &&
        !this.get('errorPasswordConfirmation') &&
        !this.get('errorPassword2')) {
      return true;
    }
    return false;
  }
});
