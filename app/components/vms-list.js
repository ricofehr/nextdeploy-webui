import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  // Show / hide on html side
  isAllDelete: false,
  isShowingDeleteConfirmation: false,

  // trigger when model changes
  didReceiveAttrs() {
    this._super(...arguments);
    this.cleanModel();
    this.prepareList();
  },

  // format vms list
  prepareList: function() {
    var userId = parseInt(this.get('userId'));
    var projectId = parseInt(this.get('projectId'));
    var search = this.get('search');
    var cp = this.get('currentPage') || 0;
    var ncp = 0;
    var ibp = 0;
    var ibpmax = config.APP.NBITEMSBYPAGE;
    var pages = [];

    this.get('vms').map(function(model){
      var textStatus = '';
      var warnStatus = false;
      var dangStatus = false;
      var sucStatus = false;
      var status = parseInt(model.get('status'));
      var day = '';
      var month = '';
      var hour = '';
      var minute = '';
      var branchName = '';


      // weird issue with ember nested model data, so get branchname from commit id
      branchName = model.get('commit.id').replace(/^[0-9][0-9]*-/,'').replace(/-.*$/,'');
      model.set('branch', branchName.substring(0,10));

      // init date value
      day = model.get('created_at').getDate();
      if (parseInt(day) < 10) { day = '0' + day; }
      month = model.get('created_at').getMonth() + 1;
      if (parseInt(month) < 10) { month = '0' + month; }
      hour = model.get('created_at').getHours();
      if (parseInt(hour) < 10) { hour = '0' + hour; }
      minute = model.get('created_at').getMinutes();
      if (parseInt(minute) < 10) { minute = '0' + minute; }

      model.set('created_at_short', day + "/" + month + " " + hour + ":" + minute);

      // init status field
      if (status < 1) {
        textStatus = 'SETUP';
        warnStatus = true;
        // if status is negative => setup in progress
        model.set('timeStatus', -(status));
      }
      else if (status > 1) { textStatus = 'RUN'; sucStatus = true; model.set('timeStatus', (status)); }
      else { textStatus = 'ERROR'; dangStatus = true; }

      model.set('textStatus', textStatus);
      model.set('sucStatus', sucStatus);
      model.set('warnStatus', warnStatus);
      model.set('dangStatus', dangStatus);

      // filtering item display with search field, userId, projectId and paging system
      model.set('isShow', true);
      // if userId parameter exists
      if (userId !== 0) {
        if (parseInt(model.get('user.id')) !== userId) {
          model.set('isShow', false);
        }
      }

      // if projectId != 0
      if (projectId !== 0) {
        if (parseInt(model.get('project.id')) !== projectId) {
          model.set('isShow', false);
        }
      }

      if (search) {
        if (!new RegExp("^.*" + search + ".*$").test(model.get('commit.id')) &&
            !new RegExp("^.*" + search + ".*$").test(model.get('project.name')) &&
            !new RegExp("^.*" + search + ".*$").test(model.get('user.email')) &&
            !new RegExp("^.*" + search + ".*$").test(model.get('user.firstname')) &&
            !new RegExp("^.*" + search + ".*$").test(model.get('user.lastname')) &&
            !new RegExp("^.*" + search + ".*$").test(model.get('systemimage.name'))) {
          model.set('isShow', false);
        }
      }

      // if user object is null, the vm was deleted
      if (!model.get('user')) {
        model.set('isShow', false);
      }

      // paging system
      if (model.get('isShow')) {
        if (!pages.isAny('cp', ncp)) {
          pages.addObject(Ember.Object.create({cp: ncp, current: ncp === cp}));
        }

        if (ncp !== cp) {
          model.set('isShow', false);
        }

        ++ibp;
        if (ibp === ibpmax) {
          ibp = 0;
          ncp++;
        }
      }
    });

    // set paging numbers
    this.set('pages', pages);
  },

  // delete records unsaved or deleted
  cleanModel: function() {
    var self = this;
    var cleanUsers = this.store.peekAll('user').filterBy('isDeleted', true);
    var cleanVms = this.get('vms').filterBy('isDeleted', true);
    var cleanProjects = this.store.peekAll('project').filterBy('isDeleted', true);
    var cleanBrands = this.store.peekAll('brand').filterBy('isDeleted', true);

    cleanUsers.forEach(function (clean) {
      if (clean) { self.store.peekAll('user').removeObject(clean); }
    });

    cleanProjects.forEach(function (clean) {
      if (clean) { self.store.peekAll('project').removeObject(clean); }
    });

    cleanVms.forEach(function (clean) {
      if (clean) { self.get('vms').removeObject(clean); }
    });

    cleanBrands.forEach(function (clean) {
      if (clean) { self.store.peekAll('brand').removeObject(clean); }
    });

    cleanUsers = this.store.peekAll('user').filterBy('id', null);
    cleanVms = this.get('vms').filterBy('id', null);
    cleanBrands = this.store.peekAll('brand').filterBy('id', null);
    cleanProjects = this.store.peekAll('project').filterBy('id', null);

    cleanUsers.forEach(function (clean) {
      if (clean) {
        self.store.peekAll('user').removeObject(clean);
        clean.deleteRecord();
      }
    });

    cleanProjects.forEach(function (clean) {
      if (clean) {
       self.store.peekAll('project').removeObject(clean);
       clean.deleteRecord();
     }
    });

    cleanVms.forEach(function (clean) {
      if (clean) {
        self.get('vms').removeObject(clean);
        clean.deleteRecord();
      }
    });

    cleanBrands.forEach(function (clean) {
      if (clean) {
        self.store.peekAll('brand').removeObject(clean);
        clean.deleteRecord();
      }
    });
  },

  // Return true if user is an admin
  isAdmin: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level === 50) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  // Return true if user is a Lead Dev
  isLead: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 40) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  // Return true if user is a Dev or more
  isDev: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 30) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  // Check if current user can launch vm
  isVm: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 20) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  // actions binding with user event
  actions: {
    changePage: function(cp) {
      this.set('currentPage', cp);
      this.prepareList();
    },

    // open detail modal from targetted vm (vmId parameter)
    showDetails: function(vmId) {
      this.set('isShowingDetails', vmId);
      this.set('isBusy', true);
    },

    // open uris modal from targetted vm (vmId parameter)
    showUris: function(vmId) {
      this.set('isShowingUris', vmId);
      this.set('isBusy', true);
    },

    // close deletes modal
    closeDeleteModal: function() {
      this.set('isShowingDeleteConfirmation', false);
      this.set('isBusy', false);
    },

    // ajax call to get current status
    checkStatus: function(model) {
      var vm_id = model.get('id');

      // jquery get setupcomplete
      Ember.$.ajax({
          url: config.APP.APIHost + "/api/v1/vms/" + vm_id + "/setupcomplete",
          global: false,
          headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
        })
        .done(function(data) {
          model.set('status', data);
          model.set('timeStatus', data);
          model.set('textStatus', 'RUN');
          model.set('sucStatus', true);
          model.set('warnStatus', false);
          model.set('dangStatus', false);
        })
        .fail(function(data) {
          model.set('status', data.responseText);
          model.set('timeStatus', -parseInt(data.responseText));

          // check if error or setup
          if (parseInt(data.responseText) === 1) {
            model.set('textStatus', 'ERROR');
            model.set('sucStatus', false);
            model.set('warnStatus', false);
            model.set('dangStatus', true);
          } else {
            model.set('textStatus', 'SETUP');
            model.set('sucStatus', false);
            model.set('warnStatus', true);
            model.set('dangStatus', false);
          }
        });
    },

    // action for delete event
    deleteItems: function() {
      var items = this.get('vms').filterBy('todelete', true);
      var self = this;

      items.forEach(function(model) {
        if (model && model.get('todelete')) {
          model.destroyRecord();
          self.get('vms').removeObject(model);
          model.get('user').get('vms').removeObject(model);
          model.get('project').get('vms').removeObject(model);
        }
      });

      // rewind to first page and display refreshed list
      this.set('currentPage', 0);
      this.cleanModel();
      this.prepareList();

      // close confirm modal
      this.set('isBusy', false);
      this.set('isShowingDeleteConfirmation', false);
      this.set('isAllDelete', false);
    },

    // Change hide/show for delete confirmation
    showDeleteConfirmation: function() {
      var items = this.get('vms').filterBy('todelete', true);
      var deleteItems = [];

      for(var i=0; i<items.length; i++) {
        deleteItems.push(items[i].get('name') + ", user:" + items[i].get('user').get('email'));
      }

      if (deleteItems.length > 0) {
        this.set('isBusy', true);
        this.set('deleteItems', deleteItems);
        this.set('isShowingDeleteConfirmation', true);
      }
    },

    // Action for add a new item, change current page to create form
    newItem: function() {
      var router = this.get('router');
      router.transitionTo('vms.new');
    },

    // Toggle or untoggle all items
    toggleDeleteAll: function() {
      if (this.get('isAllDelete')) { this.set('isAllDelete', false); }
      else { this.set('isAllDelete', true); }

      this.get('vms').setEach('todelete', this.get('isAllDelete'));
    },
  }
});