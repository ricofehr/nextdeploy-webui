import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  // sort propeties and projects sorting compute
  computeSorting: ['created_at:desc'],
  projectsSort: Ember.computed.sort('projects', 'computeSorting'),
  // Show / hide on html side
  isShowingDeleteConfirmation: false,

  // trigger when model changes
  didReceiveAttrs() {
    this._super(...arguments);
    this.cleanModel();
    this.prepareList();
  },

  // Return model array sorted
  prepareList: function() {
    var userId = parseInt(this.get('userId'));
    var brandId = parseInt(this.get('brandId'));
    var projects = this.get('projects').filterBy('created_at');
    var day = '';
    var month = '';
    var year = '';
    var search = this.get('search');
    var cp = this.get('currentPage') || 0;
    var ncp = 0;
    var ibp = 0;
    var ibpmax = config.APP.NBITEMSBYPAGE;
    var pages = [];
    var framework = '';

    // max 5 items on a page for projects
    if (ibpmax > 5) {
      ibpmax = 5;
    }

    // filter projects array only with valid item for current user
    projects.map(function(model){
      // check if current model is reliable
      if (!model.get('brand') ||
          !model.get('brand.id')) {
        model.set('isShow', false);
        return;
      }

      model.set('gitpath_href', "git@" + model.get('gitpath'));
      // init date value
      day = model.get('created_at').getDate();
      if (parseInt(day) < 10) { day = '0' + day; }
      month = model.get('created_at').getMonth() + 1;
      if (parseInt(month) < 10) { month = '0' + month; }
      year = model.get('created_at').getFullYear();

      model.set('created_at_short', day + "/" + month + "/" + year);

      // filter project listing with brand, user, search field, and current page value
      model.set('isShow', true);
      // if brandId parameter exists
      if (brandId !== 0) {
        if (parseInt(model.get('brand.id'), 10) !== brandId) { model.set('isShow', false); }
      }

      // if userId parameter exists
      if (userId !== 0) {
        model.set('isShow', model.get('users').any(function(item){
          return parseInt(item.get('id'), 10) === userId;
        }));
      }

      if (search) {
        framework = '';
        model.get('endpoints').forEach(function (ep) {
          framework = framework + ' ' + ep.get('framework.name');
        });

        if (!new RegExp("^.*" + search + ".*$", 'i').test(model.get('name')) &&
            !new RegExp("^.*" + search + ".*$", 'i').test(model.get('brand').get('name')) &&
            !new RegExp("^.*" + search + ".*$", 'i').test(framework)) {
          model.set('isShow', false);
        }
      }

      // if brand object is null, the project was deleted
      if (!model.get('brand')) {
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

    // set paging list
    this.set('pages', pages);
  }.observes('refreshList'),

  // delete records unsaved or deleted
  cleanModel: function() {
    var self = this;

    var cleanUsers = this.store.peekAll('user').filterBy('isDeleted', true);
    var cleanVms = this.store.peekAll('vm').filterBy('isDeleted', true);
    var cleanProjects = this.get('projects').filterBy('isDeleted', true);
    var cleanBrands = this.store.peekAll('brand').filterBy('isDeleted', true);

    cleanUsers.forEach(function (clean) {
      if (clean) { self.store.peekAll('user').removeObject(clean); }
    });

    cleanProjects.forEach(function (clean) {
      if (clean) { self.get('projects').removeObject(clean); }
    });

    cleanVms.forEach(function (clean) {
      if (clean) { self.store.peekAll('vm').removeObject(clean); }
    });

    cleanBrands.forEach(function (clean) {
      if (clean) { self.store.peekAll('brand').removeObject(clean); }
    });

    cleanUsers = this.store.peekAll('user').filterBy('id', null);
    cleanVms = this.store.peekAll('vm').filterBy('id', null);
    cleanBrands = this.store.peekAll('brand').filterBy('id', null);
    cleanProjects = this.get('projects').filterBy('id', null);

    cleanUsers.forEach(function (clean) {
      if (clean) {
        self.store.peekAll('user').removeObject(clean);
        clean.deleteRecord();
      }
    });

    cleanProjects.forEach(function (clean) {
      if (clean) {
        self.get('projects').removeObject(clean);
        clean.deleteRecord();
      }
    });

    cleanVms.forEach(function (clean) {
      if (clean) {
        self.store.peekAll('vm').removeObject(clean);
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

  // return true if current user is admin
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

  // Check if current user can create project
  isProjectCreate: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    if (access_level === 50) { return true; }

    return this.get('session').get('data.authenticated.user.is_project_create');
  }.property('session.data.authenticated.access_level'),

  // actions binding with user event
  actions: {
    // change listing page
    changePage: function(cp) {
      this.set('currentPage', cp);
      this.prepareList();
    },

    // close deletes modal
    closeDeleteModal: function() {
      this.set('isShowingDeleteConfirmation', false);
      this.set('isBusy', false);
    },

    // open detail modal for targetted project (with projectId parameter)
    showDetails: function(projectId) {
      this.set('isShowingDetails', projectId);
      this.set('isBusy', true);
    },

    // action for delete event
    deleteItems: function() {
      var router = this.get('router');
      var self = this;
      var items = this.get('projects').filterBy('todelete', true);
      var pass = function(){};
      var fail = function(){ router.transitionTo('error'); };

      // Delete project and vms associated
      items.forEach(function(model) {
        if (model && model.get('todelete')) {
          model.get('vms').forEach(function(vm) {
            if (vm) {
              vm.get('user').get('vms').removeObject(vm);
              self.store.peekAll('vm').removeObject(vm);
              vm.destroyRecord().then(pass, fail);
            }
          });

          model.get('users').forEach(function(user) {
            if (user) {
              user.get('projects').removeObject(model);
            }
          });

          model.get('brand').get('projects').removeObject(model);
          self.get('projects').removeObject(model);
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
      var items = this.get('projects').filterBy('todelete', true);
      var deleteItems = [];

      for(var i=0; i<items.length; i++) {
        deleteItems.push(items[i].get('brand').get('name') + ' - ' + items[i].get('name'));
      }

      if (deleteItems.length > 0) {
        this.set('deleteItems', deleteItems);
        this.set('isShowingDeleteConfirmation', true);
      }
    },

    // Action for add a new item, change current page to create form
    newItem: function() {
      var router = this.get('router');
      router.transitionTo('projects.new');
    }
  }
});