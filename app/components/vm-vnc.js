import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    // close the modal, reset showing variable
    closedVnc: function() {
      this.set('vncUrl', '');
      this.set('vncPassword', '');
      this.set('vncLayout', '');
      this.set('isBusy', false);
    }
  }
});
