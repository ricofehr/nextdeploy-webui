import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  // qota power-select values
  quotavmlist: ['0','1','2','3','4','5','6','7','8','9','10','15','20','30','50','100'],
  // field is_project_create is read-only ?
  is_project_create_ro: true,

  // sort group
  computeSorting: ['name'],
  groupSort: Ember.computed.sort('groups', 'computeSorting'),

  // validation variables
  errorCompany: false,
  errorEmail: false,
  errorEmail2: false,

  errorPassword: false,
  successPassword: false,

  errorPasswordConfirmation: false,
  successPasswordConfirmation: false,

  errorPassword2: false,
  successPassword2: false,

  errorGroup: false,
  successGroup: false,

  // project sorting
  projectSorting: ['name'],
  projectSort: Ember.computed.sort('projects', 'projectSorting'),

  // trigger function when model changes
  didReceiveAttrs() {
    this._super(...arguments);
    this.cleanModel();
    this.initBuffer();
    this.initModel();
  },

  // delete records unsaved
  cleanModel: function() {
    var cleanProjects = this.store.peekAll('project').filterBy('id', null);

    cleanProjects.forEach(function (clean) {
      if (clean) { clean.deleteRecord(); }
    });
  },

  // use a buffer for array attributes for avoid weird issue with power-select
  initBuffer: function() {
    this.set('user_projects', this.get('user').get('projects').toArray());
  },

  // use a buffer for array attributes for avoid weird issue with power-select
  flushBuffer: function() {
    this.get('user').set('projects', this.get('user_projects'));
  },

  // post-model-load action
  initModel: function() {
    // fix weird issue for permit select 0 into power-select
    this.get('user').set('quotavm', '' + this.get('user').get('quotavm'));

    this.formIsValid();
    this.checkProjectCreate();
  },

  // ensure email attribute is not empty
  checkEmail: function() {
    var email = this.get('user.email');
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var errorEmail = false;

    if (!re.test(email)) {
      errorEmail = true;
    }

    this.set('errorEmail', errorEmail);
  }.observes('user.email'),

  // ensure email attribute is uniq
  checkEmail2: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var users = this.get('users');
    var email = this.get('user.email');
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var errorEmail = false;
    var errorEmail2 = false;
    var current_id = this.get('user.id');
    var self = this;

    // set id to 0 if we create a new user
    if (current_id == null) { current_id = 0; }

    if (!re.test(email)) {
      errorEmail = true;
      self.set('errorEmail2', errorEmail2);
    }
    else {
      if (access_level === 50) {
        if (!users || users.length === 0) { return; }

        users.forEach(function (item) {
          if (item.id !== current_id) {
            if (item.get('user.email') === email) {
              errorEmail2 = true;
            }
          }
        });
        self.set('errorEmail2', errorEmail2);
      } else {
        Ember.$.ajax({
          url: config.APP.APIHost + "/api/v1/users/" + current_id + "/email/" + email,
          global: false,
          headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') },
        })
        .done(function() {
          self.set('errorEmail2', false);
        })
        .fail(function() {
          self.set('errorEmail2', true);
        });
      }
    }

    this.set('errorEmail', errorEmail);
  }.observes('user.email'),

  // ensure firstname attribute is not empty
  checkFirstname: function() {
    var firstname = this.get('user.firstname');
    var errorFirstname = false;

    if (!firstname) {
      errorFirstname = true;
    }

    this.set('errorFirstname', errorFirstname);
  }.observes('user.firstname'),

  // ensure lastname attribute is not empty
  checkLastname: function() {
    var lastname = this.get('user.lastname');
    var errorLastname = false;

    if (!lastname) {
      errorLastname = true;
    }

    this.set('errorLastname', errorLastname);
  }.observes('user.lastname'),

  // ensure company attribute is not empty
  checkCompany: function() {
    var company = this.get('user.company');
    var errorCompany = false;

    if (!company) {
      errorCompany = true;
    }

    this.set('errorCompany', errorCompany);
  }.observes('user.company'),

  // ensure group attribute is not empty
  checkGroup: function() {
    var group = this.get('user.group.id');
    var errorGroup = false;

    if (!group) {
      errorGroup = true;
    }

    this.set('errorGroup', errorGroup);
  }.observes('user.group'),

  // check if projectcreate attribute can be shown
  checkProjectCreate: function() {
    var access_level_user = null;
    var access_level_current = this.get('session').get('data.authenticated.access_level');

    // default is never creat project
    this.set('is_project_create_ro', true);
    this.set('is_project_create_display', false);

    if (!this.get('user.group') || !this.get('user.group.id')) { return; }

    access_level_user = this.get('user.group').get('access_level');

    // an admin can always create project
    if (access_level_user >= 50) {
      this.set('user.is_project_create', true);
    }

    if (access_level_user < 40) {
      this.set('user.is_project_create', false);
    } else {
      this.set('is_project_create_display', true);
    }

    // Only ProjectLead can have project-creation right
    if (access_level_current >= 50 && access_level_user < 50 && access_level_user >= 40) {
      this.set('is_project_create_ro', false);
    }

  }.observes('user.group'),

  // ensure password attribute is not empty and follows password constraints
  checkPassword: function() {
    var password = this.get('user.password');
    var errorPassword = false;
    var successPassword = true;

    if (password && password.length < 8) {
      errorPassword = true;
      successPassword = false;
    }

    if (!password || password.length === 0) {
      errorPassword = true;
      if (this.get('user.id')) {
        errorPassword = false;
      }
      successPassword = false;
      this.set('user.is_credentials_send', false);
    }

    this.set('errorPassword', errorPassword);
    this.set('successPassword', successPassword);
  }.observes('user.password'),

  // ensure password_confirmation attribute is not empty and follows password constraints
  checkPasswordConfirmation: function() {
    var passwordConfirmation = this.get('user.password_confirmation');
    var errorPasswordConfirmation = false;
    var successPasswordConfirmation = true;

    if (passwordConfirmation && passwordConfirmation.length < 8) {
      errorPasswordConfirmation = true;
      successPasswordConfirmation = false;
    }

    if (!passwordConfirmation || passwordConfirmation.length === 0) {
      errorPasswordConfirmation = true;
      if (this.get('user.id')) {
        errorPasswordConfirmation = false;
      }
      successPasswordConfirmation = false;
    }

    this.set('errorPasswordConfirmation', errorPasswordConfirmation);
    this.set('successPasswordConfirmation', successPasswordConfirmation);
  }.observes('user.password_confirmation'),

  // ensure that password and password_confirmation are equals
  checkSamePassword: function() {
    var password = this.get('user.password');
    var password2 = this.get('user.password_confirmation');
    var errorPassword2 = false;
    var successPassword2 = true;

    if (password !== password2) {
      errorPassword2 = true;
      successPassword2 = false;
    }

    this.set('errorPassword2', errorPassword2);
    this.set('successPassword2', successPassword2);
  }.observes('user.password', 'user.password_confirmation'),

  //check form before submit
  formIsValid: function() {
    this.checkFirstname();
    this.checkLastname();
    this.checkEmail();
    this.checkEmail2();
    this.checkCompany();
    this.checkGroup();
    this.checkPassword();
    this.checkPasswordConfirmation();
    this.checkSamePassword();

    if (!this.get('errorFirstname') &&
        !this.get('errorLastname') &&
        !this.get('errorEmail') &&
        !this.get('errorEmail2') &&
        !this.get('errorCompany') &&
        !this.get('errorGroup') &&
        !this.get('errorPassword') &&
        !this.get('errorPasswordConfirmation') &&
        !this.get('errorPassword2')) { return true; }
    return false;
  },

  // Check if current user is lead and can change properties
  isDisableLead: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 40) { return false; }
    return true;
  }.property('user.id'),

  // Check if current user is admin and can change properties
  isDisableAdmin: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (parseInt(access_level) >= 50) { return false; }
    return true;
  }.property('user.id'),

  // check if we disable project list
  isDisableProjectList: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var group_access = 0;

    if (this.get('user.group') && this.get('user.group').get('access_level')) {
      group_access = this.get('user.group').get('access_level');
    }

    if (access_level < 50 || group_access === 50) {
      if (group_access === 50) {
        this.set('user_projects', this.get('projects').toArray());
      }
      return true;
    }
    return false;
  }.property('user.id', 'user.group'),

  // Check if current user is same as current form / or admin and can change properties
  isDisable: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var current_id = this.get('session').get('data.authenticated.user.id');
    var form_id = parseInt(this.get('user.id'));

    if (access_level >= 50) { return false; }
    if (current_id === form_id) { return false; }
    return true;
  }.property('user.id'),

  // Check if current user is admin
  isLead: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 40) { return true; }
    return false;
  }.property('session.data.authenticated.user.id'),

  // show only if current user is same as current form / or admin
  isEnable: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var current_id = this.get('session').get('data.authenticated.user.id');
    var form_id = parseInt(this.get('user.id'));

    if (access_level >= 50) { return true; }
    if (current_id === form_id) { return true; }
    return false;
  }.property('user.id'),

  // show only if form user is allowed by ssh key
  isSSH: function() {
    var access_level_user;
    var access_level = this.get('session').get('data.authenticated.access_level');
    var current_id = this.get('session').get('data.authenticated.user.id');
    var user_id = this.get('user.id');

    if (user_id == null || !user_id) { return false; }

    access_level_user = this.get('user.group').get('access_level');
    if (access_level_user < 30) { return false; }

    if (access_level >= 50) { return true; }
    if (current_id === parseInt(user_id)) { return true; }
    return false;
  }.property('user.id'),

  // return trie if current id is equal to authenticated user
  isSelf: function() {
    var current_id = this.get('session').get('data.authenticated.user.id');
    var user_id = this.get('user.id');

    if (parseInt(user_id) === current_id) { return true; }
    return false;
  }.property('user.id'),

  // actions binding with user event
  actions: {
    changeProperty: function(property, value) {
      this.set(property, value);
    },

    // get openvpn server ca
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

    // get openvpn client key
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

    // get openvpn client crt
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

    // get openvpn setting file
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

    // Create a new user or update an existing one
    postItem: function() {
      var router = this.get('router');
      var user = this.get('user');

      // rdirect to users list if success
      var pass = function(){
        router.transitionTo('users.list');
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
  }
});
