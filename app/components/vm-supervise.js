import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  softToolTip: false,
  hardToolTip: false,
  isShowingRebootConfirmation: false,
  loadingModal: false,
  typeReboot: 'SOFT',

  // Return true if is running state
  isRunning: function() {
    if (parseInt(this.get('vm.status'), 10) > 0) { return true; }
    return false;
  }.property('vm.status'),

  // Return true if user is a Dev or more
  isDev: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 30) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  actions: {
    // close the modal, reset showing variable
    closedSupervise: function() {
      this.set('vm', null);
      this.set('isBusy', false);
      this.set('isShowingSupervise', false);
    },

    // show / hide tooltip for reboot features
    showToolTip: function(type) {
      this.set(type + 'ToolTip', true);
    },

    hideToolTip: function(type) {
      this.set(type + 'ToolTip', false);
    },

    reboot: function(type) {
      this.set('typeReboot', type);
      this.set('isShowingRebootConfirmation', true);
    },

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
  }
});
