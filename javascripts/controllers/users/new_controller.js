var UsersNewController = Ember.ObjectController.extend({
  quotavmlist: [0,1,2,3,4,5,6,7,8,9,10,15,20,30,50,100],
  password: null,
  password_confirmation: null,
  is_project_create_ro: true,

  // sort group
  computeSorting: ['name'],
  groupSort: Ember.computed.sort('grouplist', 'computeSorting'),

  //validation variables
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

  //project checkboxes array
  projectSorting: ['name'],
  projectSort: Ember.computed.sort('projectlist', 'projectSorting'),

  listProjects: function() {
    var model = this.get('model');
    var access_level = App.AuthManager.get('apiKey.accessLevel');
    var self = this;

    this.set('checkedProjects', this.get('projectSort').map(function(model) {
      var checked = false;
      var readonly = false;
      var projects = self.get('user_projects');
      var group_access = 0;
      var project = null;

      if (self.get('group.content.access_level')) group_access = self.get('group.content.access_level');
      if (access_level < 50 || group_access == 50) readonly = true;

      if(projects) {
        project = projects.findBy('id', model.id);
        if(project) checked = true;
      }

      if (group_access == 50) checked = true;

      return Ember.ObjectProxy.create({
        content: model,
        checked: checked,
        readonly: readonly
      });
    }));
  }.observes('group.content'),

  //validation function
  checkEmail: function() {
    var email = this.get('email');
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var errorEmail = false;

    if (!re.test(email)) {
      errorEmail = true;
    }

    this.set('errorEmail', errorEmail);
  }.observes('email'),

  // check projectname
  checkEmail2: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');
    var users = this.get('users');
    var email = this.get('email');
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var errorEmail = false;
    var errorEmail2 = false;
    var current_id = this.get('id');
    var self = this;

    // set id to 0 if we create a new user
    if (current_id == null) { current_id = 0 }

    if (!re.test(email)) {
      errorEmail = true;
      self.set('errorEmail2', errorEmail2);
    }
    else {
      if (access_level == 50) {
        if (!users || users.length == 0) return;

        users.forEach(function (item) {
          if (item.id != current_id) {
            if (item.get('email') == email) {
              errorEmail2 = true;
            }
          }
        });
        self.set('errorEmail2', errorEmail2);
      } else {
        $.ajax({
          url: "/api/v1/users/" + current_id + "/email/" + email,
          global: false
        })
        .done(function(data) {
          self.set('errorEmail2', false);
        })
        .fail(function(data) {
          self.set('errorEmail2', true);
        })
      }
    }

    this.set('errorEmail', errorEmail);
  }.observes('email'),

  checkFirstname: function() {
    var firstname = this.get('firstname');
    var errorFirstname = false;

    if (!firstname) {
      errorFirstname = true;
    }

    this.set('errorFirstname', errorFirstname);
  }.observes('firstname'),

  checkLastname: function() {
    var lastname = this.get('lastname');
    var errorLastname = false;

    if (!lastname) {
      errorLastname = true;
    }

    this.set('errorLastname', errorLastname);
  }.observes('lastname'),

  checkCompany: function() {
    var company = this.get('company');
    var errorCompany = false;

    if (!company) {
      errorCompany = true;
    }

    this.set('errorCompany', errorCompany);
  }.observes('company'),

  checkGroup: function() {
    var group = this.get('group.content');
    var errorGroup = false;

    if (!group) {
      errorGroup = true;
    }

    this.set('errorGroup', errorGroup);
  }.observes('group.content'),

  checkProjectCreate: function() {
    var access_level_user = this.get('group.content.access_level');
    var access_level_current = App.AuthManager.get('apiKey.accessLevel');

    // default is never creat project
    this.set('is_project_create_ro', true);
    this.set('is_project_create_display', false);
    // an admin can always create project
    if (access_level_user >= 50) {
      this.set('is_project_create', true);
    }

    if (access_level_user < 40) {
      this.set('is_project_create', false);
    } else {
      this.set('is_project_create_display', true);
    }

    // Only ProjectLead can have project-creation right
    if (access_level_current >= 50 && access_level_user < 50 && access_level_user >= 40) {
      this.set('is_project_create_ro', false);
    }
  }.observes('group.content'),

  checkPassword: function() {
    var password = this.get('password');
    var errorPassword = false;
    var successPassword = true;

    if (password && password.length < 8) {
      errorPassword = true;
      successPassword = false;
    }

    if (!password || password.length == 0) {
      errorPassword = false;
      successPassword = false;
    }

    this.set('errorPassword', errorPassword);
    this.set('successPassword', successPassword);
  }.observes('password'),

  checkPasswordConfirmation: function() {
    var passwordConfirmation = this.get('password_confirmation');
    var errorPasswordConfirmation = false;
    var successPasswordConfirmation = true;

    if (passwordConfirmation && passwordConfirmation.length < 8) {
      errorPasswordConfirmation = true;
      successPasswordConfirmation = false;
    }

    if (!passwordConfirmation || passwordConfirmation.length == 0) {
      errorPasswordConfirmation = false;
      successPasswordConfirmation = false;
    }

    this.set('errorPasswordConfirmation', errorPasswordConfirmation);
    this.set('successPasswordConfirmation', successPasswordConfirmation);
  }.observes('password_confirmation'),

  checkSamePassword: function() {
    var password = this.get('password');
    var password2 = this.get('password_confirmation');
    var errorPassword2 = false;
    var successPassword2 = true;

    if (password != password2) {
      errorPassword2 = true;
      successPassword2 = false;
    }

    this.set('errorPassword2', errorPassword2);
    this.set('successPassword2', successPassword2);
  }.observes('password', 'password_confirmation'),


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
        !this.get('errorPassword2')) return true;
    return false;
  },

  //clear form
  clearForm: function() {
    this.set('email', null);
    this.set('firstname', null);
    this.set('lastname', null);
    this.set('company', null);
    this.set('quotavm', null);
    this.set('password', null);
    this.set('password_confirmation', null);
    this.set('group', {content: null});
    this.set('is_project_create', false);
    this.set('is_project_create_ro', true);
  },

  // Check if current user is lead and can change properties
  isDisableLead: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');

    if (access_level >= 40) return false;
    return true;
  }.property('id'),

  // Check if current user is admin and can change properties
  isDisableAdmin: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');

    if (access_level >= 50) return false;
    return true;
  }.property('id'),

  // Check if current user is same as current form / or admin and can change properties
  isDisable: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');
    var current_id = App.AuthManager.get('apiKey.user');
    var form_id = this.get('id');

    if (access_level >= 50) return false;
    if (current_id == form_id) return false;
    return true;
  }.property('id'),

  // Check if current user is admin
  isLead: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');

    if (access_level >= 40) return true;
    return false;
  }.property('App.AuthManager.apiKey'),

  // show only if current user is same as current form / or admin
  isEnable: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');
    var current_id = App.AuthManager.get('apiKey.user');
    var form_id = this.get('id');

    if (access_level >= 50) return true;
    if (current_id == form_id) return true;
    return false;
  }.property('id'),

  // show only if form user is allowed by ssh key
  isSSH: function() {
    var access_level_user;
    var access_level = App.AuthManager.get('apiKey.accessLevel');
    var current_id = App.AuthManager.get('apiKey.user');
    var user_id = this.get('id');

    if (user_id == null || !user_id) return false;

    access_level_user = this.get('group').get('content.access_level');
    if (access_level_user < 30) return false;

    if (access_level >= 50) return true;
    if (current_id == user_id) return true;
    return false;
  }.property('id'),

  // return trie if current id is equal to authenticated user
  isSelf: function() {
    var current_id = App.AuthManager.get('apiKey.user');
    var user_id = this.get('id');

    if (user_id == current_id) return true;
    return false
  }.property('id'),

  // actions binding with user event
  actions: {
    // get openvpn server ca
    dlOvpnCa: function() {
      var self = this;

      $.ajax({
        url: '/api/v1/user/ovpnca',
        type: "GET",
        headers: { 'Authorization': 'Token token=' + $.cookie('access_token') },
        /**
         * A function to be called if the request fails.
         */
        error: function(jqXHR, textStatus, errorThrown) {
          if (jqXHR.status == 401) self.set('error401', true);
          else self.set('error500', true);
        },

        success: function(results, textStatus, jqXHR) {
           self.set('ovpn_ca', results);
        }
      });
    },

    // get openvpn client key
    dlOvpnKey: function() {
      var self = this;

      $.ajax({
        url: '/api/v1/user/ovpnkey',
        type: "GET",
        headers: { 'Authorization': 'Token token=' + $.cookie('access_token') },
        /**
         * A function to be called if the request fails.
         */
        error: function(jqXHR, textStatus, errorThrown) {
          if (jqXHR.status == 401) self.set('error401', true);
          else self.set('error500', true);
        },

        success: function(results, textStatus, jqXHR) {
           self.set('ovpn_key', results);
        }
      });
    },

    // get openvpn client crt
    dlOvpnCrt: function() {
      var self = this;

      $.ajax({
        url: '/api/v1/user/ovpncrt',
        type: "GET",
        headers: { 'Authorization': 'Token token=' + $.cookie('access_token') },
        /**
         * A function to be called if the request fails.
         */
        error: function(jqXHR, textStatus, errorThrown) {
          if (jqXHR.status == 401) self.set('error401', true);
          else self.set('error500', true);
        },

        success: function(results, textStatus, jqXHR) {
           self.set('ovpn_crt', results);
        }
      });
    },

    // get openvpn setting file
    dlOvpnConf: function() {
      var self = this;

      $.ajax({
        url: '/api/v1/user/ovpnconf',
        type: "GET",
        headers: { 'Authorization': 'Token token=' + $.cookie('access_token') },
        /**
         * A function to be called if the request fails.
         */
        error: function(jqXHR, textStatus, errorThrown) {
          if (jqXHR.status == 401) self.set('error401', true);
          else self.set('error500', true);
        },

        success: function(results, textStatus, jqXHR) {
           self.set('ovpn_conf', results);
        }
      });
    },

    postItem: function() {
      var router = this.get('target');
      var data = this.getProperties('id', 'email', 'firstname', 'lastname', 'company', 'password', 'password_confirmation', 'quotavm', 'is_project_create');
      var store = this.store;
      var selectedGroup = this.get('group.content');
      var projects = this.get('checkedProjects').filterBy('checked', true).mapBy('content');
      var user;

      // get group selected
      data['group'] = selectedGroup;

      // check if form is valid
      if (!this.formIsValid()) {
        return
      }

      //if id is present, so update item, else create new one
      if(data['id']) {
        store.find('user', data['id']).then(function (user) {
          var projects_p = user.get('projects').toArray();

          // reset old values from object
          projects_p.forEach(function (item) {
            user.get('projects').removeObject(item);
            item.get('users').removeObject(user);
          });

          // add projects association
          projects.toArray().forEach(function (item) {
            item.get('users').addObject(user);
            user.get('projects').pushObject(item);
          });

          user.get('group').get('users').removeObject(user);
          user.setProperties(data);

          selectedGroup.get('users').pushObject(user);
          user.save().then(function() {
            // Return to users list page
            router.transitionTo('users.list');
          });
        });
      } else {
        user = store.createRecord('user', data);

        // add projects association
        projects.toArray().forEach(function (item) {
          item.get('users').addObject(user);
          user.get('projects').pushObject(item);
        });

        selectedGroup.get('users').pushObject(user);
        user.save().then(function() {
          // Return to users list page
          router.transitionTo('users.list');
        });
      }
    }
  }
});

module.exports = UsersNewController;

