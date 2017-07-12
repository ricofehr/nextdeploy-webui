import Ember from 'ember';
import config from '../config/environment';

/**
 *  This component manages supervises probes modal
 *
 *  @module components/vm-supervise
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Close the modal, reset component variables
     *
     *  @function
     */
    closedSupervise: function() {
      this.set('vm', null);
      this.set('isBusy', false);
      this.set('isShowingSupervise', false);
    },

    /**
     *  Show tooltip for reboot features
     *
     *  @function
     */
    showToolTip: function(type) {
      this.set(type + 'ToolTip', true);
    },

    /**
     *  Hide tooltip for reboot features
     *
     *  @function
     */
    hideToolTip: function(type) {
      this.set(type + 'ToolTip', false);
    },

    /**
     *  Ask for reboot, disaply confirm modal
     *
     *  @function
     */
    reboot: function(type) {
      this.set('typeReboot', type);
      this.set('isShowingRebootConfirmation', true);
    },

    /**
     *  Execute the reboot request
     *
     *  @function
     */
    rebootVm: function() {
      var self = this;

      this.set('isShowingRebootConfirmation', false);
      this.set('loadingModal', true);

      Ember.$.ajax({
          url: config.APP.APIHost + "/api/v1/vms/" + this.get('vm.id') + "/reboot",
          method: "POST",
          global: false,
          data: { type: this.get('typeReboot') },
          headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
      })
      .always(function() {
        self.set('loadingModal', false);
        self.set('isShowingVnc', true);
        self.set('isShowingSupervise', false);
      });
    },
  },

  /**
   *  Flag to display the tooltip for a soft reboot
   *
   *  @type {Boolean}
   */
  softToolTip: false,

  /**
   *  Flag to display the tooltip for a hard reboot
   *
   *  @type {Boolean}
   */
  hardToolTip: false,

  /**
   *  Flag to display the confirm modal
   *
   *  @type {Boolean}
   */
  isShowingRebootConfirmation: false,

  /**
   *  Flag to display the waiting modal
   *
   *  @type {Boolean}
   */
  loadingModal: false,

  /**
   *  Reboot type, default ti SOFT
   *
   *  @type {String}
   */
  typeReboot: 'SOFT',

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
   *  Check if current user is admin, lead, or dev
   *
   *  @function
   *  @returns {Boolean} True if admin, lead, or dev
   */
  isDev: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 30) { return true; }
    return false;
  }.property('session.data.authenticated.access_level')
});
