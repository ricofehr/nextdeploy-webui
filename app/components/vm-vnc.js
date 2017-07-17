import Ember from 'ember';

/**
 *  This component manages vnc terminal modal
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class VmVnc
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Close the modal, reset component variables
     *
     *  @event closedVnc
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
