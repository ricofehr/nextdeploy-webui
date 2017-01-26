import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  // reset value when open popin
  resetFlags: function() {
    this.set('errorIO', null);
    this.set('importRunning', false);
    this.set('exportRunning', false);
  }.observes('uri'),

  isImport: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (this.get('vm').get('is_ro')) {
      return false;
    }

    if (this.get('vm').get('is_prod') && access_level < 50) {
      return false;
    } else {
      return true;
    }

  }.property('vm.is_prod', 'vm.is_ro'),

  actions: {
    // start export
    exportIO: function() {
      var branchs = this.get('export_branchs');
      var current_id = this.get('uri').get('id');
      var self = this;

      this.set('exportRunning', true);
      this.set('loadingModal', true);

      Ember.$.ajax({
          url: config.APP.APIHost + "/api/v1/uris/" + current_id + "/export",
          method: "POST",
          global: false,
          data: { branchs: branchs.toArray().join(" ") },
          headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
        })
        .done(function() {
          self.set('importRunning', false);
          self.set('loadingModal', false);
          self.set('errorIO', 'Export done !');
        })
        .fail(function() {
          self.set('importRunning', false);
          self.set('loadingModal', false);
          self.set('errorIO', 'Error occurs during export !');
        });
    },

    // start import
    importIO: function() {
      var self = this;
      var current_id = this.get('uri').get('id');

      this.set('importRunning', true);
      this.set('loadingModal', true);

      Ember.$.ajax({
          url: config.APP.APIHost + "/api/v1/uris/" + current_id + "/import",
          method: "POST",
          global: false,
          headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
        })
        .done(function() {
          self.set('importRunning', false);
          self.set('loadingModal', false);
          self.set('errorIO', 'Import done !');
        })
        .fail(function() {
          self.set('importRunning', false);
          self.set('loadingModal', false);
          self.set('errorIO', 'Error occurs during import !');
        });
    },

    // change property on power-select
    changeProperty: function(property, value) {
      this.set(property, value);
    },
  }
});
