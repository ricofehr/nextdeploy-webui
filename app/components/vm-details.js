import Ember from 'ember';

export default Ember.Component.extend({
  isShowingDetail: false,

  // check if the modal must be displayed (isShowingUris must be equal to the current vm id)
  setShowingDetail: function() {
    this.set('isShowingDetail', this.get('isShowingDetails') === this.get('vm').id);
  }.observes('isShowingDetails'),

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
      this.set('isShowingDetails', -1);
      this.set('isBusy', false);
    }
  }
});
