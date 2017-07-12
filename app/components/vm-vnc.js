import Ember from 'ember';

/**
 *  This component manages vnc terminal modal
 *
 *  @module components/vm-vnc
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Close the modal, reset component variables
     *
     *  @function
     */
    closedVnc: function() {
      this.set('vncUrl', '');
      this.set('vncPassword', '');
      this.set('vncLayout', '');
      this.set('isBusy', false);
      this.set('isShowingVnc', false);
    }
  }
});
