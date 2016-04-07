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

  // trigger function when model changes
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('loadingModal', false);
    this.cleanModel();
    this.formIsValid();
  },

  // delete records unsaved
  cleanModel: function() {
    var cleanProjects = null;
    var self = this;

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

  // ensure that branch attribute is not empty
  // and set default commit when branche changes
  checkBranch: function() {
    var branch = null;
    var errorBranch = true;
    var self = this;

    this.set('loadingModal', true);

    branch = this.get('branche');
    if (branch) {
      errorBranch = false;
      branch.get('commits').then(function (commits) {
        self.set('loadingModal', false);
        self.set('vm.commit', commits.toArray()[0]);
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

  //check form before submit
  formIsValid: function() {
    this.checkProject();
    this.checkUser();
    this.checkBranch();
    this.checkCommit();
    this.checkOs();
    this.checkVmsize();

    if (!this.get('errorProject') &&
        !this.get('errorUser') &&
        !this.get('errorBranch') &&
        !this.get('errorCommit') &&
        !this.get('errorOs') &&
        !this.get('errorVmsize')) { return true; }
    return false;
  },

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

  actions: {

    // project change event
    projectChange: function(projectSetted) {
      var self = this;
      var project = null;

      this.set('vm.project', projectSetted);

      //if selectedproject was flushed, flush usersList
      if (!this.get('vm.project.id')) {
        this.set('branche', null);
        return;
      }

      //update project datas
      project = this.get('vm.project');

      //first, change users combobox
      var access_level = this.get('session').get('data.authenticated.access_level');
      var user_id = this.get('session').get('data.authenticated.user.id');
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

      // init default values
      self.set('vm.technos', project.get('technos').toArray());
      self.set('vm.user', project.get('users').toArray()[user_index]);
      self.set('vm.systemimage', project.get('systemimages').toArray()[0]);
      self.set('vm.vmsize', project.get('vmsizes').toArray()[0]);

      // init default branch and commit
      this.set('loadingModal', true);
      project.get('branches').then(function(branchs) {
        branchs.forEach(function(branch) {
          branch.reload().then(function (branchup) {
            if (branchup.id === project.get('id') + '-master') {
              self.set('branche', branchup);
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

      // check if form is valid
      if (!this.formIsValid()) {
        return;
      }

      // set same layout than user
      this.set('vm.layout', vm.get('user').get('layout'));

      // redirect to vms list if success
      var pass = function(){
        router.transitionTo('vms.list');
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
