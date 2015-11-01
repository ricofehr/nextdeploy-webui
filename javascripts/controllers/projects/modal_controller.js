// Ember controller for project modals
var ProjectsModalController = Ember.ObjectController.extend({
  // show / hide modal
  showDetails: function() {
    $('#modalproject').modal('show');
  },

  hideDetails: function() {
    $('#modalproject').modal('hide');
  },

  // Return true if authentified user is a Dev or more
  isDev: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel') ;

    if (access_level >= 30) return true ;
    return false ;
  }.property('App.AuthManager.apiKey'),

  // Check if we have mysql into model
  isMysql: function() {
    var technos = this.get('technos');
    if (technos.findBy('name', 'mysql')) {
      return true;
    }

    return false;    
  }.property('technos'),

  // Check if we have mysql into model
  isNodejs: function() {
    var technos = this.get('technos');
    if (technos.findBy('name', 'nodejs')) {
      return true;
    }

    return false;    
  }.property('technos'),

  // Check if we have mysql into model
  isSf2: function() {
    var framework = this.get('framework.name');
    if (framework == "Symfony2") {
      return true;
    }

    return false;    
  }.property('framework'),

  // Return ftp username for current project
  getFtpUser: function() {
    var gitpath = this.get('gitpath');
    if (! gitpath) return "";
    
    return gitpath.replace(/.*\//g, "");
  }.property('gitpath'),

  // Return ftp password for the current project
  getFtpPassword: function() {
    var ftppasswd = 'mvmc';
    var password = this.get('password');

    if (password && password.length > 0) {
      ftppasswd = password.substring(0,8);
    }

    return ftppasswd;
  }.property('password'),

  // Return ftp host for current project
  getFtpHost: function() {
    return 'f.' + window.location.hostname;
  }.property('gitpath')
});

module.exports = ProjectsModalController;