import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  isShowingDeleteConfirmation: false,

  // trigger function when model changes
  didReceiveAttrs() {
    this._super(...arguments);
    this.cleanModel();
    this.prepareList();
  },

  // format users list
  prepareList: function() {
    var groupId = parseInt(this.get('groupId'));
    var projectId = parseInt(this.get('projectId'));
    var firstUser = null;
    var search = this.get('search');
    var cp = this.get('currentPage') || 0;
    var ncp = 0;
    var ibp = 0;
    var ibpmax = config.APP.NBITEMSBYPAGE;
    var pages = [];
    var current_id = this.get('session').get('data.authenticated.user.id');

    firstUser = this.store.peekRecord('user', current_id);
    if (firstUser) {
      this.get('users').removeObject(firstUser);
      this.get('users').unshiftObject(firstUser);
    }

    this.get('users').map(function(model){
      var user_id = parseInt(model.get('id'));

      // filtering item display with search field, groupId, projectId and paging system
      model.set('isShow', true);
      if (groupId !== 0) {
        if (parseInt(model.get('group.id')) !== groupId) {
          model.set('isShow', false);
        }
      }

      if (projectId !== 0) {
        model.set('isShow', model.get('projects').any(function(item){
          return parseInt(item.get('id')) === projectId;
        }));
      }

      if (search) {
        if (! new RegExp("^.*" + search + ".*$", 'i').test(model.get('email')) &&
            ! new RegExp("^.*" + search + ".*$", 'i').test(model.get('firstname')) &&
            ! new RegExp("^.*" + search + ".*$", 'i').test(model.get('lastname'))) {
          model.set('isShow', false);
        }
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

      model.set('isCurrent', (user_id === current_id));
    });

    // set paging numbers
    this.set('pages', pages);
  },

  // delete records unsaved or deleted
  cleanModel: function() {
    var self = this;
    var cleanUsers = this.get('users').filterBy('isDeleted', true);
    var cleanKeys = this.store.peekAll('sshkey').filterBy('isDeleted', true);
    var cleanProjects = this.store.peekAll('project').filterBy('isDeleted', true);

    cleanUsers.forEach(function (clean) {
      if (clean) { self.get('users').removeObject(clean); }
    });

    cleanProjects.forEach(function (clean) {
      if (clean) { self.store.peekAll('project').removeObject(clean); }
    });

    cleanKeys.forEach(function (clean) {
      if (clean) { self.store.peekAll('sshkey').removeObject(clean); }
    });

    cleanUsers = this.get('users').filterBy('id', null);
    cleanKeys = this.store.peekAll('sshkey').filterBy('id', null);
    cleanProjects = this.store.peekAll('project').filterBy('id', null);

    cleanUsers.forEach(function (clean) {
      if (clean) {
        self.get('users').removeObject(clean);
        clean.deleteRecord();
      }
    });

    cleanProjects.forEach(function (clean) {
      if (clean) {
        self.store.peekAll('project').removeObject(clean);
        clean.deleteRecord();
      }
    });

    cleanKeys.forEach(function (clean) {
      if (clean) {
        self.store.peekAll('sshkey').removeObject(clean);
        clean.deleteRecord();
      }
    });
  },

  // get current user properties
  currentUser: function() {
    return this.get('session').get('data.authenticated.user');
  }.property('session.data.authenticated.user.id'),

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

  // Return true if user is a Pm or more
  isPM: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 20) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  // actions binding with user event
  actions: {
    // change current page of the list
    changePage: function(cp) {
      this.set('currentPage', cp);
      this.prepareList();
    },

    // close deletes modal
    closeDeleteModal: function() {
      this.set('isShowingDeleteConfirmation', false);
      this.set('isBusy', false);
    },

    // action for delete event
    deleteItems: function() {
      var router = this.get('router');
      var self = this;
      var pass = function(){};
      var fail = function(){
        router.transitionTo('error');
      };

      this.get('users').map( function (model) {
        if (model && model.get('todelete')) {

          model.get('vms').forEach(function(vm) {
            if (vm) {
              vm.get('project').get('vms').removeObject(vm);
              self.get('vms').removeObject(vm);
              vm.destroyRecord().then(pass, fail);
            }
          });

          model.get('sshkeys').forEach(function(sshkey) {
            if (sshkey) {
              self.get('sshkeys').removeObject(sshkey);
              sshkey.destroyRecord().then(pass, fail);
            }
          });

          model.get('projects').forEach(function(project) {
            if (project) {
              project.get('users').removeObject(model);
            }
          });

          model.get('group').get('users').removeObject(model);
          self.get('users').removeObject(model);
          model.destroyRecord().then(pass, fail);
        }
      });

      // rewind to first page and display refreshed list
      this.set('currentPage', 0);
      this.cleanModel();
      this.prepareList();

      // close confirm modal
      this.set('isBusy', false);
      this.set('isShowingDeleteConfirmation', false);
    },

    // Change hide/show for delete confirmation
    showDeleteConfirmation: function() {
      var items = this.get('users').filterBy('todelete', true);
      var deleteItems = [];

      for(var i=0; i<items.length; i++) {
        deleteItems.push(items[i].get('email') + ' - ' + items[i].get('firstname') + ' ' + items[i].get('lastname'));
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
      router.transitionTo('users.new');
    },
  }
});
