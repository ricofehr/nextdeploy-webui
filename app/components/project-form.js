import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  // sort properties
  computeSorting: ['name'],
  vmsizeSorting: ['title:desc'],
  emailSorting: ['email'],

  // sort each listing items
  brandsSort: Ember.computed.sort('brands', 'computeSorting'),
  frameworksSort: Ember.computed.sort('frameworks', 'computeSorting'),
  vmsizesSort: Ember.computed.sort('vmsizes', 'vmsizeSorting'),
  technosSort: Ember.computed.sort('technos', 'computeSorting'),
  systemsSort: Ember.computed.sort('systems', 'computeSorting'),
  usersSort: Ember.computed.sort('users', 'emailSorting'),

  // validation variables
  errorBrand: false,
  errorName: false,
  errorName2: false,
  errorLogin: false,
  errorPassword: false,
  errorFramework: false,
  errorSystem: false,
  errorTechnos: false,
  errorVmsizes: false,
  errorUsers: false,

  // trigger function when model changes
  didReceiveAttrs() {
    this._super(...arguments);
    this.cleanModel();
    this.initBuffer();
    this.formIsValid();
  },

  // delete records unsaved
  cleanModel: function() {
    var cleanUsers = this.store.peekAll('user').filterBy('id', null);
    var cleanBrands = this.store.peekAll('brand').filterBy('id', null);
    var self = this;

    cleanUsers.forEach(function (clean) {
      if (clean) { clean.deleteRecord(); }
    });

    cleanBrands.forEach(function (clean) {
      if (clean) { clean.deleteRecord(); }
    });

    cleanUsers = this.store.peekAll('user').filterBy('isDeleted', true);
    cleanBrands = this.get('brands').filterBy('isDeleted', true);

    cleanUsers.forEach(function (clean) {
      if (clean) { self.get('users').removeObject(clean); }
    });

    cleanBrands.forEach(function (clean) {
      if (clean) { self.store.peekAll('brand').removeObject(clean); }
    });
  },

  // use a buffer for array attributes for avoid weird issue with power-select
  initBuffer: function() {
    this.set('project_technos', this.get('project').get('technos').toArray());
    this.set('project_users', this.get('project').get('users').toArray());
    this.set('project_vmsizes', this.get('project').get('vmsizes').toArray());
    this.set('project_systemimages', this.get('project').get('systemimages').toArray());
  },

  // use a buffer for array attributes for avoid weird issue with power-select
  flushBuffer: function() {
    this.get('project').set('technos', this.get('project_technos'));
    this.get('project').set('users', this.get('project_users'));
    this.get('project').set('vmsizes', this.get('project_vmsizes'));
    this.get('project').set('systemimages', this.get('project_systemimages'));
  },

  // ensure brand attribute is not empty
  checkBrand: function() {
    var brand = this.get('project.brand.id');
    var errorBrand = false;

    if (!brand) {
      errorBrand = true;
    }

    this.set('errorBrand', errorBrand);
  }.observes('project.brand'),

  // ensure name attribute is not empty
  checkName: function() {
    var name = this.get('project.name');
    var errorName = false;

    if (!name) {
      errorName = true;
    } else {
      this.set('project.name', this.get('project.name').replace(/-/g,'.'));
    }

    this.set('errorName', errorName);
  }.observes('project.name'),

  // ensure that projectname is uniq
  checkName2: function() {
    var projects = this.get('projects');
    var name = this.get('project.name');
    var current_id = this.get('project.id');
    var self = this;
    var errorName2 = false;

    // if projectname < 6, return
    if (!name || name.length < 6) {
      self.set('errorName2', false);
      self.set('errorName3', true);
      return;
    }
    self.set('errorName3', false);

    // set id to 0 if we create a new project
    if (current_id === null || isNaN(current_id)) { current_id = 0; }

    if (!projects || projects.length === 0) {
      Ember.$.ajax({
          url: config.APP.APIHost + "/api/v1/projects/" + current_id + "/name/" + name,
          global: false,
          headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
        })
        .done(function() {
          self.set('errorName2', false);
        })
        .fail(function() {
          self.set('errorName2', true);
        });
    } else {
      projects.forEach(function (item) {
        if (item.id && item.id !== current_id) {
          if (item.get('name') === name) {
            errorName2 = true;
          }
        }
      });
      self.set('errorName2', errorName2);
    }
  }.observes('project.name'),

  // ensure login attribute is not empty
  checkLogin: function() {
    var login = this.get('project.login');
    var errorLogin = false;

    if (!login) {
      errorLogin = true;
    }

    this.set('errorLogin', errorLogin);
  }.observes('project.login'),

  // ensure password attribute is not empty
  checkPassword: function() {
    var password = this.get('project.password');
    var errorPassword = false;

    if (!password) {
      errorPassword = true;
    }

    this.set('errorPassword', errorPassword);
  }.observes('project.password'),

  // ensure framework attribute is not empty
  checkFramework: function() {
    var framework = this.get('project.framework.id');
    var errorFramework = false;

    if (!framework) {
      errorFramework = true;
    }

    this.set('errorFramework', errorFramework);
  }.observes('project.framework'),

  // ensure systemimages attribute is not empty
  checkSystem: function() {
    var errorSystem = true;
    var systems = this.get('project_systemimages');

    if (systems && systems.toArray().length > 0) { errorSystem = false; }

    this.set('errorSystem', errorSystem);
  }.observes('project_systemimages'),

  // ensure technos attribute is not empty
  checkTechnos: function() {
    var technos = null;
    var errorTechnos = true;

    technos = this.get('project_technos');
    if (technos && technos.toArray().length > 0) { errorTechnos = false; }
    this.set('errorTechnos', errorTechnos);

  }.observes('project_technos'),

  // on form submit, ensure that varnish (mandatory techno) is on techno list
  checkVarnishTechnos: function() {
    var varnishTechno = null;
    var varnishOk = false;

    this.get('technos').forEach(function (techno) {
      if (/.*varnish.*/.test(techno.get('name'))) {
        varnishTechno = techno;
      }
    });

    this.get('project_technos').forEach(function (techno) {
      if (/.*varnish.*/.test(techno.get('name'))) {
        varnishOk = true;
      }
    });

    if (!varnishOk && varnishTechno) {
      this.get('project_technos').pushObject(varnishTechno);
    }
  },

  // ensure vmsizes attribute is not empty
  checkVmsizes: function() {
    var errorVmsizes = true;
    var vmsizes = this.get('project_vmsizes');
    if (vmsizes && vmsizes.toArray().length > 0) { errorVmsizes = false; }

    this.set('errorVmsizes', errorVmsizes);
  }.observes('project_vmsizes'),

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

  // ensure users attribute is not empty
  checkUsers: function() {
    var errorUsers = true;
    var users = null;

    users = this.get('project_users');
    if (users && users.toArray().length > 0) { errorUsers = false; }

    this.set('errorUsers', errorUsers);
  }.observes('project_users'),

  //check form before submit
  formIsValid: function() {
    this.checkAdminUsers();
    this.checkVarnishTechnos();
    this.checkBrand();
    this.checkName();
    this.checkLogin();
    this.checkPassword();
    this.checkFramework();
    this.checkSystem();
    this.checkTechnos();
    this.checkVmsizes();
    this.checkUsers();

    if (!this.get('errorBrand') &&
        !this.get('errorName') &&
        !this.get('errorName2') &&
        !this.get('errorName3') &&
        !this.get('errorLogin') &&
        !this.get('errorPassword') &&
        !this.get('errorFramework') &&
        !this.get('errorSystem') &&
        !this.get('errorTechnos') &&
        !this.get('errorVmsizes') &&
        !this.get('errorUsers')) { return true; }
    return false;
  },

  //events when projectname or brand changes
  updateGitpath: function() {
    var gitpath;

    if (!this.get('project.brand') || !this.get('project.name')) { return; }
    gitpath = this.get('project.brand').get('name').replace(/[\. ]/g,'') + "-" + this.get('project.name').replace(/[\. ]/g,'-');
    this.set('project.gitpath', gitpath.toLowerCase());

  }.observes('project.brand', 'project.name'),

  // Check if current user can create project
  isProjectCreate: function() {
    return this.get('session').get('data.authenticated.user.is_project_create');
  }.property('session.data.authenticated.user.id'),

  // Disable if edit item
  isDisableEdit: function() {

    if (this.get('project.id')) { return true; }
    else { return false; }

  }.property('project.id'),

  // Check if current user is admin and can change properties
  isDisableAdmin: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 50) { return false; }
    return true;

  }.property('session.data.authenticated.user.id'),

  // Disable if edit item
  isDisableEditAdmin: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level < 50) { return true; }
    if (this.get('project.id')) { return true; }
    return false;

  }.property('project.id', 'session.data.authenticated.user.id'),

  // Check if current user is admin or edit his own project and can change properties
  isDisableCreate: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var user_id = this.get('session').get('data.authenticated.user.id');

    if (access_level >= 50) { return false; }
    if (parseInt(this.get('project.owner.id')) === user_id) { return false; }
    return true;

  }.property('session.data.authenticated.user.id'),

  // actions binding with user event
  actions: {
    changeProperty: function(property, value) {
      this.set(property, value);
    },

    // Action when submit form for create or update project current object
    postItem: function() {
      var router = this.get('router');

      // check if form is valid
      if (!this.formIsValid()) {
        return;
      }

      // set model properties from temporary buffer
      this.flushBuffer();

      // redirect on project list if success
      var pass = function(){
        router.transitionTo('projects.list');
      };

      // redirect on error page if error occurs
      var fail = function(){
        router.transitionTo('error');
      };

      // loading modal and request server
      router.transitionTo('loading');
      Ember.Logger.debug(this.get('project'));
      this.get('project').save().then(pass, fail);
    }
  }
});