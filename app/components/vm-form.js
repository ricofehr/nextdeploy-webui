import Ember from 'ember';

/**
 *  This component manages vm form modal
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class VmForm
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Triggered when branche change
     *  Set default commit
     *
     *  @event changeBranche
     *  @param {Branche} branch
     */
    changeBranche: function(branch) {
      var self = this;

      this.set('loadingModal', true);
      this.set('commits', []);

      if (branch) {
        branch.reload().then(function (branch) {
          branch.get('commits').then(function (commits) {
            self.set('loadingModal', false);
            self.set('branche', branch);
            self.set('vm.topic', branch.get('name'));
            self.set('vm.commit', commits.toArray()[0]);
          });
        });
      } else {
        this.set('loadingModal', false);
        this.set('vm.commit', null);
      }
    },

    /**
     *  Reset login to default value if empty
     *
     *  @event checkLogin
     */
    checkLogin: function() {
      var htlogin = this.get('vm.htlogin');

      if (htlogin === '') {
        this.set('vm.htlogin', this.get('vm.project.login'));
      }
    },

    /**
     *  Reset password to default value if empty
     *
     *  @event checkPassword
     */
    checkPassword: function() {
      var htpassword = this.get('vm.htpassword');

      if (htpassword === '') {
        this.set('vm.htpassword', this.get('vm.project.password'));
      }
    },

    /**
     *  Change is_prod flag
     *
     *  @event changeProd
     *  @param {Toggle} toggle
     */
    changeProd: function(toggle) {
      var isProd = toggle.newValue;

      if (isProd === this.get('vm.is_prod')) {
        return;
      }

      this.set('vm.is_prod', toggle.newValue);
      this.generateUris();
    },

    /**
     *  Triggered when project change
     *  Set default branche, system, and vmsize
     *
     *  @event changeProject
     *  @param {Project} projectSetted
     */
    changeProject: function(projectSetted) {
      var self = this;

      // loading waiting
      this.set('loadingModal', true);

      // refresh project datas
      this.store.findRecord('project',
                            projectSetted.id,
                            { backgroundReload: false, reload: true }
                            ).then(function(project) {

        self.set('vm.project', project);

        //if selectedproject was flushed, flush usersList
        if (!self.get('vm.project.id')) {
          self.set('loadingModal', false);
          self.set('branche', null);
          return;
        }

        //first, change users combobox
        var accessLevel = self.get('session').get('data.authenticated.access_level');
        var userId = self.get('session').get('data.authenticated.user.id');
        var userIndex = 0;

        // remove other users if we arent > ProjectLead right
        if (accessLevel < 50) {
          project.get('users').toArray().forEach(function(user) {
            if (accessLevel < 40 && user && parseInt(user.id) !== userId) {
              project.get('users').removeObject(user);
            }
          });
        }

        // set default index in users array
        for (var i = 0; i < project.get('users').toArray().length; i++) {
          if (project.get('users').toArray()[i].id === userId) {
            userIndex = i;
            break;
          }
        }

        // init htlogin and htpassword
        self.set('vm.htlogin', project.get('login'));
        self.set('vm.htpassword', project.get('password'));
        self.set('vm.is_ht', project.get('is_ht'));

        // init default values
        self.set('vm.technos', project.get('technos').toArray());
        self.set('vm.user', project.get('users').toArray()[userIndex]);
        self.set('vm.systemimage', project.get('systemimages').toArray()[0]);

        if (self.get('isJenkins')) {
          self.set('vm.systemimage', project.get('systemimages').toArray()[0]);
          // HACK think that the third vmsize is the medium openstack flavor
          self.set('vm.vmsize', self.store.peekAll('vmsize').toArray()[2]);
        } else {
          self.set('vm.systemimage', project.get('systemimages').toArray()[0]);
          self.set('vm.vmsize', project.get('vmsizes').toArray()[0]);
        }

        // init default branch and commit
        self.get('vm.project').get('branches').then(function(branchs) {
          branchs.forEach(function(branch) {
              if (branch.id === project.get('id') + '-master') {
                self.set('branche', branch);
                self.send('changeBranche', branch);
              }
          });
        });

        self.generateVmName();
      });
    },

    /**
     *  Triggered when user is changing in power-select
     *
     *  @event changeUser
     *  @param {User} value
     */
    changeUser: function(value) {
      this.set('vm.user', value);
      this.generateVmName();
    },

    /**
     *  Trigger when a techno is changed from default value
     *
     *  @event changeTechno
     *  @param {Techno} value
     */
    changeTechno: function(value) {
      var technoType = parseInt(value.get('technotype').get('id'));
      var oldTechno = null;

      this.get('vm.technos').forEach(function (techno) {
        if (parseInt(techno.get('technotype').get('id')) === technoType) {
          oldTechno = techno;
        }
      });

      this.get('vm.technos').replace(this.get('vm.technos').indexOf(oldTechno), 1, [value]);
    },

    /**
     *  Submit form for create current object
     *
     *  @event createItem
     */
    createItem: function() {
      var router = this.get('router');
      var vm = this.get('vm');
      var nbUris = parseInt(this.get('vm.uris.length'));
      var readytoBoot = 0;
      var self = this;

      // check if form is valid
      if (!this.get('isFormValid')) {
        return;
      }

      // set same layout than user
      this.set('vm.layout', vm.get('user').get('layout'));

      var boot = function() {
        readytoBoot = readytoBoot + 1;
        if (readytoBoot === nbUris) {
          var okboot = function() {
            if (self.get('isJenkins')) {
              router.transitionTo('cis.list');
            } else {
              router.transitionTo('vms.list');
            }
          };

          var failboot = function() {
            if (self.get('isJenkins')) {
              router.transitionTo('cis.list');
            } else {
              router.transitionTo('vms.list');
            }
          };

          vm.save().then(okboot, failboot);
        }
      };

      // redirect to vms list if success
      var pass = function(vm){
        var uris = vm.get('uris');

        uris.forEach(function(uri) {
          uri.save().then(boot, fail);
        });
      };

      // redirect to error page if error occurs
      var fail = function(){
        router.transitionTo('error');
      };

      // loading modal and send request to the server
      router.transitionTo('loading');
      vm.save().then(pass, fail);
    },

    /**
     *  Toggle or untoggle advanced-form flag
     *
     *  @event toggleAdvanced
     */
    toggleAdvanced: function() {
      if (this.get('advancedForm')) { this.set('advancedForm', false); }
      else { this.set('advancedForm', true); }
    },
  },

  /**
   *  Enable advanced form
   *
   *  @property advancedForm
   *  @type {Boolean}
   */
  advancedForm: false,

  /**
   *  Store the current branche object
   *
   *  @property branche
   *  @type {Branche}
   */
  branche: null,

  /**
   *  Display loading modal
   *
   *  @property loadingModal
   *  @type {Boolean}
   */
  loadingModal: false,

  /**
   *  Uris list taken from uris component and store Uri valid state
   *
   *  @property checkListUris
   *  @type {Hash} Uri => Boolean
   */
  checkListUris: null,

  /**
   *  Ensure that project attribute is filled
   *
   *  @function errorProject
   *  @returns {Boolean} true if no valid field
   */
  errorProject: function() {
    var project = this.get('vm.project.id');

    if (!project) {
      return true;
    }

    return false;
  }.property('vm.project'),

  /**
   *  Ensure that user attribute is filled
   *
   *  @function errorUser
   *  @returns {Boolean} true if no valid field
   */
  errorUser: function() {
    var user = this.get('vm.user.id');

    if (!user) {
      return true;
    }

    return false;
  }.property('vm.user'),

  /**
   *  Ensure that branch attribute is filled
   *
   *  @function errorBranch
   *  @returns {Boolean} true if no valid field
   */
  errorBranch: function() {
    var branch = this.get('branche');

    if (!branch) {
      return true;
    }

    return false;
  }.property('branche'),

  /**
   *  Ensure that commit attribute is filled
   *
   *  @function errorCommit
   *  @returns {Boolean} true if no valid field
   */
  errorCommit: function() {
    var commit = this.get('vm.commit.id');

    if (!commit) {
      return true;
    }

    return false;
  }.property('vm.commit'),

  /**
   *  Ensure that systemimage attribute is filled
   *
   *  @function errorOs
   *  @returns {Boolean} true if no valid field
   */
  errorOs: function() {
    var os = this.get('vm.systemimage.id');

    if (!os) {
      return true;
    }

    return false;
  }.property('vm.systemimage'),

  /**
   *  Ensure that vmsize attribute is filled
   *
   *  @function errorVmsize
   *  @returns {Boolean} true if no valid field
   */
  errorVmsize: function() {
    var vmsize = this.get('vm.vmsize.id');

    if (!vmsize) {
      return true;
    }

    return false;
  }.property('vm.vmsize'),

  /**
   *  Ensure that uris array is not empty
   *
   *  @function errorUris
   *  @returns {Boolean} true if no valid field
   */
  errorUris: function() {
    var checks = this.get('checkListUris');
    var errorUris = false;

    this.get('vm.uris').forEach(function (uri) {
      if (uri.get('path') && checks.get(uri.get('path'))) {
        errorUris = true;
      }
    });

    return errorUris;
  }.property('vm.uris.@each'),

  /**
   *  Ensure that topic attribute is filled
   *
   *  @function errorTopic
   *  @returns {Boolean} true if no valid field
   */
  errorTopic: function() {
    var topic = this.get('vm.topic');

    if (topic === '') {
      return true;
    }

    return false;
  }.property('vm.topic'),

  /**
   *  Check in real time if the form is valid
   *
   *  @function isFormValid
   *  @returns {Boolean}
   */
  isFormValid: function() {
    if (!this.get('errorProject') &&
        !this.get('errorUser') &&
        !this.get('errorBranch') &&
        !this.get('errorCommit') &&
        !this.get('errorOs') &&
        !this.get('errorUris') &&
        !this.get('errorVmsize') &&
        !this.get('errorTopic')) {
      return true;
    }
    return false;
  }.property('errorProject', 'errorUser', 'errorBranch', 'errorCommit',
             'errorOs', 'errorUris', 'errorVmsize', 'errorTopic'),

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
  }.property('session.data.authenticated.access_level'),

  /**
   *  Check if current user is admin
   *
   *  @function isAdmin
   *  @returns {Boolean} True if admin
   */
  isAdmin: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel === 50) {
      return true;
    }

    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Return true if BasicAuth toggle must be disabled
   *
   *  @function isDisabledAuth
   *  @returns {Boolean}
   */
  isDisabledAuth: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (!this.get('vm.name')) {
      return true;
    }

    if (accessLevel === 50) {
      return false;
    }

    if (this.get('vm.is_prod')) {
      return false;
    }

    return true;
  }.property('vm.name', 'vm.is_prod'),

  /**
   *  Return true if Prod toggle must be disabled
   *
   *  @function isDisabledProd
   *  @returns {Boolean}
   */
  isDisabledProd: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');
    var user = this.get('vm.user');
    var quotaProd = user.get('quotaprod');
    var countVmsProd = user.get('vms').filterBy('is_prod', true).length;

    if (!this.get('vm.name')) {
      return true;
    }

    if (accessLevel === 50) {
      return false;
    }

    if (parseInt(quotaProd) > parseInt(countVmsProd)) {
      return false;
    }

    return true;
  }.property('vm.name'),

  /**
   *  Generates vm name attribute
   *
   *  @method generateVmName
   */
  generateVmName: function() {
    var vmname = '';
    var user = this.get('vm.user');
    var project = this.get('vm.project');

    if (!project || !user || !project.get('id') || !user.get('id')) {
      this.set('vm.name', null);
      return;
    }

    vmname = user.get('id') + '-' + project.get('name').replace(/\./g, '-') + '-' + (Math.floor(Date.now() / 1000) + '').replace(/^../, '');
    this.set('vm.name', vmname.toLowerCase());

    this.generateUris();
  },

  /**
   *  Generates defaults uris endpoints for the vm
   *
   *  @method generateUris
   */
  generateUris: function() {
    var endpoints = null;
    var vmname = this.get('vm.name');
    var self = this;
    var absolute = '';
    var aliases = '';
    var aliasesT = [];
    var cleanUris = this.store.peekAll('uri').filterBy('id', null);
    var uri = null;

    if (!vmname) {
      return;
    }

    cleanUris.forEach(function(clean) {
      if (clean) {
        if (clean.get('framework')) {
          clean.get('framework').get('uris').removeObject(clean);
        }

        if (clean.get('vm')) {
          clean.get('vm').get('uris').removeObject(clean);
        }
        self.store.peekAll('uri').removeObject(clean);
        clean.deleteRecord();
      }
    });

    endpoints = this.get('vm').get('project').get('endpoints').toArray();
    this.set('vm.uris', []);

    endpoints.forEach(function(ep) {
      absolute = ep.get('prefix');
      if (absolute && absolute !== '') {
        absolute = absolute + '-';
      }
      absolute = absolute + vmname;

      aliases = '';
      aliasesT = [];
      if (ep.get('aliases')) {
        aliasesT = ep.get('aliases').split(' ');
        aliasesT = aliasesT.map(function (aliase) {
          aliase = aliase + '-' + vmname;
          return aliase;
        });
        aliases = aliasesT.join(' ');
      }

      uri = self.store.createRecord(
              'uri',
              {
                framework: ep.get('framework'), path: ep.get('path'),
                absolute: absolute, envvars: ep.get('envvars'), aliases: aliases,
                port: ep.get('port'), ipfilter: ep.get('ipfilter'),
                customvhost: ep.get('customvhost'), is_sh: ep.get('is_sh'),
                is_import: ep.get('is_import'), is_main: ep.get('is_main'),
                is_ssl: ep.get('is_ssl'), is_redir_alias: false
              }
            );

      self.get('vm.uris').addObject(uri);
    });
  },

  /**
   *  Trigger when receives models
   *
   *  @method didReceiveAttrs
   */
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('loadingModal', false);
    this.set('checkListUris', Ember.Object.create());
    this.cleanModel();
  },

  /**
   *  Delete records unsaved or deleted
   *
   *  @method cleanModel
   */
  cleanModel: function() {
    var cleanProjects = null;
    var self = this;
    var cleanEndpoints = this.store.peekAll('endpoint').filterBy('id', null);

    cleanEndpoints.forEach(function (clean) {
      if (clean) { clean.deleteRecord(); }
    });

    cleanProjects = this.get('projects').filterBy('id', null);
    cleanProjects.forEach(function (clean) {
      if (clean) { clean.deleteRecord(); }
    });

    cleanProjects = this.get('projects').filterBy('isDeleted', true);
    cleanProjects.forEach(function (clean) {
      if (clean) { self.get('projects').removeObject(clean); }
    });
  }
});
