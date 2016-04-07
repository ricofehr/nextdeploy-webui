import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    // close the modal, reset showing variable
    closeVnc: function() {
      this.set('isShowingVnc', false);
      this.set('vncUrl', '');
      this.set('vncPassword', '');
      this.set('vncLayout', '');
      this.set('isBusy', false);
    }
  }
});
