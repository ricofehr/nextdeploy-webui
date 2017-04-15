import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  // Show / hide on html side
  isAllDelete: false,
  isShowingDeleteConfirmation: false,
  isShowingVnc: false,
  isShowingUris: false,
  isShowingIO: false,
  isShowingMonitor: false,
  isShowingDetails: false,
  isShowingSettings: false,
  isShowingSupervise: false,
  isReload: false,
  vmSelected: null,
  loadingModal: false,
  checkStatusLoop: false,

  // trigger when model changes
  didReceiveAttrs() {
    this._super(...arguments);

    // avoid recompute list during user change
    if (!this.get('loadingModal') || !this.get('isBusy')) {
      this.cleanModel();
      this.prepareList();
    }

    if (!this.get('checkStatusLoop')) {
      this.checkAllStatus();
    }
  },

  // format vms list
  prepareList: function() {
    var userId = parseInt(this.get('userId'));
    var projectId = parseInt(this.get('projectId'));
    var search = this.get('search');
    var cp = this.get('currentPage') || 1;
    var ncp = 1;
    var ibp = 0;
    var j = 1;
    var current_user_id = this.get('session').get('data.authenticated.user.id');
    var ibpmax = this.get('store').peekRecord('user', current_user_id).get('nbpages');
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
        if (parseInt(month) < 10) { month = '0' + month; }
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
          pages.addObject(Ember.Object.create({cp: ncp, current: ncp === cp, partial: false}));
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
    // max 8 paging numbers
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

  // check all status
  checkAllStatus: function() {
    var self = this;

    if (self) {
      self.set('checkStatusLoop', true);
    } else {
      return;
    }

    this.get('vms').map(function(model){
      if (parseInt(model.get('status')) < 1) {
        // jquery get setupcomplete
        Ember.$.ajax({
          url: config.APP.APIHost + "/api/v1/vms/" + model.get('id') + "/setupcomplete",
          global: false,
          async: false,
          headers: { 'Authorization': 'Token token=' + self.get('session').get('data.authenticated.token') }
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
    }, 15000);
  },

  // delete records unsaved or deleted
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

  // Check if current user can launch vm
  isVm: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 20) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  // reload selected vm object
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

  settingVnc: function() {
    var self = this;

    if (this.get('isShowingVnc')) {
      this.get('vmSelected').reload().then(function (vmVnc) {
        self.set('vncUrl', vmVnc.get('vnc_url'));
        self.set('vncPassword', vmVnc.get('termpassword'));
        self.set('vncLayout', vmVnc.get('layout'));
      });

      if (!this.get('isReload')) {
        this.reloadVm();
      }
    }
  }.observes('isShowingVnc'),

  // reset to delete flag
  resetDelete: function() {
    this.get('vms').setEach('todelete', false);
    this.set('isAllDelete', false);
  }.observes('search', 'projectId', 'userId', 'currentPage'),

  // hide userlist
  hideUserList: function(vm) {
    vm.set('isUserList', false);
  },

  // actions binding with user event
  actions: {
    // hide all userlist
    hideAllUsersList: function() {
      this.get('vms').map(function(model){
        model.set('isUserList', false);
      });
    },

    // change page action
    changePage: function(cp) {
      this.set('currentPage', cp);
      this.prepareList();
    },

    // display userlist
    showUserList: function(vm) {
      this.get('vms').map(function(model){
        model.set('isUserList', false);
      });

      vm.set('isUserList', true);
    },

    // change user
    changeUser: function(vm, user) {
      var self = this;

      this.set('isBusy', true);

      this.set('loadingModal', true);
      this.set('messageUser', '<p style="text-align: left;"><b>Vm</b> ' + vm.get('name').replace(/\..*/g, '') + '<br/><b>From</b> ' + vm.get('user').get('email') +
        '<br/><b>To</b> ' + user.get('email') + "<br/></p>");
      vm.set('user', user);

      vm.save().then(function (){
        self.set('loadingModal', false);
        self.set('messageUser', '');
        self.set('isBusy', false);
      });
    },

    // open detail modal for targetted vm (vmId parameter)
    showDetails: function(vm) {
      this.set('vmSelected', vm);
      this.set('isShowingDetails', true);
      this.set('isBusy', true);

      if (!this.get('isReload')) {
        this.reloadVm();
      }
    },

    // open detail modal for targetted vm (vmId parameter)
    showSettings: function(vm) {
      this.set('vmSelected', vm);
      this.set('isShowingSettings', true);
      this.set('isBusy', true);

      if (!this.get('isReload')) {
        this.reloadVm();
      }
    },

    // open rollover modal for targetted vm
    showHover: function(vmId) {
      this.set('isShowingHovers', vmId);
    },

    // close the modal, reset showing variable
    closeHover: function() {
      this.set('isShowingHovers', -1);
    },

    // open uris modal from targetted vm (vm parameter)
    showUris: function(vm) {
      var self = this;

      this.set('vmSelected', vm);
      this.set('isBusy', true);

      Ember.run.later(function(){
        self.set('isShowingUris', true);
      }, 500);
    },

    // open io modal from targetted vm (vm parameter)
    showIO: function(vm) {
      this.set('vmSelected', vm);
      this.set('isShowingIO', true);
      this.set('isBusy', true);
    },

    // open monitor modal from targetted vm (vm parameter)
    showMonitor: function(vm) {
      this.set('vmSelected', vm);
      this.set('isShowingMonitor', true);
      this.set('isBusy', true);
    },

    // open supervise modal from targetted vm (vm parameter)
    showSupervise: function(vm) {
      this.set('vmSelected', vm);
      this.set('isShowingSupervise', true);
      this.set('isBusy', true);
    },

    // open vnc window
    openVnc: function(vm) {
      this.set('vmSelected', vm);
      this.set('isShowingVnc', true);
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
          model.set('nanStatus', false);
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

      if (this.get('isAllDelete')) {
        this.get('vms').forEach(function(vm) {
          vm.set('todelete', vm.get('isShow'));
        });
      } else {
        this.resetDelete();
      }
    },
  }
});
