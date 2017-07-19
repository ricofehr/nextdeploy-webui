import Ember from 'ember';

/**
 *  This component manages export/import for vms
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class VmIo
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Close the modal, reset component variables
     *
     *  @event closedIO
     */
    closedIO: function() {
      this.set('isBusy', false);
      this.set('vm', null);
      this.set('isShowingIO', false);
      this.resetFlags();
    },
  },

  /**
   *  Display the loading modal
   *
   *  @property loadingModal
   *  @type {Boolean}
   */
  loadingModal: false,

  /**
   *  Flag setted during an import
   *
   *  @property importRunning
   *  @type {Boolean}
   */
  importRunning: false,

  /**
   *  Flag setted during an export
   *
   *  @property exportRunning
   *  @type {Boolean}
   */
  exportRunning: false,

  /**
   *  Flag setted if errors occurs
   *
   *  @property errorIO
   *  @type {Boolean}
   */
  errorIO: null,

  /**
   *  Return true if vm is on running state
   *
   *  @function isRunning
   *  @returns {Boolean}
   */
  isRunning: function() {
    if (!this.get('vm')) {
      return false;
    }

    if (parseInt(this.get('vm.status'), 10) > 0) { return true; }
    return false;
  }.property('vm.status'),

  /**
   *  Get shorter vm name
   *
   *  @function vmName
   *  @returns {String}
   */
  vmName: function() {
    if (!this.get('vm')) {
      return false;
    }

    return this.get('vm.name').replace(/\..*$/,'');
  }.property('vm.name'),

  /**
   *  Check if we have import flag for uris
   *
   *  @function isIO
   *  @returns {Boolean}
   */
  isIO: function() {
    if (!this.get('vm')) { return false; }

    var uris = this.get('vm.uris');
    var isData = false;

    // Reset some component variables
    this.resetFlags();

    uris.forEach(function (uri) {
      if (uri.get('is_import')) {
        isData = true;
      }
    });

    return isData;
  }.property('vm.id'),

  /**
   *  Generates branchs list array
   *
   *  @function branchs
   *  @returns {String[]}
   */
  branchs: function() {
    if (!this.get('isShowingIO')) { return false; }
    if (!this.get('vm')) { return false; }

    var self = this;
    var branchs = ['default'];
    var uris = this.get('vm.uris');
    var isData = false;

    this.set('export_branchs', null);

    uris.forEach(function (uri) {
      if (uri.get('is_import')) {
        isData = true;
      }
    });

    if (!isData) {
      return;
    }

    // loading waiting
    this.set('loadingModal', true);

    // ensure vm and project objects are reloaded
    this.get('vm').reload().then(function(vm) {
      self.store.findRecord('project',
                            vm.get('project.id'),
                            { backgroundReload: false, reload: true }
                           ).then(function(project) {
        project.get('branches').then(function(branches) {
          branches.forEach(function(branch) {
            branchs.push(branch.get('name'));
          });

          // Ensure loader is running at least 1s (avoid flicker)
          Ember.run.later(function() {
            self.set('isShowingIO', true);
            self.set('loadingModal', false);
          }, 1000);
        });
      });
    });

    return branchs;
  }.property('vm.project'),

  /**
   *  Reset component variables
   *
   *  @method resetFlags
   */
  resetFlags: function() {
    this.set('errorIO', null);
    this.set('importRunning', false);
    this.set('exportRunning', false);
  }
});
