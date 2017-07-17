import Ember from 'ember';
import config from '../config/environment';

/**
 *  This component manages export/import for uris on vms
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class VmIoUri
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Send an export request to the api
     *
     *  @event exportIO
     */
    exportIO: function() {
      var branchs = this.get('export_branchs');
      var currentId = this.get('uri').get('id');
      var self = this;

      this.set('exportRunning', true);
      this.set('loadingModal', true);

      Ember.$.ajax({
          url: config.APP.APIHost + "/api/v1/uris/" + currentId + "/export",
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

    /**
     *  Send an import request to the api
     *
     *  @event importIO
     */
    importIO: function() {
      var self = this;
      var currentId = this.get('uri').get('id');

      this.set('importRunning', true);
      this.set('loadingModal', true);

      Ember.$.ajax({
          url: config.APP.APIHost + "/api/v1/uris/" + currentId + "/import",
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
  },

  /**
   *  Check if import is disabled (prod or read-only state)
   *
   *  @function isImport
   */
  isImport: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    this.resetFlags();

    if (this.get('vm').get('is_ro')) {
      return false;
    }

    if (this.get('vm').get('is_prod') && accessLevel < 50) {
      return false;
    } else {
      return true;
    }

  }.property('vm.is_prod', 'vm.is_ro'),

  /**
   *  Reset component variables when open modal
   *
   *  @method resetFlags
   */
  resetFlags: function() {
    this.set('errorIO', null);
    this.set('importRunning', false);
    this.set('exportRunning', false);
  }
});
