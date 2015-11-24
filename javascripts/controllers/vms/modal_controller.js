// Ember controller for vm modals
var VmsModalController = Ember.ObjectController.extend({
  isHTTPS: false,
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

  // Check if we have drupal
  isDrupal: function() {
    var framework = this.get('project.framework.name');
    if (framework.match(/^Drupal/)) {
      return true;
    }

    return false;    
  }.property('project'),

  // reset isHTTPS property
  resetHTTPS: function () {
    this.set('isHTTPS', false);
  }.property('project'),

  actions: {
    // toggle https property
    toggleHTTPS: function() {
      this.toggleProperty('isHTTPS') ;
    },
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
      var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
      var scheme = 'http';

      if (this.get('isHTTPS')) {
        scheme = 'https';
      }
      

      switch(uritype) {
        case 'main':
          uri_with_creds = scheme + '://' + authcreds + uri + '/';
          uri_xmlhttp_req = scheme + '://' + uri + '/';
          break;
        case 'admin':
          uri_with_creds = scheme + '://' + authcreds + 'admin.' + uri + '/';
          uri_xmlhttp_req = scheme + '://admin.' + uri +'/';
          break;
        case 'mobile':
          uri_with_creds = scheme + '://' + authcreds + 'm.' + uri +'/';
          uri_xmlhttp_req = scheme + '://m.' + uri +'/';
          break;
        case 'html':
          uri_with_creds = scheme + '://' + authcreds + uri + '/_html/';
          uri_xmlhttp_req = scheme + '://' + uri + '/_html/';
          break;
        case 'nodejs':
          uri_with_creds = scheme + '://' + authcreds + 'nodejs.' + uri + '/';
          uri_xmlhttp_req = scheme + '://nodejs.' + uri + '/';
          break;
        case 'gitpull':
          uri_with_creds = scheme + '://' + authcreds + uri + '/pm_tools/gitsync/';
          uri_xmlhttp_req = scheme + '://' + uri + '/pm_tools/gitsync/';
          break;
        case 'phpmyadmin':
          uri_with_creds = scheme + '://' + authcreds + uri + '/pm_tools/phpmyadmin/';
          uri_xmlhttp_req = scheme + '://' + uri + '/pm_tools/phpmyadmin/';
          break;
        case 'tail':
          uri_with_creds = scheme + '://' + authcreds + uri + '/pm_tools/tail/';
          uri_xmlhttp_req = scheme + '://' + uri + '/pm_tools/tail/';
          break;
        case 'phpinfo':
          uri_with_creds = scheme + '://' + authcreds + uri + '/pm_tools/pminfo/';
          uri_xmlhttp_req = scheme + '://' + uri + '/pm_tools/pminfo/';
          break;
        case 'clearvarnish':
          uri_with_creds = scheme + '://' + authcreds + uri + '/pm_tools/clearvarnish/';
          uri_xmlhttp_req = scheme + '://' + uri + '/pm_tools/clearvarnish/';
          break;
        case 'composerinstall':
          uri_with_creds = scheme + '://' + authcreds + uri + '/pm_tools/composerinstall/';
          uri_xmlhttp_req = scheme + '://' + uri + '/pm_tools/composerinstall/';
          break;
        case 'sf2schema':
          uri_with_creds = scheme + '://' + authcreds + uri + '/pm_tools/sf2schema/';
          uri_xmlhttp_req = scheme + '://' + uri + '/pm_tools/sf2schema/';
          break;
        case 'sf2migrate':
          uri_with_creds = scheme + '://' + authcreds + uri + '/pm_tools/sf2migrate/';
          uri_xmlhttp_req = scheme + '://' + uri + '/pm_tools/sf2migrate/';
          break;
        case 'sf2logs':
          uri_with_creds = scheme + '://' + authcreds + uri + '/pm_tools/tailsf2/';
          uri_xmlhttp_req = scheme + '://' + uri + '/pm_tools/tailsf2/';
          break;
        case 'drupalcc':
          uri_with_creds = scheme + '://' + authcreds + uri + '/pm_tools/drupalcc/';
          uri_xmlhttp_req = scheme + '://' + uri + '/pm_tools/drupalcc/';
          break;
       case 'drupalupdb':
          uri_with_creds = scheme + '://' + authcreds + uri + '/pm_tools/drupalupdb/';
          uri_xmlhttp_req = scheme + '://' + uri + '/pm_tools/drupalupdb/';
          break; 
      }
      
      if (uri_with_creds == '') {
        return;
      }

      if (is_chrome) {
        window.open(uri_with_creds);
      } else {
        window.open(uri_xmlhttp_req);
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
      //  window.open(uri_with_creds);
      //}
      //
    }
  }
});

module.exports = VmsModalController;