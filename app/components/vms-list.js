import Ember from 'ember';
import config from '../config/environment';

/**
 *  This component manages vms list
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class VmsList
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Hide users list for all vms lines
     *
     *  @event hideAllUsersList
     */
    hideAllUsersList: function() {
      this.get('vms').map(function(model){
        model.set('isUserList', false);
      });
    },

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
     *  Display the users list for a targetted vm
     *
     *  @event showUserList
     *  @param {Vm} the vm object targetted
     */
    showUserList: function(vm) {
      this.get('vms').map(function(model){
        model.set('isUserList', false);
      });

      vm.set('isUserList', true);
    },

    /**
     *  Change user for the targetted vm
     *
     *  @event changeUser
     *  @param {Vm} the vm object targetted
     *  @param {user} the new user associated with the vm
     */
    changeUser: function(vm, user) {
      var self = this;

      this.set('isBusy', true);

      this.set('loadingModal', true);
      this.set('messageUser', '<p style="text-align: left;"><b>Vm</b> ' +
               vm.get('name').replace(/\..*/g, '') + '<br/><b>From</b> ' +
               vm.get('user').get('email') + '<br/><b>To</b> ' +
               user.get('email') + "<br/></p>");
      vm.set('user', user);

      vm.save().then(function (){
        self.set('loadingModal', false);
        self.set('messageUser', '');
        self.set('isBusy', false);
      });
    },

    /**
     *  Display the details modal for a targetted vm
     *
     *  @event showDetails
     *  @param {Vm} the vm object targetted
     */
    showDetails: function(vm) {
      this.set('vmSelected', vm);
      this.set('isShowingDetails', true);
      this.set('isBusy', true);

      if (!this.get('isReload')) {
        this.reloadVm();
      }
    },

    /**
     *  Display the settings modal for a targetted vm
     *
     *  @event showSettings
     *  @param {Vm} the vm object targetted
     */
    showSettings: function(vm) {
      this.set('vmSelected', vm);
      this.set('isShowingSettings', true);
      this.set('isBusy', true);

      if (!this.get('isReload')) {
        this.reloadVm();
      }
    },

    /**
     *  Display rollover message for a targetted vm
     *
     *  @event showHover
     *  @param {vmId} the vm id targetted
     */
    showHover: function(vmId) {
      this.set('isShowingHovers', vmId);
    },

    /**
     *  Hide rollover message
     *
     *  @event closeHover
     */
    closeHover: function() {
      this.set('isShowingHovers', -1);
    },

    /**
     *  Display the uris & tools modal for a targetted vm
     *
     *  @event showUris
     *  @param {Vm} the vm object targetted
     */
    showUris: function(vm) {
      var self = this;

      this.set('vmSelected', vm);
      this.set('isBusy', true);

      Ember.run.later(function(){
        self.set('isShowingUris', true);
      }, 500);
    },

    /**
     *  Display the io (import/export) modal from targetted vm
     *
     *  @event showIO
     *  @param {Vm} the vm object targetted
     */
    showIO: function(vm) {
      this.set('vmSelected', vm);
      this.set('isShowingIO', true);
      this.set('isBusy', true);
    },

    /**
     *  Display the monitor modal from targetted vm
     *
     *  @event showMonitor
     *  @param {Vm} the vm object targetted
     */
    showMonitor: function(vm) {
      this.set('vmSelected', vm);
      this.set('isShowingMonitor', true);
      this.set('isBusy', true);
    },

    /**
     *  Display the supervise modal from targetted vm
     *
     *  @event showSupervise
     *  @param {Vm} the vm object targetted
     */
    showSupervise: function(vm) {
      this.set('vmSelected', vm);
      this.set('isShowingSupervise', true);
      this.set('isBusy', true);
    },

    /**
     *  Display the vnc terminal modal from targetted vm
     *
     *  @event openVnc
     *  @param {Vm} the vm object targetted
     */
    openVnc: function(vm) {
      var self = this;

      this.set('vmSelected', vm);
      this.set('isShowingVnc', true);
      this.set('isBusy', true);

      this.get('vmSelected').reload().then(function (vmVnc) {
        self.set('vncUrl', vmVnc.get('vnc_url'));
        self.set('vncPassword', vmVnc.get('termpassword'));
        self.set('vncLayout', vmVnc.get('layout'));

        if (!self.get('isReload')) {
          self.reloadVm();
        }
      });
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
     *  Request the running status of a vm
     *
     *  @event checkStatus
     *  @param {Vm} the vm object targetted
     */
    checkStatus: function(vm) {
      var vmId = vm.get('id');
      var self = this;

      // jquery get setupcomplete
      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/vms/" + vmId + "/setupcomplete",
        global: false,
        headers: {
          'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token')
        }
      })
      .done(function(data) {
        vm.set('status', data);
        vm.set('timeStatus', data);
        vm.set('textStatus', 'RUN');
        vm.set('sucStatus', true);
        vm.set('warnStatus', false);
        vm.set('dangStatus', false);
        vm.set('nanStatus', false);

        self.get('store').findRecord('vm', vm.get('id')).then(function (vmRecord) {
          vmRecord.set('thumb', vmRecord.get('thumb'));
        });
      })
      .fail(function(data) {
        if (data.status === 410) {
          vm.set('status', data.responseText);
          vm.set('timeStatus', -parseInt(data.responseText));

          // check if error or setup
          if (parseInt(data.responseText) === 1) {
            vm.set('textStatus', 'ERROR');
            vm.set('sucStatus', false);
            vm.set('warnStatus', false);
            vm.set('dangStatus', true);
            vm.set('nanStatus', false);
          } else {
            vm.set('textStatus', 'SETUP');
            vm.set('sucStatus', false);
            vm.set('warnStatus', true);
            vm.set('dangStatus', false);
            vm.set('nanStatus', false);
          }
        } else {
          vm.set('status', 0);
          vm.set('timeStatus', 0);

          vm.set('textStatus', 'ERROR');
          vm.set('sucStatus', false);
          vm.set('warnStatus', false);
          vm.set('dangStatus', false);
          vm.set('nanStatus', true);
        }
      });
    },

    /**
     *  Submit delete event
     *
     *  @event deleteItems
     */
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
    },

    /**
     *  Display delete confirmation modal
     *
     *  @event showDeleteConfirmation
     */
    showDeleteConfirmation: function() {
      var items = this.get('vms').filterBy('todelete', true);
      var deleteItems = [];

      for(var i = 0; i < items.length; i++) {
        deleteItems.push(items[i].get('name') + ", user:" + items[i].get('user').get('email'));
      }

      if (deleteItems.length > 0) {
        this.set('isBusy', true);
        this.set('deleteItems', deleteItems);
        this.set('isShowingDeleteConfirmation', true);
      }
    },

    /**
     *  Go to vm creation form
     *
     *  @event newItem
     */
    newItem: function() {
      var router = this.get('router');

      if (this.get('isJenkins')) {
        router.transitionTo('cis.new');
      } else {
        router.transitionTo('vms.new');
      }
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
   *  Flag to show the vnc terminal modal
   *
   *  @property isShowingVnc
   *  @type {Boolean}
   */
  isShowingVnc: false,

  /**
   *  Flag to show the uris modal
   *
   *  @property isShowingUris
   *  @type {Boolean}
   */
  isShowingUris: false,

  /**
   *  Flag to show the import/export modal
   *
   *  @property isShowingIO
   *  @type {Boolean}
   */
  isShowingIO: false,

  /**
   *  Flag to show the graph monitor modal
   *
   *  @property isShowingMonitor
   *  @type {Boolean}
   */
  isShowingMonitor: false,

  /**
   *  Flag to show the details vm modal
   *
   *  @property isShowingDetails
   *  @type {Boolean}
   */
  isShowingDetails: false,

  /**
   *  Flag to show the settings vm modal
   *
   *  @property isShowingSettings
   *  @type {Boolean}
   */
  isShowingSettings: false,

  /**
   *  Flag to show the supervise vm modal
   *
   *  @property isShowingSupervise
   *  @type {Boolean}
   */
  isShowingSupervise: false,

  /**
   *  Flag to set a reload state record for a vm
   *
   *  @property isReload
   *  @type {Boolean}
   */
  isReload: false,

  /**
   *  Store the current selected vm object
   *
   *  @property vmSelected
   *  @type {Vm}
   */
  vmSelected: null,

  /**
   *  Flag to show the loading modal
   *
   *  @property loadingModal
   *  @type {Boolean}
   */
  loadingModal: false,

  /**
   *  Flag to set the statusloop running state
   *
   *  @property checkStatusLoop
   *  @type {Boolean}
   */
  checkStatusLoop: false,

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
   *  Check if current user is admin or lead
   *
   *  @function isLead
   *  @returns {Boolean} True if admin or lead
   */
  isLead: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel >= 40) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Check if current user is admin, lead, or dev
   *
   *  @function isDev
   *  @returns {Boolean} True if admin, lead, or dev
   */
  isDev: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel >= 30) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Check if current user is admin, lead, dev, or ProjectManager
   *
   *  @function isPM
   *  @returns {Boolean} True if admin, lead, dev, or pm
   */
  isPM: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel >= 20) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Check if current user can launch vm
   *
   *  @function isVm
   *  @returns {Boolean}
   */
  isVm: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');
    var isJenkins = this.get('isJenkins');

    if (isJenkins && accessLevel >= 40) {
      return true;
    }

    if (!isJenkins && accessLevel >= 20) {
      return true;
    }

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
    if (!this.get('loadingModal') && !this.get('isBusy')) {
      this.cleanModel();
      this.prepareList();
    }

    if (!this.get('checkStatusLoop')) {
      this.checkAllStatus();
    }
  },

  /**
   *  Delete records unsaved or deleted
   *
   *  @method cleanModel
   */
  cleanModel: function() {
    var self = this;
    var cleanUsers = this.store.peekAll('user').filterBy('isDeleted', true);
    var cleanVms = this.get('vms').filterBy('isDeleted', true);
    var cleanProjects = this.store.peekAll('project').filterBy('isDeleted', true);
    var cleanBrands = this.store.peekAll('brand').filterBy('isDeleted', true);
    var cleanUris = this.store.peekAll('uri').filterBy('isDeleted', true);

    cleanUsers.forEach(function (clean) {
      if (clean) { self.store.peekAll('user').removeObject(clean); }
    });

    cleanProjects.forEach(function (clean) {
      if (clean) { self.store.peekAll('project').removeObject(clean); }
    });

    cleanVms.forEach(function (clean) {
      if (clean) { self.get('vms').removeObject(clean); }
    });

    cleanUris.forEach(function (clean) {
      if (clean) { self.store.peekAll('uri').removeObject(clean); }
    });

    cleanBrands.forEach(function (clean) {
      if (clean) { self.store.peekAll('brand').removeObject(clean); }
    });

    cleanUsers = this.store.peekAll('user').filterBy('id', null);
    cleanVms = this.get('vms').filterBy('id', null);
    cleanBrands = this.store.peekAll('brand').filterBy('id', null);
    cleanProjects = this.store.peekAll('project').filterBy('id', null);
    cleanUris = this.store.peekAll('uri').filterBy('id', null);

    cleanUris.forEach(function (clean) {
      if (clean) {
        self.store.peekAll('uri').removeObject(clean);
        clean.deleteRecord();
      }
    });

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

  /**
   *  Prepare and format vms list
   *
   *  @method prepareList
   */
  prepareList: function() {
    var userId = parseInt(this.get('userId'));
    var projectId = parseInt(this.get('projectId'));
    var search = this.get('search');
    var cp = this.get('currentPage') || 1;
    var ncp = 1;
    var ibp = 0;
    var j = 1;
    var currentUserId = this.get('session').get('data.authenticated.user.id');
    var ibpmax = this.get('store').peekRecord('user', currentUserId).get('nbpages');
    var pages = [];
    var pagesLine = [];
    var ncp2;

    this.set('loadingModal', false);

    this.get('vms').map(function(model){
      var textStatus = '';
      var warnStatus = false;
      var dangStatus = false;
      var sucStatus = false;
      var status = parseInt(model.get('status'));
      var day = '';
      var month = '';
      var year = '';
      var hour = '';
      var minute = '';
      var branchName = '';
      var today = new Date();

      // reset delete state
      model.set('todelete', false);

      // by default userlist is hidden
      model.set('isUserList', false);

      // check if current model is reliable
      if (!model.get('commit') ||
          !model.get('commit.id') ||
          !model.get('user') ||
          !model.get('user.email') ||
          !model.get('project') ||
          !model.get('project.id')) {
        model.set('isShow', false);
        return;
      }

      model.set('isOk', true);
      model.get('supervises').forEach(function(supervise) {
        if (!supervise.get('status')) {
          model.set('isOk', false);
        }
      });

      // weird issue with ember nested model data, so get branchname from commit id
      branchName = model.get('commit.id').replace(/^[0-9][0-9]*-/,'').replace(/-[^-]*$/,'');
      model.set('branch', branchName.substring(0,22));

      // init vm date value
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
        model.set('created_at_short', hour + "h" + minute);
      } else {
        if (parseInt(day) < 10) { day = '0' + day; }
        if (parseInt(month) < 10) { month = '0' + month; }
        year = year + '';
        model.set('created_at_short', year.substring(2) + "/" + month + "/" + day);
      }

      // init status field
      if (status < 1) {
        textStatus = 'SETUP';
        warnStatus = true;
        // if status is negative => setup in progress
        model.set('timeStatus', -(status));
      }
      else if (status > 1) {
        textStatus = 'RUN';
        sucStatus = true;
        model.set('timeStatus', (status));
      } else {
        textStatus = 'ERROR';
        dangStatus = true;
      }

      model.set('textStatus', textStatus);
      model.set('sucStatus', sucStatus);
      model.set('warnStatus', warnStatus);
      model.set('dangStatus', dangStatus);
      model.set('nanStatus', false);

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
            !new RegExp("^.*" + search + ".*$").test(model.get('topic')) &&
            !new RegExp("^.*" + search + ".*$").test(model.get('name')) &&
            !new RegExp("^.*" + search + ".*$").test(model.get('project.name')) &&
            !new RegExp("^.*" + search + ".*$").test(model.get('user.email')) &&
            !new RegExp("^.*" + search + ".*$").test(model.get('user.firstname')) &&
            !new RegExp("^.*" + search + ".*$").test(model.get('user.lastname')) &&
            !new RegExp("^.*" + search + ".*$").test(model.get('systemimage.name')) &&
            !new RegExp("^.*" + search + ".*$").test(model.get('floating_ip'))) {
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
          pages.addObject(
            Ember.Object.create({cp: ncp, current: ncp === cp, partial: false})
          );
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
   *  Loop function who update vms status
   *
   *  @method checkAllStatus
   */
  checkAllStatus: function() {
    var self = this;

    if (self) {
      self.set('checkStatusLoop', true);
    } else {
      return;
    }

    this.get('vms').map(function(model){
      // check if current model is reliable
      if (!model.get('commit') ||
          !model.get('commit.id') ||
          !model.get('user') ||
          !model.get('user.email') ||
          !model.get('project') ||
          !model.get('project.id')) {
        return;
      }

      if (parseInt(model.get('status')) < 1) {
        // jquery get setupcomplete
        Ember.$.ajax({
          url: config.APP.APIHost + "/api/v1/vms/" + model.get('id') + "/setupcomplete",
          global: false,
          async: false,
          headers: {
            'Authorization': 'Token token=' + self.get('session').get('data.authenticated.token')
          }
        })
        .done(function(data) {
          model.set('status', data);
          model.set('timeStatus', data);
          model.set('textStatus', 'RUN');
          model.set('sucStatus', true);
          model.set('warnStatus', false);
          model.set('dangStatus', false);
          self.get('store').findRecord('vm', model.get('id')).then(function (vm) {
            model.set('thumb', vm.get('thumb'));
          });
        })
        .fail(function(data) {
          if (data.status === 410) {
            model.set('status', data.responseText);
            model.set('timeStatus', -parseInt(data.responseText));

            // check if error or setup
            if (parseInt(data.responseText) === 1) {
              model.set('textStatus', 'ERROR');
              model.set('sucStatus', false);
              model.set('warnStatus', false);
              model.set('dangStatus', true);
              model.set('nanStatus', false);
            } else {
              model.set('textStatus', 'SETUP');
              model.set('sucStatus', false);
              model.set('warnStatus', true);
              model.set('dangStatus', false);
              model.set('nanStatus', false);
            }
          } else if (data.status === 404) {
            self.get('router.router').refresh();
            return;
          } else {
            model.set('status', 0);
            model.set('timeStatus', 0);

            model.set('textStatus', 'ERROR');
            model.set('sucStatus', false);
            model.set('warnStatus', false);
            model.set('dangStatus', false);
            model.set('nanStatus', true);
          }
        });
      }
    });

    Ember.run.later(function() {
      self.checkAllStatus();
    }, 30000);
  },

  /**
   *  Reload from server the selected vm object
   *
   *  @method reloadVm
   */
  reloadVm: function() {
    var self = this;
    var vm = this.get('vmSelected');

    self.set('isReload', true);

    // reload models for vnc and details popin (refresh password)
    if (this.get('isShowingVnc') || this.get('isShowingDetails')) {
      vm.reload().then(function (vmRel) {
        self.set('vncPassword', vmRel.get('termpassword'));

        Ember.run.later(function(){
          self.reloadVm();
        }, 10000);
      });
    }

    self.set('isReload', false);
  },

  /**
   *  Hide the users list for a targetted vm
   *
   *  @method hideUserList
   *  @param {Vm} the vm object targetted
   */
  hideUserList: function(vm) {
    vm.set('isUserList', false);
  },
});
