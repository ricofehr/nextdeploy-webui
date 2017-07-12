import Ember from 'ember';
import config from '../config/environment';

/**
 *  This component manages settings modal for vm
 *
 *  @module components/vm-io-uri
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Display the uris settings submodal
     *
     *  @function
     */
    openSubModal: function() {
      this.showSubModal(true);
    },

    /**
     *  Close the modal, reset component variables
     *
     *  @function
     */
    closedSettings: function() {
      if (!this.get('subModal')) {
        this.set('isBusy', false);
        this.set('vm', null);
        this.set('isShowingSettings', false);
      }
    },

    /**
     *  Hide the uris settings submodal
     *
     *  @function
     */
    closedSubModal: function() {
      this.showSubModal(false);
    },

    /**
     *  Store current topic in oldTopic parameter
     *
     *  @function
     */
    enterTopic: function() {
      this.set('oldTopic', this.get('vm.topic'));
    },

    /**
     *  Update topic attribute
     *
     *  @function
     *  @param {Boolean} disabled True if toggle is not active
     *  @param {Boolean} toggle The new value for the flag
     */
    updateTopic: function() {
      var self = this;

      if (!this.get('vm') ||
          this.get('oldTopic') === this.get('vm').get('topic') ) {
        return;
      }

      if (this.get('vm').get('topic') === '') {
        // HACK fix for weird bug with branche.name property
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

    /**
     *  Change prod state setting
     *
     *  @function
     *  @param {Toggle} toggle The new value for the flag
     */
    changeProd: function(toggle) {
      var self = this;
      var isProd = toggle.newValue;

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
          });
        }

        // reload models
        self.store.findAll('uri').then(function() {
          self.get('vm').reload().then(function() {
            self.set('loadingModal', false);
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

    /**
     *  Change a toggle flag setting
     *
     *  @function
     *  @param {String} property
     *  @param {Toggle} toggle The new value for the flag
     */
    changeToggle: function(property, toggle) {
      var self = this;
      var value = toggle.newValue;

      if (!this.get('vm')) {
        return;
      }

      if (value === this.get('vm.is_' + property)) {
        return;
      }

      self.set('loadingModal', true);

      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/vms/" + this.get('vm').get('id') + "/toggle" + property,
        method: "POST",
        global: false,
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
      })
      .done(function() {
        self.set('loadingModal', false);
        self.set('vm.is_' + property, value);
      })
      .fail(function() {
        self.set('message', 'Error occurs during execution !');
        Ember.run.later(function(){
          self.set('loadingModal', false);
        }, 3000);
      });
    },

    /**
     *  Display a tooltip
     *
     *  @function
     *  @param {String} type id of the tooltip
     */
    showToolTip: function(type) {
      this.set(type + 'ToolTip', true);
    },

    /**
     *  Hide a tooltip
     *
     *  @function
     *  @param {String} type id of the tooltip
     */
    hideToolTip: function(type) {
      this.set(type + 'ToolTip', false);
    },
  },

  /**
   *  Flag to display the loading modal
   *
   *  @type {Boolean}
   */
  loadingModal: false,

  /**
   *  Share uris array with submodal
   *
   *  @type {Object}
   */
  checkListUris: null,

  /**
   *  Flag to display Varnish Cache tooltip
   *
   *  @type {Boolean}
   */
  cachedToolTip: false,

  /**
   *  Flag to display Prod state tooltip
   *
   *  @type {Boolean}
   */
  prodToolTip: false,

  /**
   *  Flag to display BasicAuth tooltip
   *
   *  @type {Boolean}
   */
  authToolTip: false,

  /**
   *  Flag to display HtAccess tooltip
   *
   *  @type {Boolean}
   */
  htToolTip: false,

  /**
   *  Flag to display CI tooltip
   *
   *  @type {Boolean}
   */
  ciToolTip: false,

  /**
   *  Flag to display Backup tooltip
   *
   *  @type {Boolean}
   */
  backupToolTip: false,

  /**
   *  Flag to display uris setting modal
   *
   *  @type {Boolean}
   */
  uriModal: false,

  /**
   *  Flag to display submodal
   *
   *  @type {Boolean}
   */
  subModal: false,

  /**
   *  Store the old topic attribute
   *
   *  @type {String}
   */
  oldTopic: '',

  /**
   *  Flag to enable fade animation on modal
   *
   *  @type {Boolean}
   */
  fadeSettings: true,

  /**
   *  Return true if vm is on running state
   *
   *  @function
   *  @returns {Boolean}
   */
  isRunning: function() {
    if (parseInt(this.get('vm.status'), 10) > 0) { return true; }
    return false;
  }.property('vm.status'),

  /**
   *  Return true if BasicAuth toggle must be disabled
   *
   *  @function
   *  @returns {Boolean}
   */
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

  /**
   *  Return true if vm not changeable
   *
   *  @function
   *  @returns {Boolean}
   */
  isDisabledAdminVms: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var user = this.get('vm.user');

    if (!this.get('vm.name')) {
      return true;
    }

    // only admin can manage admin vms
    if (access_level < 40 &&
        parseInt(user.get('group.access_level')) === 50) {
          return true;
    }

    // if read-only, disabled
    if (this.get('vm.is_ro')) {
      return true;
    }

    return false;
  }.property('vm.name', 'vm.is_ro'),

  /**
   *  Return true if vm is not changeable
   *
   *  @function
   *  @returns {Boolean}
   */
  isDisabledRo: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var user = this.get('vm.user');

    if (!this.get('vm.name')) {
      return true;
    }

    if (access_level < 40 &&
        parseInt(user.get('group.access_level')) === 50) {
      return true;
    }

    return false;
  }.property('vm.name'),

  /**
   *  Return true if Prod toggle must be disabled
   *
   *  @function
   *  @returns {Boolean}
   */
  isDisabledProd: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var user = this.get('vm.user');
    var quotaProd = user.get('quotaprod');
    var countVmsProd = user.get('vms').filterBy('is_prod', true).length;

    if (!this.get('vm.name')) {
      return true;
    }

    // if read-only, disabled
    if (this.get('vm.is_ro')) {
      return true;
    }
    // admin users have complete rights on all vms
    if (access_level === 50) {
      return false;
    }
    // user can disable prod "flag" in any conditions
    if (this.get('vm.is_prod')) {
      return false;
    }
    // only admin can manage admin vms
    if (parseInt(user.get('group.access_level')) === 50) {
      return true;
    }
    // check quota number
    if (parseInt(quotaProd) > parseInt(countVmsProd)) {
      return false;
    }
    return true;
  }.property('vm.name', 'vm.is_ro'),

  /**
   *  Check if current user is admin, lead, or dev
   *
   *  @function
   *  @returns {Boolean} True if admin, lead, or dev
   */
  isDev: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 30) {
      return true;
    }

    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Ensure uris array is not empty
   *
   *  @function
   *  @returns {Boolean} if no valid uris array
   */
  errorUris: function() {
    var checks = this.get('checkListUris');
    var errorUris = false;

    if (!this.get('vm.uris')) {
      return;
    }

    this.get('vm.uris').forEach(function(uri) {
      if (uri.get('path') && checks.get(uri.get('path'))) {
        errorUris = true;
      }
    });

    return errorUris;
  }.property('vm.uris'),

  /**
   *  Return true if Backup toggle must be disabled
   *
   *  @function
   *  @returns {Boolean}
   */
  isDisabledBackup: function() {
    if (!this.get('vm')) { return true; }

    var access_level = this.get('session').get('data.authenticated.access_level');
    var user = this.get('vm.user');

    // only admin can manage admin vms
    if (access_level !== 50 &&
        parseInt(user.get('group.access_level')) === 50) {
          return true;
    }
    // if read-only, disabled
    if (this.get('vm.is_ro')) {
      return true;
    }

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

  /**
   *  Trigger when receives models
   *
   *  @function
   */
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('checkListUris', Ember.Object.create());
  },

  /**
   *  Reset component variables
   *
   *  @function
   */
  reInit: function() {
    this.set('loadingModal', false);
    this.set('subModal', false);

    if (this.get('vm')) {
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
  },

  /**
   *  Switch between settings modal and uri settings submodal
   *
   *  @function
   */
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
  }
});
