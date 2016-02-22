import Ember from 'ember';

export default Ember.Component.extend({
  isShowingDetail: false,

  // check if the modal must be displayed (isShowingDetails must be equal to the current project id)
  setShowingDetail: function() {
    this.set('isShowingDetail', this.get('isShowingDetails') === this.get('project').id);
  }.observes('isShowingDetails'),

  // Return ftp username for current project
  getFtpUser: function() {
    var gitpath = this.get('project').get('gitpath');
    if (! gitpath) { return ""; }

    return gitpath.replace(/.*\//g, "");
  }.property('project.gitpath'),

  // Return ftp password for the current project
  getFtpPassword: function() {
    var ftppasswd = 'nextdeploy';
    var password = this.get('project').get('password');

    if (password && password.length > 0) {
      ftppasswd = password.substring(0,8);
    }

    return ftppasswd;
  }.property('project.password'),

  // Return ftp host for current project
  getFtpHost: function() {
    return 'f.' + window.location.hostname.replace(/^ui\./,'');
  }.property('project.gitpath'),

  actions: {
    // close the modal, reset showing variable
    closeDetails: function() {
      this.set('isShowingDetails', -1);
      this.set('isBusy', false);
    }
  }
});
