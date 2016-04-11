import Ember from 'ember';

export default Ember.Component.extend({
  // Return true if is running state
  isRunning: function() {
    if (parseInt(this.get('vm.status'), 10) > 0) { return true; }
    return false;
  }.property('vm.status'),

  // get branch name (fix for weird bug with name property)
  branchName: function() {
    return this.get('vm.commit.id').replace(/^[0-9][0-9]*-/,'').replace(/-[A-Za-z0-9][A-Za-z0-9]*$/,'');
  }.property('vm.commit'),

  actions: {
    // close the modal, reset showing variable
    closeDetails: function() {
      this.set('isShowingDetails', false);
      this.set('isBusy', false);
      this.set('vm', null);
    }
  }
});
