// Ember controller for create vm form
var VmsNewController = Ember.ObjectController.extend({
  computeSorting: ['name'],
  //disable advanced form
  advancedForm: false,

  //project combobox
  projectsFilter: Ember.computed.filterBy('projects', 'name'),
  projectsSort: Ember.computed.sort('projectsFilter', 'computeSorting'),

  //system combobox
  selectedSystem: null,
  osSort: null,

  //users combobox
  emailSorting: ['email'],
  usersSort: Ember.computed.sort('users', 'emailSorting'),

  //init to null parameters
  selectedProject: null,
  selectedUser: null,
  selectedBranch: null,
  selectedCommit: null,
  selectedOs: null,
  usersList: null,
  vmsizesList: null,
  selectedSizing: null,

  //validation variables
  errorProject: false,
  errorUser: false,
  errorBranch: false,
  errorCommit: false,
  errorOs: false,
  errorVmsize: false,

  //validation function
  checkProject: function() {
    var project = this.get('selectedProject');
    var errorProject = false;

    if (!project) {
      errorProject = true;
    }

    this.set('errorProject', errorProject);
  }.observes('selectedProject'),

  checkUser: function() {
    var user = this.get('selectedUser');
    var errorUser = false;

    if (user == null) {
      errorUser = true;
    }

    this.set('errorUser', errorUser);
  }.observes('selectedUser'),

  checkBranch: function() {
    var branch = this.get('selectedBranch');
    var errorBranch = true;
    var selectedCommit = null;

    if (branch) {
      errorBranch = false;
      selectedCommit = branch.get('commits').toArray()[0];
    }

    this.set('errorBranch', errorBranch);
    // set default commit
    this.set('selectedCommit', selectedCommit);
  }.observes('selectedBranch'),

  checkCommit: function() {
    var commit = this.get('selectedCommit');
    var errorCommit = false;

    if (!commit) {
      errorCommit = true;
    }

    this.set('errorCommit', errorCommit);
  }.observes('selectedCommit'),

  checkOs: function() {
    var os = this.get('selectedOs');
    var errorOs = false;

    if (!os) {
      errorOs = true;
    }

    this.set('errorOs', errorOs);
  }.observes('selectedOs'),

  checkVmsize: function() {
    var vmsize = this.get('selectedSizing');
    var errorVmsize = false;

    if (!vmsize) {
      errorVmsize = true;
    }

    this.set('errorVmsize', errorVmsize);
  }.observes('selectedSizing'),

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
        !this.get('errorVmsize')) return true;
    return false;
  },

  //clear form
  clearForm: function() {
    this.set('selectedProject', null);
    this.set('selectedUser', null);
    this.set('selectedBranch', null);
    this.set('selectedCommit', null);
    this.set('selectedOs', null);
    this.set('selectedSizing', null);
    this.set('advancedForm', false);
  },

  // Return true if user is a Dev or more
  isDev: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');

    if (access_level >= 30) return true;
    return false;
  }.property('App.AuthManager.apiKey'),

  // project change event
  projectChange: function() {
    var store = this.store;
    var self = this;
    var cp = 0;
    var project = null;

    //if selectedproject was flushed, flush usersList
    if (!this.get('selectedProject')) {
      this.set('usersList', []);
      this.set('osSort', []);
      this.set('vmsizesList', []);
      return;
    }

    //update project datas
    project = this.get('selectedProject');
    project.reload().then(function (project) {

      //first, change users combobox
      var users = project.get('users').toArray();
      var access_level = App.AuthManager.get('apiKey.accessLevel');
      var user_id = App.AuthManager.get('apiKey.user');
      var user_index = 0;
      var systemtype = null;

      if (access_level < 40) {
        project.get('users').toArray().forEach(function (user){
          if (user && user.id != user_id) {
                users.removeObject(user);
          }
        });
      }

      // set default index in users array
      for (var i = 0; i < users.length; i++) {
        if (users[i].id == user_id) {
          user_index = i;
          break;
        }
      }

      self.set('usersList', users);

      //vmsize combobox
      var vmsizesid = project.get('vmsizes').mapBy('id');
      var vmsizes = [];
      vmsizesid.forEach(function(vmsizeid){
        vmsizes[cp++] = self.get('vmsizes').filterBy('id', vmsizeid).toArray()[0];
      });

      vmsizes = project.get('vmsizes');
      self.set('vmsizesList', vmsizes);

      //and the system combobox
      var systemimages = null;
      systemtype = project.get('systemimagetype');
      systemimages = self.get('systemimages').filterBy('systemimagetype.id', systemtype.get('id')).toArray();
      self.set('osSort', systemimages);

      //init default values
      self.set('selectedUser', users[user_index]);
      self.set('selectedOs', systemimages[0]);
      self.set('selectedSizing', vmsizes.toArray()[0]);

      //init default branch and commit
      project.get('branches').forEach(function(branch) {
        branch.reload().then(function (branchup) {
          if (branchup.id == project.get('id') + '-master') { self.set('selectedBranch', branchup); }
       });
      });

    });
  }.observes('selectedProject'),

  actions: {
    // Submit form
    createItem: function() {
      var router = this.get('target');

      var data = {};
      var store = this.store;

      // get the values from the form
      var selectedProject = this.get('selectedProject');
      var selectedCommit = this.get('selectedCommit');
      var selectedUser = this.get('selectedUser');
      var selectedOs = this.get('selectedOs');
      var selectedVmsize = this.get('selectedSizing');

      // check if form is valid
      if (!this.formIsValid()) {
        return ;
      }

      // format value for the post request
      data['commit'] = selectedCommit;
      data['project'] = selectedProject;
      data['user'] = selectedUser;
      data['systemimage'] = selectedOs;
      data['vmsize'] = selectedVmsize;

      // create a vm object for the rest post request
      vm = store.createRecord('vm', data);

      selectedUser.get('vms').pushObject(vm);
      selectedProject.get('vms').pushObject(vm);
      selectedOs.get('vms').pushObject(vm);
      selectedCommit.get('vms').pushObject(vm);

      //loader because 10s to complete create vm
      $('#waitingModal').modal();
      vm.save().then(function() {
        router.transitionTo('vms.list');
        $('#waitingModal').modal('hide');
      }) ;

    },

     // Toggle or untoggle all items
    toggleAdvanced: function() {
      if (this.get('advancedForm')) this.set('advancedForm', false);
      else this.set('advancedForm', true);
    },
  }
});

module.exports = VmsNewController;