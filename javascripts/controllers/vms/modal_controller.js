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
      var authcreds = login + ":" + password + "@";
      var uri = this.get('name');
      var uri_with_creds = '';
      var uri_xmlhttp_req = '';
      var uri_status = 'http://' + uri + '/status_ok';
      var popup = null;
      

      switch(uritype) {
        case 'main':
          uri_with_creds = 'http://' + authcreds + uri + '/';
          uri_xmlhttp_req = 'http://' + uri + '/';
          break;
        case 'admin':
          uri_with_creds = 'http://' + authcreds + 'admin.' + uri + '/';
          uri_xmlhttp_req = 'http://admin.' + uri +'/';
          break;
        case 'mobile':
          uri_with_creds = 'http://' + authcreds + 'm.' + uri +'/';
          uri_xmlhttp_req = 'http://m.' + uri +'/';
          break;
        case 'html':
          uri_with_creds = 'http://' + authcreds + uri + '/_html/';
          uri_xmlhttp_req = 'http://' + uri + '/_html/';
          break;
        case 'nodejs':
          uri_with_creds = 'http://' + authcreds + 'nodejs.' + uri + '/';
          uri_xmlhttp_req = 'http://nodejs.' + uri + '/';
          break;
        case 'gitpull':
          uri_with_creds = 'http://' + authcreds + uri + '/pm_tools/gitsync/';
          uri_xmlhttp_req = 'http://' + uri + '/pm_tools/gitsync/';
          break;
        case 'phpmyadmin':
          uri_with_creds = 'http://' + authcreds + uri + '/pm_tools/phpmyadmin/';
          uri_xmlhttp_req = 'http://' + uri + '/pm_tools/phpmyadmin/';
          break;
        case 'tail':
          uri_with_creds = 'http://' + authcreds + uri + '/pm_tools/tail/';
          uri_xmlhttp_req = 'http://' + uri + '/pm_tools/tail/';
          break;
        case 'phpinfo':
          uri_with_creds = 'http://' + authcreds + uri + '/pm_tools/pminfo/';
          uri_xmlhttp_req = 'http://' + uri + '/pm_tools/pminfo/';
          break;
        case 'clearvarnish':
          uri_with_creds = 'http://' + authcreds + uri + '/pm_tools/clearvarnish/';
          uri_xmlhttp_req = 'http://' + uri + '/pm_tools/clearvarnish/';
          break;
        case 'composerinstall':
          uri_with_creds = 'http://' + authcreds + uri + '/pm_tools/composerinstall/';
          uri_xmlhttp_req = 'http://' + uri + '/pm_tools/composerinstall/';
          break;
        case 'sf2cmds':
          uri_with_creds = 'http://' + authcreds + uri + '/pm_tools/sf2/';
          uri_xmlhttp_req = 'http://' + uri + '/pm_tools/sf2/';
          break;
        case 'sf2logs':
          uri_with_creds = 'http://' + authcreds + uri + '/pm_tools/tailsf2/';
          uri_xmlhttp_req = 'http://' + uri + '/pm_tools/tailsf2/';
          break;
      }
      
      if (uri_with_creds == '') {
        return;
      }

      //popup = window.open(uri_status);
      // if no popup-blocker, open the uri thanks to xmlhttprequest
      // else open with credentials into uri
      //if (popup) {

      //  xmlHttp=new XMLHttpRequest();
      //  xmlHttp.withCredentials = true;
      //  xmlHttp.mozBackgroundRequest = true;
      //  xmlHttp.open("GET", uri_xmlhttp_req, true);
      //  xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(login + ":" + password));
      //  xmlHttp.send(null);

      //  xmlHttp.onload = function() {
      //    popup.location.href = uri_xmlhttp_req;
          //popup.close();
          //window.open(uri_xmlhttp_req);
      //  }
      //} else {
        window.open(uri_with_creds);
      //}
    }
  }
});

module.exports = VmsModalController;