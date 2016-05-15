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

  // return shortly vm name
  vmName: function() {
    return this.get('vm.name').replace(/\..*$/,'');
  }.property('vm.name'),

  actions: {
    // close the modal, reset showing variable
    closeDetails: function() {
      var self = this;
      this.set('isShowingDetails', false);
      this.set('isBusy', false);
      // little pause before reset vm for avoif clipping
      Ember.run.later(function(){
       self.set('vm', null);
      }, 500);
    },
  }
});
