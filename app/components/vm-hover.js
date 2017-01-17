import Ember from 'ember';

export default Ember.Component.extend({
  isShowingHover: false,

  commitTitle: function() {
    if (this.get('vm.commit.title') && this.get('vm.commit.title').match(/^Merge/)) {
      return this.get('vm.commit.title').replace(/ of.*/g,'').replace(/ into.*/g,'');
    }
    return this.get('vm.commit.title');
  }.property('vm.commit.title'),

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
      if (parseInt(month) < 10) { month = '0' + month; }
      year = year + '';
      displayDate = year.substring(2) + "/" + month + "/" + day;
    }

    return displayDate + ' - ';
  }.property('vm.commit.created_at'),

  setShowingHover: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    if (access_level >= 20) {
      this.set('isShowingHover', this.get('isShowingHovers') === this.get('vm').id);
    } else {
      this.set('isShowingHover', false);
    }
  }.observes('isShowingHovers'),

  // Return true if is running state
  isRunning: function() {
    if (parseInt(this.get('vm.status'), 10) > 0) { return true; }
    return false;
  }.property('vm.status'),

  // Return true if user is a Dev or more
  isDev: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 30) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  actions: {
    // close the modal, reset showing variable
    closeHover: function() {
      this.set('isShowingHovers', -1);
    }
  }
});
