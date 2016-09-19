import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    // close the modal, reset showing variable
    closedVnc: function() {
      var self = this;

      self.set('vncUrl', '');
      self.set('vncPassword', '');
      self.set('vncLayout', '');
      self.set('isBusy', false);
    }
  }
});
