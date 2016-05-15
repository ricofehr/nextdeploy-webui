import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  loadingModal: false,
  toggleCached: false,
  toggleProd: false,
  toggleHt: false,
  toggleAuth: false,
  checkListUris: null,
  errorUris: false,
  cachedToolTip: false,
  prodToolTip: false,
  authToolTip: false,
  htToolTip: false,

  // trigger function when model changes
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('loadingModal', false);
    this.set('checkListUris', Ember.Object.create());

    if (this.get('vm')) {
      if (this.get('vm.is_cached')) { this.set('toggleCached', true); }
      else { this.set('toggleCached', false); }

      if (this.get('vm.is_prod')) { this.set('toggleProd', true); }
      else { this.set('toggleProd', false); }

      if (this.get('vm.is_ht')) { this.set('toggleHt', true); }
      else { this.set('toggleHt', false); }

      if (this.get('vm.is_auth')) { this.set('toggleAuth', true); }
      else { this.set('toggleAuth', false); }

      this.set('cachedToolTip', false);
      this.set('prodToolTip', false);
      this.set('authToolTip', false);
      this.set('htToolTip', false);
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

    // admin users have complete rights on all vms
    if (access_level === 50) { return false; }
    // only admin can manage admin vms
    if (parseInt(user.get('group.access_level')) === 50) { return true; }
    // only admin can open dev vms
    if (this.get('vm.is_prod')) { return false; }
    return true;
  }.property('vm.name', 'vm.is_prod'),

  isDisabledAdminVms: function() {
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

    // admin users have complete rights on all vms
    if (access_level === 50) { return false; }
    // user can disable prod "flag" in any conditions
    if (this.get('vm.is_prod')) { return false; }
    // only admin can manage admin vms
    if (parseInt(user.get('group.access_level')) === 50) { return true; }
    // check quota number
    if (parseInt(user.get('quotaprod')) > parseInt(user.get('vms').filterBy('is_prod', true).length)) { return false; }
    return true;
  }.property('vm.name'),

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

  actions: {
    // close the modal, reset showing variable
    closeSettings: function() {
      var self = this;
      this.set('isShowingSettings', false);
      this.set('isBusy', false);
      // little pause before reset vm for avoif clipping
      Ember.run.later(function(){
       self.set('vm', null);
      }, 500);
    },

    changeAuth: function(isAuth) {
      var self = this;

      if (!this.get('vm')) {
        return;
      }

      if (isAuth === this.get('vm.is_auth')) {
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

    changeCached: function(isCached) {
      var self = this;

      if (!this.get('vm')) {
        return;
      }

      if (isCached === this.get('vm.is_cached')) {
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

    changeHtaccess: function(isHt) {
      var self = this;

      if (!this.get('vm')) {
        return;
      }

      if (isHt === this.get('vm.is_ht')) {
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

    changeProd: function(isProd) {
      var self = this;

      if (!this.get('vm')) {
        return;
      }

      if (isProd === this.get('vm.is_prod')) {
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
            self.get('vm.uris').removeObject(uri);
          });
        }

        // reload models
        self.store.unloadAll('uri');
        self.store.findAll('uri').then(function() {
          self.get('vm').reload().then(function() {
            self.set('loadingModal', false);
            self.set('toggleProd', isProd);
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

    showToolTip: function(type) {
      this.set(type + 'ToolTip', true);
    },

    hideToolTip: function(type) {
      this.set(type + 'ToolTip', false);
    },
  }
});
