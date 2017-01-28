import Ember from 'ember';

export default Ember.Component.extend({
  loadingModal: false,
  importRunning: false,
  exportRunning: false,
  errorIO: null,

  // reset value when open popin
  resetFlags: function() {
    this.set('errorIO', null);
    this.set('importRunning', false);
    this.set('exportRunning', false);
  }.observes('vm'),

  // Return true if is running state
  isRunning: function() {
    if (!this.get('vm')) {
      return false;
    }

    if (parseInt(this.get('vm.status'), 10) > 0) { return true; }
    return false;
  }.property('vm.status'),

  // get branch name (fix for weird bug with name property)
  branchName: function() {
    if (!this.get('vm')) {
      return null;
    }

    return this.get('vm.commit.id').replace(/^[0-9][0-9]*-/,'').replace(/-[A-Za-z0-9][A-Za-z0-9]*$/,'');
  }.property('vm.commit'),

  // short vm name
  vmName: function() {
    if (!this.get('vm')) {
      return false;
    }

    return this.get('vm.name').replace(/\..*$/,'');
  }.property('vm.name'),

  // check if we have import flag for uris
  isIO: function() {
    if (!this.get('vm')) { return false; }

    var uris = this.get('vm.uris');
    var isData = false;

    uris.forEach(function (uri) {
      if (uri.get('is_import')) {
        isData = true;
      }
    });

    return isData;
  }.property('vm.id'),

  initBranchs: function() {
    if (!this.get('isShowingIO')) { return false; }
    if (!this.get('vm')) { return false; }

    var self = this;
    var project_id = this.get('vm.project').get('id');
    var branchs = ['default'];
    var uris = this.get('vm.uris');
    var isData = false;

    this.set('export_branchs', null);

    uris.forEach(function (uri) {
      if (uri.get('is_import')) {
        isData = true;
      }
    });

    if (!project_id || !isData) {
      return;
    }

    // loading waiting
    this.set('isShowingIO', false);
    this.set('loadingModal', true);

    //update project datas
    this.store.findRecord('project', project_id, { backgroundReload: false, reload: true }).then(function(project) {
      project.get('branches').then(function(branches) {
        branches.forEach(function(branch) {
          branchs.push(branch.get('name'));
        });

        self.set('branchs', branchs);

        // Ensure loader is running at least 1s (avoid flicker)
        Ember.run.later(function() {
          self.set('isShowingIO', true);
          self.set('loadingModal', false);
        }, 1000);
      });
    });

  }.observes('vm.project'),

  actions: {
    // close the modal, reset showing variable
    closedIO: function() {
      this.set('isBusy', false);
      this.set('vm', null);
    },
  }
});
