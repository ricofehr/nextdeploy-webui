import Ember from 'ember';

/**
 *  This component manages hover mouse event on vms list
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class VmHover
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Close the modal, reset component variables
     *
     *  @event closeHover
     */
    closeHover: function() {
      this.set('isShowingHovers', -1);
    }
  },

  /**
   *  Generates the commit title
   *
   *  @function commitTitle
   *  @returns {String} the title
   */
  commitTitle: function() {
    var ret = this.get('vm.commit.title');

    if (this.get('vm.commit.title') && this.get('vm.commit.title').match(/^Merge/)) {
      ret = this.get('vm.commit.title').replace(/ of.*/g, '').replace(/ into.*/g, '');
    }

    return ret.replace(/http:\/\/[^ ]+/g, '');
  }.property('vm.commit.title'),

  /**
   *  Generates the commit date
   *
   *  @function commitDate
   *  @returns {String} the date
   */
  commitDate: function() {
    if (!this.get('vm.commit.created_at')) {
      return '';
    }

    var date = this.get('vm.commit.created_at');
    var day = '';
    var month = '';
    var year = '';
    var hour = '';
    var minute = '';
    var displayDate = '';
    var today = new Date();

    // init commit date value
    day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();
    hour = date.getHours();
    minute = date.getMinutes();

    if (today.getDate() === day &&
        today.getMonth() + 1 === month &&
        today.getFullYear() === year) {
      if (parseInt(hour) < 10) { hour = '0' + hour; }
      if (parseInt(minute) < 10) { minute = '0' + minute; }
      displayDate = hour + "h" + minute;
    } else {
      if (parseInt(day) < 10) { day = '0' + day; }
      if (parseInt(month) < 10) { month = '0' + month; }
      year = year + '';
      displayDate = year.substring(2) + "/" + month + "/" + day;
    }

    return displayDate + ' - ';
  }.property('vm.commit.created_at'),

  /**
   *  Flag to display the hover
   *
   *  @function isShowingHover
   *  @returns {Boolean} true if hover is displayed
   */
  isShowingHover: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel >= 20) {
      return this.get('isShowingHovers') === this.get('vm').id;
    } else {
      return false;
    }
  }.property('isShowingHovers'),

  /**
   *  Return true if vm is on running state
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
   *  Check if current user is admin, lead, or dev
   *
   *  @function isDev
   *  @returns {Boolean} True if admin, lead, or dev
   */
  isDev: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel >= 30) {
      return true;
    }
    return false;
  }.property('session.data.authenticated.access_level')
});
