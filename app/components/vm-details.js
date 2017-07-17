import Ember from 'ember';

/**
 *  This component manages vm details modal
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class VmDetails
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Close the modal, reset component variables
     *
     *  @event closedDetails
     */
    closedDetails: function() {
      this.set('isBusy', false);
      this.set('vm', null);
      this.set('isShowingDetails', false);
    },
  },

  /**
   *  Return true if is running state
   *
   *  @function isRunning
   *  @returns {Boolean}
   */
  isRunning: function() {
    if (parseInt(this.get('vm.status'), 10) > 0) {
      return true;
    }

    return false;
  }.property('vm.status'),

  /**
   *  Get shortly vm name
   *
   *  @function vmName
   *  @returns {String}
   */
  vmName: function() {
    return this.get('vm.name').replace(/\..*$/,'');
  }.property('vm.name')
});
