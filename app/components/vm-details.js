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

  actions: {
    // close the modal, reset showing variable
    closeDetails: function() {
      this.set('isShowingDetails', -1);
      this.set('isBusy', false);
    }
  }
});
