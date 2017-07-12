import Ember from 'ember';

/**
 *  This component manages the projects list
 *
 *  @module components/projects-list
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  /**
   *  Sort property for projects list
   *
   *  @type {String[]}
   */
  computeSorting: ['created_at:desc'],

  /**
   *  Array of projects sorted
   *
   *  @type {Project[]}
   */
  projectsSort: Ember.computed.sort('projects', 'computeSorting'),

  actions: {
    /**
     *  Change the current page of the list
     *
     *  @function
     *  @param {Integer} cp The new page number
     */
    changePage: function(cp) {
      this.set('currentPage', cp);
      this.prepareList();
    },

    /**
     *  Close deletes modal
     *
     *  @function
     */
    closeDeleteModal: function() {
      this.set('isShowingDeleteConfirmation', false);
      this.set('isBusy', false);
    },

    /**
     *  Open detail modal for targetted project
     *
     *  @function
     *  @param {Project} project Target for details modal
     */
    showDetails: function(project) {
      this.set('projectSelected', project);
      this.set('isBusy', true);
      this.reloadProject();
    },

    /**
     *  Submit delete event
     *
     *  @function
     */
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

    /**
     *  Display delete confirmation modal
     *
     *  @function
     */
    showDeleteConfirmation: function() {
      var items = this.get('projects').filterBy('todelete', true);
      var deleteItems = [];

      for(var i = 0; i < items.length; i++) {
        deleteItems.push(items[i].get('brand').get('name') + ' - ' + items[i].get('name'));
      }

      if (deleteItems.length > 0) {
        this.set('deleteItems', deleteItems);
        this.set('isShowingDeleteConfirmation', true);
      }
    },

    /**
     *  Go to project creation form
     *
     *  @function
     */
    newItem: function() {
      var router = this.get('router');
      router.transitionTo('projects.new');
    }
  },

  /**
   *  Flag to show the delete confirm modal
   *
   *  @type {Boolean}
   */
  isShowingDeleteConfirmation: false,

  /**
   *  Project targetted for an action or a modal
   *
   *  @type {Project}
   */
  projectSelected: null,

  /**
   *  Flag to show the project details modal
   *
   *  @type {Boolean}
   */
  isShowingDetails: false,

  /**
   *  Check if current user is admin
   *
   *  @function
   *  @returns {Boolean} True if admin
   */
  isAdmin: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level === 50) {
      return true;
    }
    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Flag to show the delete confirm modal
   *
   *  @type {Boolean}
   */
  isLead: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 40) {
      return true;
    }
    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Check if current user can create project
   *
   *  @function
   *  @returns {Boolean} True if he can
   */
  isProjectCreate: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level === 50) {
      return true;
    }

    return this.get('session').get('data.authenticated.user.is_project_create');
  }.property('session.data.authenticated.access_level'),

  /**
   *  Trigger when receives models
   *
   *  @function
   */
  didReceiveAttrs() {
    this._super(...arguments);
    this.cleanModel();
    this.prepareList();
  },

  /**
   *  Prepare and format projects list
   *
   *  @function
   */
  prepareList: function() {
    var userId = parseInt(this.get('userId'));
    var brandId = parseInt(this.get('brandId'));
    var projects = this.get('projects').filterBy('created_at');
    var day = '';
    var month = '';
    var year = '';
    var hour = '';
    var minute = '';
    var search = this.get('search');
    var cp = this.get('currentPage') || 1;
    var ncp = 1;
    var ncp2 = 0;
    var ibp = 0;
    var j = 1;
    var current_user_id = this.get('session').get('data.authenticated.user.id');
    var ibpmax = this.get('store').peekRecord('user', current_user_id).get('nbpages');
    var pages = [];
    var pagesLine = [];
    var framework = '';
    var today = new Date();

    // filter projects array only with valid item for current user
    projects.map(function(model){
      // check if current model is reliable
      if (!model.get('brand') ||
          !model.get('brand.id')) {
        model.set('isShow', false);
        return;
      }

      // add prefix to gitpath
      model.set('gitpath_href', "git@" + model.get('gitpath'));

      // init date value
      day = model.get('created_at').getDate();
      month = model.get('created_at').getMonth() + 1;
      year = model.get('created_at').getFullYear();
      hour = model.get('created_at').getHours();
      minute = model.get('created_at').getMinutes();

      if (today.getDate() === day &&
          today.getMonth() + 1 === month &&
          today.getFullYear() === year) {
        if (parseInt(hour) < 10) { hour = '0' + hour; }
        if (parseInt(minute) < 10) { minute = '0' + minute; }
        model.set('created_at_short', hour + ":" + minute);
      } else {
        if (parseInt(day) < 10) { day = '0' + day; }
        if (parseInt(month) < 10) { month = '0' + month; }
        year = year + '';
        model.set('created_at_short', year.substring(2) + "/" + month + "/" + day);
      }

      // filter project listing with brand, user, search field, and current page value
      model.set('isShow', true);

      // if brandId parameter exists
      if (brandId !== 0) {
        if (parseInt(model.get('brand.id'), 10) !== brandId) {
          model.set('isShow', false);
        }
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

      // if brand object is null, the project had been deleted
      if (!model.get('brand')) {
        model.set('isShow', false);
      }

      // paging system
      if (model.get('isShow')) {
        model.set('countVms', model.get('vms').filterBy('is_jenkins', false).toArray().length);
        model.set('countCis', model.get('vms').filterBy('is_jenkins', true).toArray().length);

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

    // Set paging numbern with no more 8 paging numbers
    this.set('previousPage', false);
    this.set('nextPage', false);
    if (pages.length > 1) {
      if (pages.length < 9) {
        pagesLine = pages;
      } else {
        pagesLine[0] = pages[0];

        ncp2 = cp >= 4 ? (cp-1) : 3;
        ncp2 = (ncp2 <= pages.length - 5) ? ncp2 : pages.length - 5;

        if (ncp2 !== 3) {
          pagesLine[0].set('partial', true);
        }

        for (var i = 1; i < 7; i++) {
          if (ncp2 !== 3 && i === 1 ||
              ncp2 !== pages.length - 5 && i === 6) {
                continue;
          }
          pagesLine[j++] = pages[(ncp2-3)+i];
        }
        pagesLine[j] = pages[pages.length - 1];

        if (ncp2 !== pages.length - 5) {
          pagesLine[pagesLine.length - 2].set('partial', true);
        }
      }
      this.set('pages', pagesLine);

      // Set previous and next page
      if (cp !== pagesLine[0].cp) {
        this.set('previousPage', cp - 1);
      }

      if (cp !== pagesLine[pagesLine.length - 1].cp) {
        this.set('nextPage', cp + 1);
      }
    } else {
      this.set('pages', []);
    }
  }.observes('refreshList'),

  /**
   *  Delete records unsaved or deleted
   *
   *  @function
   */
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

  /**
   *  Reload from server the selected project
   *
   *  @function
   */
  reloadProject: function() {
    var self = this;
    var project = this.get('projectSelected');

    project.reload().then(function () {
      self.set('isShowingDetails', true);
    });
  }
});
