import Ember from 'ember';

export default Ember.Component.extend({
  // Return true if is running state
  isRunning: function() {
    if (parseInt(this.get('vm.status'), 10) > 0) { return true; }
    return false;
  }.property('vm.status'),

  actions: {
    // close the modal, reset showing variable
    closedSupervise: function() {
      this.set('vm', null);
      this.set('isBusy', false);
    }
  }
});
