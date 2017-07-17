import Ember from 'ember';

/**
 *  This component manages the list of brands
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class BrandsList
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Change the current page of the list
     *
     *  @event changePage
     *  @param {Integer} cp The new page number
     */
    changePage: function(cp) {
      this.set('currentPage', cp);
      this.prepareList();
    },

    /**
     *  Close deletes modal
     *
     *  @event closeDeleteModal
     */
    closeDeleteModal: function() {
      this.set('isShowingDeleteConfirmation', false);
      this.set('isBusy', false);
    },

    /**
     *  Submit delete event
     *
     *  @event deleteItems
     */
    deleteItems: function() {
      var router = this.get('router');
      var items = this.get('brands').filterBy('todelete', true);
      var self = this;
      var pass = function(){};
      var fail = function(){
        router.transitionTo('error');
      };

      items.forEach(function(model) {
        if (model && model.get('todelete')) {
          // delete recursively projects and vms
          model.get('projects').forEach(function(project) {
            if (project) {
              project.destroyRecord().then(pass, fail);

              project.get('vms').forEach(function(vm) {
                if (vm) {
                  vm.destroyRecord().then(pass, fail);
                  vm.get('user').get('vms').removeObject(vm);
                  self.get('vms').removeObject(vm);
                }
              });

              project.get('users').forEach(function(user) {
                if (user) {
                  user.get('projects').removeObject(project);
                }
              });

              project.destroyRecord().then(pass, fail);
              self.get('projects').removeObject(project);
            }
          });

          model.destroyRecord().then(pass, fail);
          self.get('brands').removeObject(model);
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
     *  @event showDeleteConfirmation
     */
    showDeleteConfirmation: function() {
      var items = this.get('brands').filterBy('todelete', true);
      var deleteItems = [];

      for(var i = 0; i < items.length; i++) {
        deleteItems.push(items[i].get('name'));
      }

      if (deleteItems.length > 0) {
        this.set('isBusy', true);
        this.set('deleteItems', deleteItems);
        this.set('isShowingDeleteConfirmation', true);
      }
    },

    /**
     *  Go to brand creation form
     *
     *  @event newItem
     */
    newItem: function() {
      var router = this.get('router');
      router.transitionTo('brands.new');
    }
  },

  /**
   *  Flag to show the delete confirm modal
   *
   *  @property isShowingDeleteConfirmation
   *  @type {Boolean}
   */
  isShowingDeleteConfirmation: false,

  /**
   *  Check if current user is admin
   *
   *  @function isAdmin
   *  @returns {Boolean} True if admin
   */
  isAdmin: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel === 50) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Trigger when receives models
   *
   *  @method didReceiveAttrs
   */
  didReceiveAttrs() {
    this._super(...arguments);

    // avoid recompute list during user change
    if (!this.get('isBusy')) {
      this.cleanModel();
      this.prepareList();
    }
  },

  /**
   *  Prepare and format brands list
   *
   *  @method prepareList
   */
  prepareList: function() {
    var search = this.get('search');
    var cp = this.get('currentPage') || 1;
    var ncp = 1;
    var ncp2 = 0;
    var ibp = 0;
    var j = 1;
    var currentUserId = this.get('session').get('data.authenticated.user.id');
    var ibpmax = this.get('store').peekRecord('user', currentUserId).get('nbpages');
    var pages = [];
    var pagesLine = [];

    this.get('brands').map(function(model){
      // reset delete state
      model.set('todelete', false);

      // can be deleted state
      model.set('canBeDeleted', false);
      if (model.get('projects').toArray().length === 0) {
        model.set('canBeDeleted', true);
      }

      // Filtering item display with search field and paging system
      model.set('isShow', true);
      if (search) {
        if (!new RegExp("^.*" + search + ".*$", 'i').test(model.get('name'))) {
          model.set('isShow', false);
        }
      }

     // Paging system
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

    // Set paging list with no more 8 paging numbers
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
   *  @method cleanModel
   */
  cleanModel: function() {
    var self = this;
    var cleanProjects = this.store.peekAll('project').filterBy('isDeleted', true);
    var cleanBrands = this.get('brands').filterBy('isDeleted', true);

    cleanProjects.forEach(function (clean) {
      if (clean) { self.store.peekAll('project').removeObject(clean); }
    });

    cleanBrands.forEach(function (clean) {
      if (clean) { self.store.peekAll('brand').removeObject(clean); }
    });

    cleanBrands = this.get('brands').filterBy('id', null);
    cleanProjects = this.store.peekAll('project').filterBy('id', null);

    cleanProjects.forEach(function (clean) {
      if (clean) {
        self.store.peekAll('project').removeObject(clean);
        clean.deleteRecord();
      }
    });

    cleanBrands.forEach(function (clean) {
      if (clean) {
        self.store.peekAll('brand').removeObject(clean);
        clean.deleteRecord();
      }
    });
  }
});
