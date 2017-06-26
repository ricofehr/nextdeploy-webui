import Ember from 'ember';

export default Ember.Component.extend({
  //enable advanced form
  advancedForm: false,

  //init to null parameters
  branche: null,

  //loading modal
  loadingModal: false,

  //validation variables
  errorProject: false,
  errorUser: false,
  errorBranch: false,
  errorCommit: false,
  errorOs: false,
  errorVmsize: false,
  errorTopic: false,

  errorUris: false,
  checkListUris: null,

  // trigger function when model changes
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('loadingModal', false);
    this.set('checkListUris', Ember.Object.create());
    this.cleanModel();
    this.formIsValid();
  },

  // delete records unsaved
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
  },

  // ensure that project attribute is not empty
  checkProject: function() {
    var project = this.get('vm.project.id');
    var errorProject = false;

    if (!project) {
      errorProject = true;
    }

    this.set('errorProject', errorProject);
  }.observes('vm.project'),

  // ensure that user attribute is not empty
  checkUser: function() {
    var user = this.get('vm.user.id');
    var errorUser = false;

    if (!user) {
      errorUser = true;
    }

    this.set('errorUser', errorUser);
  }.observes('vm.user'),

  checkBranch: function() {
    var branch = null;
    var errorBranch = false;

    branch = this.get('branche');
    if (!branch) {
      errorBranch = true;
    }

    this.set('errorBranch', errorBranch);
  },

  // ensure that branch attribute is not empty
  // and set default commit when branche changes
  changeBranch: function() {
    var branch = null;
    var errorBranch = true;
    var self = this;

    this.set('loadingModal', true);
    this.set('commits', []);

    branch = this.get('branche');
    if (branch) {
      errorBranch = false;
      branch.reload().then(function (branch) {
        branch.get('commits').then(function (commits) {
          if (self) {
            self.set('loadingModal', false);
            self.set('vm.topic', branch.get('name'));
            self.set('vm.commit', commits.toArray()[0]);
          }
        });
      });
    } else {
      this.set('loadingModal', false);
      this.set('vm.commit', null);
    }

    this.set('errorBranch', errorBranch);

  }.observes('branche'),

  // ensure that commit attribute is not empty
  checkCommit: function() {
    var commit = this.get('vm.commit.id');
    var errorCommit = false;

    if (!commit) {
      errorCommit = true;
    }

    this.set('errorCommit', errorCommit);
  }.observes('vm.commit'),

  // ensure that systemimage attribute is not empty
  checkOs: function() {
    var os = this.get('vm.systemimage.id');
    var errorOs = false;

    if (!os) {
      errorOs = true;
    }

    this.set('errorOs', errorOs);
  }.observes('vm.systemimage'),

  // ensure that vmsize attribute is not empty
  checkVmsize: function() {
    var vmsize = this.get('vm.vmsize.id');
    var errorVmsize = false;

    if (!vmsize) {
      errorVmsize = true;
    }

    this.set('errorVmsize', errorVmsize);
  }.observes('vm.vmsize'),

  // check uris
  checkUris: function() {
    var checks = this.get('checkListUris');
    var errorUris = false;

    this.get('vm.uris').forEach(function (uri) {
      if (uri.get('path') && checks.get(uri.get('path'))) {
        errorUris = true;
      }
    });

    this.set('errorUris', errorUris);
  }.observes('vm.uris'),

  checkTopic: function() {
    var topic = null;
    var errorTopic = false;

    topic = this.get('vm.topic');
    if (topic === '') {
      errorTopic = true;
    }

    this.set('errorTopic', errorTopic);
  }.observes('vm.topic'),

  //check form before submit
  formIsValid: function() {
    this.checkProject();
    this.checkUser();
    this.checkCommit();
    this.checkBranch();
    this.checkOs();
    this.checkVmsize();
    this.checkUris();
    this.checkTopic();

    if (this.get('errorProject')) {
      Ember.Logger.debug('Nok project');
    }

    if (this.get('errorUser')) {
      Ember.Logger.debug('Nok user');
    }

    if (this.get('errorBranch')) {
      Ember.Logger.debug('Nok branch');
    }

    if (this.get('errorCommit')) {
      Ember.Logger.debug('Nok commit');
    }

    if (this.get('errorOs')) {
      Ember.Logger.debug('Nok os');
    }

    if (this.get('errorUris')) {
      Ember.Logger.debug('Nok uris');
    }

    if (this.get('errorVmsize')) {
      Ember.Logger.debug('Nok vmsize');
    }

    if (this.get('errorTopic')) {
      Ember.Logger.debug('Nok topic');
    }

    if (!this.get('errorProject') &&
        !this.get('errorUser') &&
        !this.get('errorBranch') &&
        !this.get('errorCommit') &&
        !this.get('errorOs') &&
        !this.get('errorUris') &&
        !this.get('errorVmsize') &&
        !this.get('errorTopic')) { return true; }
    return false;
  },

  isValid: function() {
    if (this.get('errorProject')) {
      Ember.Logger.debug('Nok project');
    }

    if (this.get('errorUser')) {
      Ember.Logger.debug('Nok user');
    }

    if (this.get('errorBranch')) {
      Ember.Logger.debug('Nok branch');
    }

    if (this.get('errorCommit')) {
      Ember.Logger.debug('Nok commit');
    }

    if (this.get('errorOs')) {
      Ember.Logger.debug('Nok os');
    }

    if (this.get('errorUris')) {
      Ember.Logger.debug('Nok uris');
    }

    if (this.get('errorVmsize')) {
      Ember.Logger.debug('Nok vmsize');
    }

    if (this.get('errorTopic')) {
      Ember.Logger.debug('Nok topic');
    }

    if (!this.get('errorProject') &&
        !this.get('errorUser') &&
        !this.get('errorBranch') &&
        !this.get('errorCommit') &&
        !this.get('errorOs') &&
        !this.get('errorUris') &&
        !this.get('errorVmsize') &&
        !this.get('errorTopic')) { return true; }
    return false;
  }.property('errorProject', 'errorUser', 'errorBranch', 'errorCommit', 'errorOs', 'errorUris', 'errorVmsize', 'errorTopic'),

  // Return true if user is a Dev or more
  isDev: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 30) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  // Return true if user is an admin
  isAdmin: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level === 50) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  isDisabledAuth: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (!this.get('vm.name')) {
      return true;
    }

    if (access_level === 50) { return false; }
    if (this.get('vm.is_prod')) { return false; }
    return true;
  }.property('vm.name', 'vm.is_prod'),

  isDisabledProd: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var user = this.get('vm.user');

    if (!this.get('vm.name')) {
      return true;
    }

    if (access_level === 50) { return false; }
    if (parseInt(user.get('quotaprod')) > parseInt(user.get('vms').filterBy('is_prod', true).length)) { return false; }
    return true;
  }.property('vm.name'),

  generateName: function() {
    var vmname = '';
    var user = this.get('vm.user');
    var project = this.get('vm.project');

    if (!project || !user || !project.get('id') || !user.get('id')) {
      this.set('vm.name', null);
      return;
    }

    vmname = user.get('id') + '-' + project.get('name').replace(/\./g, '-') + '-' + (Math.floor(Date.now() / 1000) + '').replace(/^../, '');
    this.set('vm.name', vmname.toLowerCase());
  }.observes('vm.project', 'vm.user'),

  initUris: function() {
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

    cleanUris.forEach(function (clean) {
      if (clean) {
        clean.get('framework').get('uris').removeObject(clean);
        if (clean.get('vm')) {
          clean.get('vm').get('uris').removeObject(clean);
        }
        self.store.peekAll('uri').removeObject(clean);
        clean.deleteRecord();
      }
    });

    endpoints = this.get('vm').get('project').get('endpoints').toArray();
    this.set('vm.uris', []);

    endpoints.forEach(function (ep) {
      absolute = ep.get('prefix');
      if (absolute && absolute !== '') {
        absolute = absolute + '.';
      }
      absolute = absolute + vmname;

      aliases = '';
      aliasesT = [];
      if (ep.get('aliases')) {
        aliasesT = ep.get('aliases').split(' ');
        aliasesT = aliasesT.map(function (aliase) {
          aliase = aliase + '.' + vmname;
          return aliase;
        });
        aliases = aliasesT.join(' ');
      }

      uri = self.store.createRecord('uri',
                          { framework: ep.get('framework'), path: ep.get('path'), absolute: absolute,
                            envvars: ep.get('envvars'), aliases: aliases, port: ep.get('port'),
                            ipfilter: ep.get('ipfilter'), customvhost: ep.get('customvhost'),
                            is_sh: ep.get('is_sh'), is_import: ep.get('is_import'),
                            is_main: ep.get('is_main'), is_ssl: ep.get('is_ssl'), is_redir_alias: false });
      self.get('vm.uris').addObject(uri);
    });

  }.observes('vm.name', 'vm.is_prod'),

  actions: {

    // Reset login to default value if empty
    checkLogin: function() {
      var htlogin = null;
      var projectLogin = this.store.peekRecord('project', this.get('vm.project.id')).get('login');

      htlogin = this.get('vm.htlogin');
      if (htlogin === '') {
        this.set('vm.htlogin', projectLogin);
      }
    },

    // Reset password to default value if empty
    checkPassword: function() {
      var htpassword = null;

      htpassword = this.get('vm.htpassword');
      if (htpassword === '') {
        this.set('vm.htpassword', this.get('vm.project.password'));
      }
    },

    // check disableed state and toggle flag
    toggleFlagVm: function(disabled, property, toggle) {
      if (disabled) {
        return;
      }

      this.get('vm').set(property, toggle.newValue);
    },

    // project change event
    projectChange: function(projectSetted) {
      var self = this;

      // loading waiting
      this.set('loadingModal', true);

      // refresh project datas
      this.store.findRecord('project', projectSetted.id, { backgroundReload: false, reload: true }).then(function(project) {

        self.set('vm.project', project);

        //if selectedproject was flushed, flush usersList
        if (!self.get('vm.project.id')) {
          self.set('loadingModal', false);
          self.set('branche', null);
          return;
        }

        //first, change users combobox
        var access_level = self.get('session').get('data.authenticated.access_level');
        var user_id = self.get('session').get('data.authenticated.user.id');
        var user_index = 0;

        // remove other users if we arent > ProjectLead right
        // remove admin users if we are ProjectLead
        if (access_level < 50) {
          project.get('users').toArray().forEach(function (user){
            if (access_level < 40 && user && parseInt(user.id) !== user_id) {
                  project.get('users').removeObject(user);
            }

            if (access_level === 40 && user && user.get('group').get('access_level') === 50) {
                  project.get('users').removeObject(user);
            }
          });
        }

        // set default index in users array
        for (var i = 0; i < project.get('users').toArray().length; i++) {
          if (project.get('users').toArray()[i].id === user_id) {
            user_index = i;
            break;
          }
        }

        // init htlogin and htpassword
        self.set('vm.htlogin', project.get('login'));
        self.set('vm.htpassword', project.get('password'));
        self.set('vm.is_ht', project.get('is_ht'));

        // init default values
        self.set('vm.technos', project.get('technos').toArray());
        self.set('vm.user', project.get('users').toArray()[user_index]);
        self.set('vm.systemimage', project.get('systemimages').toArray()[0]);

        if (self.get('isJenkins')) {
          self.set('vm.vmsize', self.store.peekAll('vmsize').toArray()[2]);
        } else {
          self.set('vm.vmsize', project.get('vmsizes').toArray()[0]);
        }

        // init default branch and commit
        self.get('vm.project').get('branches').then(function(branchs) {
          branchs.forEach(function(branch) {
              if (branch.id === project.get('id') + '-master') {
                self.set('branche', branch);
              }
          });
        });

      });

    },

    // trigger when a property is changed into power-select element
    changeProperty: function(property, value) {
      this.set(property, value);
    },

    // trigger when a property is changed into power-select element
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

    // Create a new vm form
    createItem: function() {
      var router = this.get('router');
      var vm = this.get('vm');
      var nbUris = parseInt(this.get('vm.uris.length'));
      var readytoBoot = 0;
      var self = this;

      // check if form is valid
      if (!this.formIsValid()) {
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

    // Toggle or untoggle advanced-form flag
    toggleAdvanced: function() {
      if (this.get('advancedForm')) { this.set('advancedForm', false); }
      else { this.set('advancedForm', true); }
    },
  }
});
