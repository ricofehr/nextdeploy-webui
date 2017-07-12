import Ember from 'ember';

/**
 *  This component manages users list
 *
 *  @module components/users-list
 *  @augments ember/Component
 */
export default Ember.Component.extend({
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
     *  Submit delete event
     *
     *  @function
     */
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
              self.store.peekAll('vm').removeObject(vm);
              vm.destroyRecord().then(pass, fail);
            }
          });

          model.get('sshkeys').forEach(function(sshkey) {
            if (sshkey) {
              self.store.peekAll('sshkey').removeObject(sshkey);
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

    /**
     *  Display delete confirmation modal
     *
     *  @function
     */
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

    /**
     *  Go to user creation form
     *
     *  @function
     */
    newItem: function() {
      var router = this.get('router');
      router.transitionTo('users.new');
    },
  },

  /**
   *  Flag to show the delete confirm modal
   *
   *  @type {Boolean}
   */
  isShowingDeleteConfirmation: false,

  /**
   *  Return the current user in session
   *
   *  @function
   *  @returns {User} the session user object
   */
  currentUser: function() {
    return this.get('session').get('data.authenticated.user');
  }.property('session.data.authenticated.user.id'),

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
   *  Check if current user is admin or lead
   *
   *  @function
   *  @returns {Boolean} True if admin or lead
   */
  isLead: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 40) {
      return true;
    }

    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Check if current user is admin or lead or dev
   *
   *  @function
   *  @returns {Boolean} True if admin or lead or dev
   */
  isDev: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 30) {
      return true;
    }

    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Check if current user is admin, lead, dev, or ProjectManager
   *
   *  @function
   *  @returns {Boolean} True if admin, lead, dev, or pm
   */
  isPM: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 20) {
      return true;
    }

    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Check if current user can create user
   *
   *  @function
   *  @returns {Boolean} True if he can
   */
  isUserCreate: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level === 50) {
      return true;
    }

    return this.get('session').get('data.authenticated.user.is_user_create');
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
   *  Prepare and format users list
   *
   *  @function
   */
  prepareList: function() {
    var groupId = parseInt(this.get('groupId'));
    var projectId = parseInt(this.get('projectId'));
    var firstUser = null;
    var search = this.get('search');
    var cp = this.get('currentPage') || 1;
    var ncp = 1;
    var ncp2 = 1;
    var ibp = 0;
    var j = 1;
    var pages = [];
    var pagesLine = [];
    var current_id = this.get('session').get('data.authenticated.user.id');
    var access_level = this.get('session').get('data.authenticated.access_level');
    var current_user_id = this.get('session').get('data.authenticated.user.id');
    var ibpmax = this.get('store').peekRecord('user', current_user_id).get('nbpages');

    firstUser = this.store.peekRecord('user', current_id);
    if (firstUser) {
      this.get('users').removeObject(firstUser);
      this.get('users').unshiftObject(firstUser);
    }

    this.get('users').map(function(model){
      var user_id = parseInt(model.get('id'));

      // check if current model is reliable
      if (!model.get('group') ||
          !model.get('group.name')) {
        model.set('isShow', false);
        return;
      }

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
        if (!new RegExp("^.*" + search + ".*$", 'i').test(model.get('email')) &&
            !new RegExp("^.*" + search + ".*$", 'i').test(model.get('firstname')) &&
            !new RegExp("^.*" + search + ".*$", 'i').test(model.get('group.name')) &&
            !new RegExp("^.*" + search + ".*$", 'i').test(model.get('lastname'))) {
          model.set('isShow', false);
        }
      }

      // filtering for other users than admin
      if (access_level !== 50) {
        if (!model.get('projects').toArray().length) {
          model.set('isShow', false);
        }
      }

      // if group object is null, the user was deleted
      if (!model.get('group')) {
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

      model.set('isCurrent', (user_id === current_id));
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
  }
});
