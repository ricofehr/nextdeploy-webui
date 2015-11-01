// Ember controller for vm modals
var VmsModalController = Ember.ObjectController.extend({
  // show / hide modals
  showUri: function() {
    $('#modaluris').modal('show');
  },

  showDetails: function() {
    $('#modalvm').modal('show');
  },

  hideUri: function() {
    $('#modaluris').modal('hide');
  },

  hideDetails: function() {
    $('#modalvm').modal('hide');
  },

  // Return true if authentified user is a Dev or more
  isDev: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel') ;

    if (access_level >= 30) return true ;
    return false ;
  }.property('App.AuthManager.apiKey'),

  // Check if we have mysql into model
  isMysql: function() {
    var technos = this.get('project.technos');
    if (technos.findBy('name', 'mysql')) {
      return true;
    }

    return false;    
  }.property('project'),

  // Return true if is running state
  isRunning: function() {
    if (parseInt(this.get('status'), 10) > 0) return true;
    return false;
  }.property('status'),

  // Check if we have mysql into model
  isNodejs: function() {
    var technos = this.get('project.technos');
    if (technos.findBy('name', 'nodejs')) {
      return true;
    }

    return false;    
  }.property('project'),

  // Check if we have mysql into model
  isSf2: function() {
    var framework = this.get('project.framework.name');
    if (framework == "Symfony2") {
      return true;
    }

    return false;    
  }.property('project'),


  actions: {
    // open vm uri
    openVmURI: function(uritype) {
      var login = this.get('project.login');
      var password = this.get('project.password');
      var uri = this.get('name');
      var openuri = '';
      var authcreds = login + ":" + password + "@";

      switch(uritype) {
        case 'main':
          openuri = 'http://' + authcreds + uri + '/';
          break;
        case 'admin':
          openuri = 'http://' + authcreds + 'admin.' + uri + '/';
          break;
        case 'mobile':
          openuri = 'http://' + authcreds + 'm.' + uri +'/';
          break;
        case 'html':
          openuri = 'http://' + authcreds + uri + '/_html/';
          break;
        case 'nodejs':
          openuri = 'http://' + authcreds + 'nodejs.' + uri + '/';
          break;
        case 'gitpull':
          openuri = 'http://' + authcreds + uri + '/pm_tools/gitsync/';
          break;
        case 'phpmyadmin':
          openuri = 'http://' + authcreds + uri + '/pm_tools/phpmyadmin/';
          break;
        case 'tail':
          openuri = 'http://' + authcreds + uri + '/pm_tools/tail/';
          break;
        case 'phpinfo':
          openuri = 'http://' + authcreds + uri + '/pm_tools/pminfo/';
          break;
        case 'clearvarnish':
          openuri = 'http://' + authcreds + uri + '/pm_tools/clearvarnish/';
          break;
        case 'composerinstall':
          openuri = 'http://' + authcreds + uri + '/pm_tools/composerinstall/';
          break;
        case 'sf2cmds':
          openuri = 'http://' + authcreds + uri + '/pm_tools/sf2/';
          break;
        case 'sf2logs':
          openuri = 'http://' + authcreds + uri + '/pm_tools/tailsf2/';
          break;
      }
      
      if (openuri == '') {
        return;
      }

      /*
      xmlHttp=new XMLHttpRequest();
      xmlHttp.withCredentials = true;
      xmlHttp.mozBackgroundRequest = true;
      xmlHttp.open("GET", openuri, true);
      xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(login + ":" + password));
      xmlHttp.send(null);

      xmlHttp.onload = function() {
        window.open(openuri);
      }
      */
      window.open(openuri);
    }
  }
});

module.exports = VmsModalController;