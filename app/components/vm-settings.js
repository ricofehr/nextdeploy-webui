import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  loadingModal: false,
  toggleCached: false,
  toggleProd: false,
  toggleHt: false,
  toggleCi: false,
  toggleCors: false,
  toggleOffline: false,
  toggleRo: false,
  toggleBackup: false,
  toggleAuth: false,
  checkListUris: null,
  errorUris: false,
  cachedToolTip: false,
  prodToolTip: false,
  authToolTip: false,
  htToolTip: false,
  ciToolTip: false,
  backupToolTip: false,
  uriModal: false,
  subModal: false,
  oldTopic: '',
  fadeSettings: true,

  // trigger function when model changes
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('checkListUris', Ember.Object.create());
  },

  reInit: function() {
    this.set('loadingModal', false);
    this.set('subModal', false);

    if (this.get('vm')) {
      if (this.get('vm.is_cached')) { this.set('toggleCached', true); }
      else { this.set('toggleCached', false); }

      if (this.get('vm.is_prod')) { this.set('toggleProd', true); }
      else { this.set('toggleProd', false); }

      if (this.get('vm.is_ht')) { this.set('toggleHt', true); }
      else { this.set('toggleHt', false); }

      if (this.get('vm.is_ci')) { this.set('toggleCi', true); }
      else { this.set('toggleCi', false); }

      if (this.get('vm.is_cors')) { this.set('toggleCors', true); }
      else { this.set('toggleCors', false); }

      if (this.get('vm.is_offline')) { this.set('toggleOffline', true); }
      else { this.set('toggleOffline', false); }

      if (this.get('vm.is_ro')) { this.set('toggleRo', true); }
      else { this.set('toggleRo', false); }

      if (this.get('vm.is_auth')) { this.set('toggleAuth', true); }
      else { this.set('toggleAuth', false); }

      if (this.get('vm.is_backup')) { this.set('toggleBackup', true); }
      else { this.set('toggleBackup', false); }

      this.set('cachedToolTip', false);
      this.set('prodToolTip', false);
      this.set('authToolTip', false);
      this.set('htToolTip', false);
      this.set('ciToolTip', false);
      this.set('corsToolTip', false);
      this.set('offlineToolTip', false);
      this.set('roToolTip', false);
      this.set('backupToolTip', false);
      this.set('uriToolTip', false);
      this.set('uriModal', false);
      this.set('fadeSettings', true);
    }
  }.observes('vm'),

  // if Command Modal is display, hide uris modal
  showSubModal: function(show) {
    var self = this;

    this.set('subModal', show);
    if (show) {
      this.set('fadeSettings', false);
      this.set('isShowingSettings', false);
      this.set('uriModal', true);
    } else {
      this.set('uriModal', false);
      this.set('isShowingSettings', true);

      Ember.run.later(function() {
        self.set('fadeSettings', true);
      }, 500);
    }
  },

  // Return true if is running state
  isRunning: function() {
    if (parseInt(this.get('vm.status'), 10) > 0) { return true; }
    return false;
  }.property('vm.status'),

  isDisabledAuth: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var user = this.get('vm.user');

    if (!this.get('vm.name')) {
      return true;
    }

    // if read-only, disabled
    if (this.get('vm.is_ro')) { return true; }
    // admin users have complete rights on all vms
    if (access_level === 50) { return false; }
    // only admin can manage admin vms
    if (parseInt(user.get('group.access_level')) === 50) { return true; }
    // lead users have this right on vms
    if (access_level === 40) { return false; }
    // only admin can open dev vms
    if (this.get('vm.is_prod')) { return false; }
    return true;
  }.property('vm.name', 'vm.is_prod', 'vm.is_ro'),

  isDisabledAdminVms: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var user = this.get('vm.user');

    if (!this.get('vm.name')) {
      return true;
    }

    // only admin can manage admin vms
    if (access_level !== 50 && parseInt(user.get('group.access_level')) === 50) { return true; }
    // if read-only, disabled
    if (this.get('vm.is_ro')) { return true; }

    return false;
  }.property('vm.name', 'vm.is_ro'),

  isDisabledRo: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var user = this.get('vm.user');

    if (!this.get('vm.name')) {
      return true;
    }

    // only admin can manage admin vms
    if (access_level !== 50 && parseInt(user.get('group.access_level')) === 50) { return true; }
    return false;
  }.property('vm.name'),

  isDisabledProd: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var user = this.get('vm.user');

    if (!this.get('vm.name')) {
      return true;
    }

    // if read-only, disabled
    if (this.get('vm.is_ro')) { return true; }
    // admin users have complete rights on all vms
    if (access_level === 50) { return false; }
    // user can disable prod "flag" in any conditions
    if (this.get('vm.is_prod')) { return false; }
    // only admin can manage admin vms
    if (parseInt(user.get('group.access_level')) === 50) { return true; }
    // check quota number
    if (parseInt(user.get('quotaprod')) > parseInt(user.get('vms').filterBy('is_prod', true).length)) { return false; }
    return true;
  }.property('vm.name', 'vm.is_ro'),

    // Return true if user is a Dev or more
  isDev: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 30) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  // check uris
  checkUris: function() {
    var checks = this.get('checkListUris');
    var errorUris = false;

    if (!this.get('vm.uris')) {
      return;
    }

    this.get('vm.uris').forEach(function (uri) {
      if (uri.get('path') && checks.get(uri.get('path'))) {
        errorUris = true;
      }
    });

    this.set('errorUris', errorUris);
  }.observes('vm.uris'),

  // check if we have a framework or a database
  isDisabledBackup: function() {
    if (!this.get('vm')) { return true; }

    var access_level = this.get('session').get('data.authenticated.access_level');
    var user = this.get('vm.user');

    // only admin can manage admin vms
    if (access_level !== 50 && parseInt(user.get('group.access_level')) === 50) { return true; }
    // if read-only, disabled
    if (this.get('vm.is_ro')) { return true; }

    var uris = this.get('vm.uris');
    var isData = false;

    uris.forEach(function (uri) {
      if (uri.get('is_import')) {
        isData = true;
      }
    });

    if (isData) {
      return false;
    }

    return true;
  }.property('vm.project', 'vm.is_ro'),

  actions: {
    // open the submodal
    openSubModal: function() {
      this.showSubModal(true);
    },

    // close the modal, reset showing variable
    closedSettings: function() {
      if (!this.get('subModal')) {
        this.set('isBusy', false);
        this.set('vm', null);
      }
    },

    // close the uri submodal
    closedSubModal: function() {
      this.showSubModal(false);
    },

    enterTopic: function() {
      this.set('oldTopic', this.get('vm.topic'));
    },

    updateTopic: function() {
      var self = this;

      if (!this.get('vm') ||
          this.get('oldTopic') === this.get('vm').get('topic') ) {
        return;
      }

      if (this.get('vm').get('topic') === '') {
        this.get('vm').set('topic',
          this.get('vm.commit.id').replace(/^[0-9][0-9]*-/,'').replace(/-[A-Za-z0-9][A-Za-z0-9]*$/,'')
        );
      }

      self.set('loadingModal', true);
      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/vms/" + this.get('vm').get('id') + "/topic",
        method: "PUT",
        global: false,
        data: { topic: this.get('vm').get('topic') },
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
      })
      .done(function() {
        self.set('loadingModal', false);
        this.set('topicChanged', false);
      })
      .fail(function() {
        self.set('message', 'Error occurs during execution !');
        Ember.run.later(function(){
          self.set('loadingModal', false);
        }, 3000);
      });
    },

    changeAuth: function(disabled, toggle) {
      var self = this;
      var isAuth = toggle.newValue;

      if (!this.get('vm')) {
        return;
      }

      if (isAuth === this.get('vm.is_auth')) {
        return;
      }

      if (disabled) {
        return;
      }

      self.set('loadingModal', true);
      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/vms/" + this.get('vm').get('id') + "/toggleauth",
        method: "POST",
        global: false,
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
      })
      .done(function() {
        self.set('loadingModal', false);
        self.set('vm.is_auth', isAuth);
        self.set('toggleAuth', isAuth);
      })
      .fail(function() {
        self.set('message', 'Error occurs during execution !');
        Ember.run.later(function(){
          self.set('loadingModal', false);
        }, 3000);
      });
    },

    changeCached: function(disabled, toggle) {
      var self = this;
      var isCached = toggle.newValue;

      if (!this.get('vm')) {
        return;
      }

      if (isCached === this.get('vm.is_cached')) {
        return;
      }

      if (disabled) {
        return;
      }

      self.set('loadingModal', true);
      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/vms/" + this.get('vm').get('id') + "/togglecached",
        method: "POST",
        global: false,
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
      })
      .done(function() {
        self.set('loadingModal', false);
        self.set('vm.is_cached', isCached);
        self.set('toggleCached', isCached);
      })
      .fail(function() {
        self.set('message', 'Error occurs during execution !');
        Ember.run.later(function(){
          self.set('loadingModal', false);
        }, 3000);
      });
    },

    changeHtaccess: function(disabled, toggle) {
      var self = this;
      var isHt = toggle.newValue;

      if (!this.get('vm')) {
        return;
      }

      if (isHt === this.get('vm.is_ht')) {
        return;
      }

      if (disabled) {
        return;
      }

      self.set('loadingModal', true);
      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/vms/" + this.get('vm').get('id') + "/toggleht",
        method: "POST",
        global: false,
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
      })
      .done(function() {
        self.set('loadingModal', false);
        self.set('vm.is_ht', isHt);
        self.set('toggleHt', isHt);
      })
      .fail(function() {
        self.set('message', 'Error occurs during execution !');
        Ember.run.later(function(){
          self.set('loadingModal', false);
        }, 3000);
      });
    },

    changeProd: function(disabled, toggle) {
      var self = this;
      var isProd = toggle.newValue;

      if (!this.get('vm')) {
        return;
      }

      if (isProd === this.get('vm.is_prod')) {
        return;
      }

      if (disabled) {
        return;
      }

      self.set('loadingModal', true);
      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/vms/" + this.get('vm').get('id') + "/toggleprod",
        method: "POST",
        global: false,
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
      })
      .done(function() {
        if (!isProd) {
          // clean uris
          self.get('vm.uris').forEach(function(uri) {
            self.store.peekAll('uri').removeObject(uri);
            //self.get('vm.uris').removeObject(uri);
          });
        }

        // reload models
        //self.store.unloadAll('uri');
        self.store.findAll('uri').then(function() {
          self.get('vm').reload().then(function() {
            self.set('loadingModal', false);
            self.set('toggleProd', isProd);
            self.set('vm.is_prod', isProd);
          });
        });
      })
      .fail(function() {
        self.set('message', 'Error occurs during execution !');
        Ember.run.later(function(){
          self.set('loadingModal', false);
        }, 3000);
      });
    },

    changeBackup: function(disabled, toggle) {
      var self = this;
      var isBackup = toggle.newValue;

      if (!this.get('vm')) {
        return;
      }

      if (isBackup === this.get('vm.is_backup')) {
        return;
      }

      if (disabled) {
        return;
      }

      self.set('loadingModal', true);
      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/vms/" + this.get('vm').get('id') + "/togglebackup",
        method: "POST",
        global: false,
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
      })
      .done(function() {
        self.set('loadingModal', false);
        self.set('vm.is_backup', isBackup);
        self.set('toggleBackup', isBackup);
      })
      .fail(function() {
        self.set('message', 'Error occurs during execution !');
        Ember.run.later(function(){
          self.set('loadingModal', false);
        }, 3000);
      });
    },

    changeCi: function(disabled, toggle) {
      var self = this;
      var isCi = toggle.newValue;

      if (!this.get('vm')) {
        return;
      }

      if (isCi === this.get('vm.is_ci')) {
        return;
      }

      if (disabled) {
        return;
      }

      self.set('loadingModal', true);
      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/vms/" + this.get('vm').get('id') + "/toggleci",
        method: "POST",
        global: false,
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
      })
      .done(function() {
        self.set('loadingModal', false);
        self.set('vm.is_ci', isCi);
        self.set('toggleCi', isCi);
      })
      .fail(function() {
        self.set('message', 'Error occurs during execution !');
        Ember.run.later(function(){
          self.set('loadingModal', false);
        }, 3000);
      });
    },

    changeCors: function(disabled, toggle) {
      var self = this;
      var isCors = toggle.newValue;

      if (!this.get('vm')) {
        return;
      }

      if (isCors === this.get('vm.is_cors')) {
        return;
      }

      if (disabled) {
        return;
      }

      self.set('loadingModal', true);
      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/vms/" + this.get('vm').get('id') + "/togglecors",
        method: "POST",
        global: false,
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
      })
      .done(function() {
        self.set('loadingModal', false);
        self.set('vm.is_cors', isCors);
        self.set('toggleCors', isCors);
      })
      .fail(function() {
        self.set('message', 'Error occurs during execution !');
        Ember.run.later(function(){
          self.set('loadingModal', false);
        }, 3000);
      });
    },

    changeRo: function(disabled, toggle) {
      var self = this;
      var isRo = toggle.newValue;

      if (!this.get('vm')) {
        return;
      }

      if (isRo === this.get('vm.is_ro')) {
        return;
      }

      if (disabled) {
        return;
      }

      self.set('loadingModal', true);
      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/vms/" + this.get('vm').get('id') + "/togglero",
        method: "POST",
        global: false,
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
      })
      .done(function() {
        self.set('loadingModal', false);
        self.set('vm.is_ro', isRo);
        self.set('toggleRo', isRo);
      })
      .fail(function() {
        self.set('message', 'Error occurs during execution !');
        Ember.run.later(function(){
          self.set('loadingModal', false);
        }, 3000);
      });
    },

    changeOffline: function(disabled, toggle) {
      var self = this;
      var isOffline = toggle.newValue;

      if (!this.get('vm')) {
        return;
      }

      if (isOffline === this.get('vm.is_offline')) {
        return;
      }

      if (disabled) {
        return;
      }

      self.set('loadingModal', true);
      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/vms/" + this.get('vm').get('id') + "/toggleoffline",
        method: "POST",
        global: false,
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
      })
      .done(function() {
        self.set('loadingModal', false);
        self.set('vm.is_offline', isOffline);
        self.set('toggleOffline', isOffline);
      })
      .fail(function() {
        self.set('message', 'Error occurs during execution !');
        Ember.run.later(function(){
          self.set('loadingModal', false);
        }, 3000);
      });
    },

    showToolTip: function(type) {
      this.set(type + 'ToolTip', true);
    },

    hideToolTip: function(type) {
      this.set(type + 'ToolTip', false);
    },
  }
});
