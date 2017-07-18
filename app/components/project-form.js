import Ember from 'ember';
import config from '../config/environment';

/**
 *  This component manages the project form
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class ProjectForm
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  /**
   *  Sort property for brands / technos / systems / frameworks list
   *
   *  @attribute computeSorting
   *  @type {String[]}
   */
  computeSorting: ['name'],

  /**
   *  Sort property for vmsizes list
   *
   *  @attribute vmsizeSorting
   *  @type {String[]}
   */
  vmsizeSorting: ['title:desc'],

  /**
   *  Sort property for users list
   *
   *  @attribute emailSorting
   *  @type {String[]}
   */
  emailSorting: ['email'],

  /**
   *  Array of frameworks sorted
   *
   *  @attribute frameworksSort
   *  @type {Framework[]}
   */
  frameworksSort: Ember.computed.sort('frameworks', 'computeSorting'),

  /**
   *  Array of brands sorted
   *
   *  @attribute brandsSort
   *  @type {Brand[]}
   */
  brandsSort: Ember.computed.sort('brands', 'computeSorting'),

  /**
   *  Array of vmsizes sorted
   *
   *  @attribute vmsizesSort
   *  @type {Vmsize[]}
   */
  vmsizesSort: Ember.computed.sort('vmsizes', 'vmsizeSorting'),

  /**
   *  Array of technos sorted
   *
   *  @attribute technosSort
   *  @type {Techno[]}
   */
  technosSort: Ember.computed.sort('technos', 'computeSorting'),

  /**
   *  Array of systems sorted
   *
   *  @attribute systemsSort
   *  @type {Systemimage[]}
   */
  systemsSort: Ember.computed.sort('systems', 'computeSorting'),

  /**
   *  Array of users sorted
   *
   *  @attribute usersSort
   *  @type {User[]}
   */
  usersSort: Ember.computed.sort('users', 'emailSorting'),

  actions: {
    /**
     *  Change the "new endpoint" flag
     *
     *  @event toggleNewFlag
     */
    toggleNewFlag: function() {
      if (this.get('newFlag')) {
        this.set('newFlag', false);
      } else {
        this.set('newFlag', true);
      }
    },

    /**
     *  Show a technos list after toggled a technotype
     *
     *  @event displayTechno
     *  @param {Boolean} toggle true if the technotype toggle is setted
     */
    displayTechno: function(toggle) {
      var selected = null;
      var self = this;
      var isToggled = toggle.newValue;
      var technoTypeId = toggle.context.name;

      self.get('project_technotypes').map(function (model) {
        if (parseInt(model.get('technotype').id) === parseInt(technoTypeId)) {
          if (isToggled) {
            selected = model.get('selected');
            if (selected === null) {
              selected = model.get('technotype').get('technos').toArray()[0];
            }
          }
          model.set('selected', selected);
          model.set('toggled', isToggled);
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
      var self = this;
      var nbEndpoints = parseInt(this.get('project.endpoints.length'));
      var readytoList = 0;

      this.checkAdminUsers();
      this.checkVarnishAndWebTechnos();
      this.checkNodeTechnos();

      // check if form is valid
      if (!this.get('isFormValid')) {
        return;
      }

      // set model properties from temporary buffer
      this.flushTechnosList();

      // return to projects list after adding a new one
      var projectslist = function() {
        readytoList = readytoList + 1;
        if (readytoList === nbEndpoints) {
          router.transitionTo('projects.list');
        }
      };

      // redirect on project list if success
      var pass = function(project){
        var endpoints = project.get('endpoints');

        endpoints.forEach(function(ep) {
          ep.save().then(projectslist);
        });
      };

      // redirect on error page if error occurs
      var fail = function(){
        router.transitionTo('error');
      };

      // trigger submit endpoint
      this.set('projectSave', true);

      // loading modal and request server
      Ember.run.later(function() {
        router.transitionTo('loading');
        self.get('project').save().then(pass, fail);
      }, 300);
    }
  },

  /**
   *  Project Saving action flag
   *
   *  @property projectSave
   *  @type {Boolean}
   */
  projectSave: false,

  /**
   *  New Endpoint flag
   *
   *  @property newFlag
   *  @type {Boolean}
   */
  newFlag: false,

  /**
   *  Ensure brand is filled
   *
   *  @function errorBrand
   *  @returns {Boolean} true if no valid field
   */
  errorBrand: function() {
    var brand = this.get('project.brand.id');
    var errorBrand = false;

    if (!brand) {
      errorBrand = true;
    }

    return errorBrand;
  }.property('project.brand'),

  /**
   *  Ensure name is filled and normalize it
   *
   *  @function errorName
   *  @returns {Boolean} true if no valid field
   */
  errorName: function() {
    var name = this.get('project.name');
    var errorName = true;
    var self = this;

    if (name) {
      errorName = false;

      // normalize
      name = name.toLowerCase();
      name = name.replace(/^[0-9]/g, '');
      name = name.replace(/-/g, '.');
      name = name.replace(/[^a-z0-9\.]/g, '');

      if (this.get('project.name') !== name) {
          Ember.run.once(function() {
            self.set('project.name', name);
          });
      }
    }

    return errorName;
  }.property('project.name'),

  /**
   *  Ensure the name attribute is unique
   *
   *  @function errorNameUnique
   *  @returns {Boolean} true if no valid field
   */
  errorNameUnique: function() {
    var projects = this.get('projects');
    var name = this.get('project.name');
    var currentId = this.get('project.id');
    var errorName = false;

    // set id to 0 if we create a new project
    if (currentId === null || isNaN(currentId)) {
      currentId = 0;
    }

    if (!projects || projects.length === 0) {
      Ember.$.ajax({
          url: config.APP.APIHost + "/api/v1/projects/" + currentId + "/name/" + name,
          global: false,
          headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
        })
        .done(function() {
          errorName = false;
        })
        .fail(function() {
          errorName = true;
        });
    } else {
      projects.forEach(function(item) {
        if (item.id && item.id !== currentId) {
          if (item.get('name') === name) {
            errorName = true;
          }
        }
      });

      return errorName;
    }
  }.property('project.name'),

  /**
   *  Ensure the name attribute has good length
   *
   *  @function errorNameLength
   *  @returns {Boolean} true if no valid field
   */
  errorNameLength: function() {
    var name = this.get('project.name');

    if (!name || name.length < 6) {
      return true;
    }

    return false;
  }.property('project.name'),

  /**
   *  Ensure login is filled
   *
   *  @function errorLogin
   *  @returns {Boolean} true if no valid field
   */
  errorLogin: function() {
    var login = this.get('project.login');

    if (!login) {
      return true;
    }

    return false;
  }.property('project.login'),

  /**
   *  Ensure password is filled
   *
   *  @function errorPassword
   *  @returns {Boolean} true if no valid field
   */
  errorPassword: function() {
    var password = this.get('project.password');

    if (!password) {
      return true;
    }

    return false;
  }.property('project.password'),

  /**
   *  Ensure endpoints array is not empty
   *
   *  @function errorEndpoints
   *  @returns {Boolean} true if no valid field
   */
  errorEndpoints: function() {
    var endpoints = this.get('project.endpoints');
    var errorEndpoints = true;

    if (endpoints && endpoints.toArray().length > 0) {
      errorEndpoints = false;
    }

    if (errorEndpoints) {
      this.set('newFlag', true);
    }

    return errorEndpoints;
  }.property('project.endpoints.@each'),

  /**
   *  Ensure systems array is not empty
   *
   *  @function errorSystem
   *  @returns {Boolean} true if no valid field
   */
  errorSystem: function() {
    var systems = this.get('project.systemimages');

    if (systems && systems.toArray().length > 0) {
      return false;
    }

    return true;
  }.property('project.systemimages.@each'),

  /**
   *  Ensure technos array is not empty
   *
   *  @function errorTechnos
   *  @returns {Boolean} true if no valid field
   */
  errorTechnos: function() {
    var technos = this.get('project.technos');

    if (technos && technos.toArray().length > 0) {
      return false;
    }

    return true;
  }.property('project.technos.@each'),

  /**
   *  Ensure vmsizes array is not empty
   *
   *  @function errorVmsizes
   *  @returns {Boolean} true if no valid field
   */
  errorVmsizes: function() {
    var vmsizes = this.get('project.vmsizes');

    if (vmsizes && vmsizes.toArray().length > 0) {
      return false;
    }

    return true;
  }.property('project.vmsizes.@each'),

  /**
   *  Ensure users array is not empty
   *
   *  @function errorUsers
   *  @returns {Boolean} true if no valid field
   */
  errorUsers: function() {
    var users = this.get('project.users');

    if (users && users.toArray().length > 0) {
      return false;
    }

    return true;
  }.property('project.users.@each'),

  /**
   *  gitpath computed property from brand name and project name
   *
   *  @function gitPath
   *  @returns {String} project.gitpath attribute
   */
  gitPath: function() {
    var gitpath = '';
    var self = this;

    if (!this.get('project.brand') || !this.get('project.name')) {
      Ember.run.once(function() {
        self.set('project.gitpath', gitpath);
      });
      return gitpath;
    }

    // compose gitpath attribute
    gitpath = this.get('project.brand').get('name');
    gitpath = gitpath.replace(/[\. ]/g, '') + "-";
    gitpath += this.get('project.name').replace(/[\. ]/g, '-');
    gitpath = gitpath.toLowerCase();

    Ember.run.once(function() {
      self.set('project.gitpath', gitpath);
    });

    return gitpath;
  }.property('project.brand', 'project.name'),

  /**
   *  Return ftp username for current project
   *
   *  @function getFtpUser
   *  @returns {String} The ftp username
   */
  getFtpUser: function() {
    var gitpath = '';

    if (!this.get('project.id')) {
      return;
    }

    gitpath = this.get('project').get('gitpath');
    if (!gitpath) {
      return "";
    }

    // HACK find the ftp username from the gitpath value
    return gitpath.replace(/.*\//g, "");
  }.property('project.gitpath'),

  /**
   *  Return ftp password for current project
   *
   *  @function getFtpPassword
   *  @returns {String} The ftp password
   */
  getFtpPassword: function() {
    var ftppasswd = 'nextdeploy';
    var password = '';

    if (!this.get('project.id')) {
      return;
    }

    password = this.get('project').get('password');
    if (password && password.length > 0) {
      ftppasswd = password.substring(0,8);
    }

    return ftppasswd;
  }.property('project.password'),

  /**
   *  Return ftp hostname for current project
   *
   *  @function getFtpHost
   *  @returns {String} The ftp hostname
   */
  getFtpHost: function() {
    // HACK find the ftp host from the WebUI URI
    return 'f.' + window.location.hostname.replace(/^ui\./,'');
  }.property('project.id'),

  /**
   *  Check if current user can create project
   *
   *  @function isProjectCreate
   *  @returns {Boolean} True if he can
   */
  isProjectCreate: function() {
    return this.get('session').get('data.authenticated.user.is_project_create');
  }.property('session.data.authenticated.user.id'),

  /**
   *  Disable state if item already recorded
   *
   *  @function isDisableEdit
   *  @returns {Boolean} True if disabled
   */
  isDisableEdit: function() {
    if (this.get('project.id')) {
      return true;
    }

    return false;
  }.property('project.id'),

  /**
   *  Disabled state if current user is no admin
   *
   *  @function isDisableAdmin
   *  @returns {Boolean} True if disabled
   */
  isDisableAdmin: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel >= 50) {
      return false;
    }

    return true;
  }.property('session.data.authenticated.user.id'),

  /**
   *  Disabled state if current user is no admin or current item already recorded
   *
   *  @function isDisableEditAdmin
   *  @returns {Boolean} True if disabled
   */
  isDisableEditAdmin: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel < 50) {
      return true;
    }

    if (this.get('project.id')) {
      return true;
    }

    return false;
  }.property('project.id', 'session.data.authenticated.user.id'),

  /**
   *  Disabled state if current user is neither admin, neither project owner
   *
   *  @function isDisableCreate
   *  @returns {Boolean} True if disabled
   */
  isDisableCreate: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');
    var userId = this.get('session').get('data.authenticated.user.id');

    if (accessLevel >= 50) {
      return false;
    }

    if (parseInt(this.get('project.owner.id')) === userId) {
      return false;
    }

    return true;
  }.property('session.data.authenticated.user.id'),

  /**
   *  Ensures all form fields are valids before submit
   *
   *  @function isFormValid
   *  @returns {Boolean} true if all fields are valids
   */
  isFormValid: function() {
    if (!this.get('errorBrand') &&
        !this.get('errorName') &&
        !this.get('errorNameUnique') &&
        !this.get('errorNameLength') &&
        !this.get('errorLogin') &&
        !this.get('errorPassword') &&
        !this.get('errorEndpoints') &&
        !this.get('errorSystem') &&
        !this.get('errorTechnos') &&
        !this.get('errorVmsizes') &&
        !this.get('errorUsers')) {
          return true;
    }

    return false;
  }.property('errorBrand', 'errorName', 'errorNameUnique', 'errorNameLength',
             'errorLogin', 'errorPassword', 'errorEndpoints', 'errorSystem',
             'errorTechnos', 'errorVmsizes', 'errorUsers'),

  /**
   *  Trigger when receives models
   *
   *  @method didReceiveAttrs
   */
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('newFlag', false);
    this.set('projectSave', false);
    this.cleanModel();
    this.initTechnoToggles();
  },

  /**
   *  Delete records unsaved or deleted
   *
   *  @method cleanModel
   */
  cleanModel: function() {
    var cleanUsers = this.store.peekAll('user').filterBy('id', null);
    var cleanBrands = this.store.peekAll('brand').filterBy('id', null);
    var self = this;

    cleanUsers.forEach(function(clean) {
      if (clean) { clean.deleteRecord(); }
    });

    cleanBrands.forEach(function(clean) {
      if (clean) { clean.deleteRecord(); }
    });

    cleanUsers = this.store.peekAll('user').filterBy('isDeleted', true);
    cleanBrands = this.get('brands').filterBy('isDeleted', true);

    cleanUsers.forEach(function(clean) {
      if (clean) { self.get('users').removeObject(clean); }
    });

    cleanBrands.forEach(function(clean) {
      if (clean) { self.store.peekAll('brand').removeObject(clean); }
    });
  },

  /**
   *  Manage differents technos list for the form
   *
   *  @method initTechnoToggles
   */
  initTechnoToggles: function() {
    var self = this;
    var selected = null;
    var isToggled = false;

    this.set('project_technotypes', []);
    this.get('technotypes').map(function(model) {
      selected = null;
      isToggled = false;
      self.get('project').get('technos').forEach(function(techno) {
        if (parseInt(model.id) === parseInt(techno.get('technotype.id'))) {
          selected = techno;
          isToggled = true;
        }
      });

      self.get('project_technotypes').pushObject(Ember.ObjectProxy.create({
        technotype: model,
        selected: selected,
        toggled: isToggled
      }));
    });
  },

  /**
   *  Record the technos list for current object
   *
   *  @method flushTechnosList
   */
  flushTechnosList: function() {
    var projectTechnos = [];

    this.get('project_technotypes').forEach(function(technotype) {
      if (technotype.get('selected')) {
        projectTechnos.pushObject(technotype.get('selected'));
      }
    });

    this.get('project').set('technos', projectTechnos);
  },

  /**
   *  Ensure admin users or himself are still in users array
   *
   *  @method checkAdminUsers
   */
  checkAdminUsers: function() {
    var self = this;
    var userId = this.get('session').get('data.authenticated.user.id');

    this.get('users').forEach(function(user) {
      if (user.get('group').get('access_level') === 50 || parseInt(user.id) === userId) {
        if (!self.get('project.users').contains(user)) {
          self.get('project.users').pushObject(user);
        }
      }
    });
  },

  /**
   *  Ensure that varnish or apache is on techno array for a web project
   *
   *  @method checkVarnishAndWebTechnos
   */
  checkVarnishAndWebTechnos: function() {
    var varnishTechno = null;
    var webTechno = null;
    var isVarnish = false;
    var isWeb = false;
    var endpoints = this.get('project.endpoints');

    // if only "noweb" framework, varnish can be disabled
    if (endpoints) {
      endpoints.forEach(function(ep) {
        // HACK match with framework name
        if(!/.*NoWeb.*/.test(ep.get('framework.name'))) {
          isVarnish = true;
        }
      });
    }

    if (!isVarnish) {
      return;
    }

    // isolate varnish default techno
    this.get('technos').forEach(function(techno) {
      // HACK match with techno name
      if (/.*varnish.*/.test(techno.get('name')) && !varnishTechno) {
        varnishTechno = techno;
      }
    });

    if (!varnishTechno) {
      return;
    }

    // add varnish on techno list
    this.get('project_technotypes').map(function(technoproxy) {
      // HACK match with technotype name
      if (/.*Cache.*/.test(technoproxy.get('technotype').get('name')) &&
          !technoproxy.get('selected')) {
        technoproxy.set('selected', varnishTechno);
        technoproxy.set('toggled', true);
      }
    });

    // if "noweb" or node framework, web server can be disabled
    if (endpoints) {
      // HACK match with framework name
      endpoints.forEach(function(ep) {
        if(!/.*NoWeb.*/.test(ep.get('framework.name')) &&
          !/.*NodeJS.*/.test(ep.get('framework.name')) &&
          !/.*ReactJS.*/.test(ep.get('framework.name'))) {
          isWeb = true;
        }
      });
    }

    if (!isWeb) {
      return;
    }

    // isolate web default techno
    this.get('technos').forEach(function(techno) {
      // HACK match with technotype name
      if (/.*Web.*/.test(techno.get('technotype').get('name')) && !webTechno) {
        webTechno = techno;
      }
    });

    if (!webTechno) {
      return;
    }

    // add web default on techno list
    this.get('project_technotypes').map(function(technoproxy) {
      // HACK match with technotype name
      if (/.*Web.*/.test(technoproxy.get('technotype').get('name')) &&
          !technoproxy.get('selected')) {
        technoproxy.set('selected', webTechno);
        technoproxy.set('toggled', true);
      }
    });
  },

  /**
   *  Ensure that node is on techno array for a web project
   *
   *  @method checkNodeTechnos
   */
  checkNodeTechnos: function() {
    var nodeTechno = null;
    var isNode = false;
    var endpoints = this.get('project.endpoints');

    // if only "noweb" framework, node can be disabled
    if (endpoints) {
      endpoints.forEach(function(ep) {
        // HACK match with framework name
        if(!/.*NoWeb.*/.test(ep.get('framework.name'))) {
          isNode = true;
        }
      });
    }

    if (!isNode) {
      return;
    }

    this.get('technos').forEach(function(techno) {
      // HACK match with techno name
      if (/.*node.*/.test(techno.get('name')) && !nodeTechno) {
        nodeTechno = techno;
      }
    });

    if (!nodeTechno) {
      return;
    }

    this.get('project_technotypes').map(function(technoproxy) {
      // HACK match with technotype name
      if (/.*Node.*/.test(technoproxy.get('technotype').get('name')) &&
          !technoproxy.get('selected')) {
        technoproxy.set('selected', nodeTechno);
        technoproxy.set('toggled', true);
      }
    });
  }
});
