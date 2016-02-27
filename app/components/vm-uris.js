import Ember from 'ember';

export default Ember.Component.extend({
  isShowingUri: false,

  // check if the modal must be displayed (isShowingUris must be equal to the current vm id)
  setShowingUri: function() {
    this.set('isShowingUri', this.get('isShowingUris') === this.get('vm').id);
  }.observes('isShowingUris'),

  // Return true if is running state
  isRunning: function() {
    if (parseInt(this.get('vm.status'), 10) > 0) { return true; }
    return false;
  }.property('vm.status'),

  // get branch name (fix for weird bug with name property)
  branchName: function() {
    return this.get('vm.commit.branche.id').replace(/^[0-9][0-9]*-/,'');
  }.property('isShowingUris'),

  // Return true if user is a Dev or more
  isDev: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 30) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  // Check if we have mysql into model
  isMysql: function() {
    var technos = this.get('vm.project.technos');
    if (technos.findBy('name', 'mysql')) {
      return true;
    }

    return false;
  }.property('isShowingUris'),

  // Check if we have nodejs into model
  isNodejs: function() {
    var technos = this.get('vm.project.technos');
    if (technos.findBy('name', 'nodejs')) {
      return true;
    }

    return false;
  }.property('isShowingUris'),

  // Check if we have a web server into model
  isWeb: function() {
    var technos = this.get('vm.project.technos');
    var isWeb = false;

    technos.forEach(function (techno) {
      if (techno.get('technotype').get('name').match(/^Web/)) {
        isWeb = true;
      }
    });

    return isWeb;
  }.property('isShowingUris'),

  // Check if we have sf2 framework
  isSf2: function() {
    var framework = this.get('vm.project.framework.name');
    if (framework.match(/^Symfony/)) {
      return true;
    }

    return false;
  }.property('isShowingUris'),

  // Check if we have composer with cms/framework
  isComposer: function() {
    var framework = this.get('vm.project.framework.name');
    if (framework.match(/^Symfony/) || framework.match(/^Drupal8/)) {
      return true;
    }

    return false;
  }.property('isShowingUris'),

  // Check if we have drupal
  isDrupal: function() {
    var framework = this.get('vm.project.framework.name');
    if (framework.match(/^Drupal/)) {
      return true;
    }

    return false;
  }.property('isShowingUris'),

  // reset isHTTPS property
  resetHTTPS: function () {
    this.set('isHTTPS', false);
  }.property('isShowingUris'),

  actions: {
    // close the modal, reset showing variable
    closeUris: function() {
      this.set('isShowingUris', -1);
      this.set('isBusy', false);
    },

    // toggle https property
    toggleHTTPS: function() {
      this.toggleProperty('isHTTPS');
    },

    // open vm uri
    openVmURI: function(uritype) {
      var login = this.get('vm.project.login');
      var password = this.get('vm.project.password');
      var authcreds = login + ":" + password + "@";
      var is_auth = this.get('vm.is_auth');
      var uri = this.get('vm.name');
      var uri_with_creds = '';
      var uri_xmlhttp_req = '';
      var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
      var is_ff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
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
        default:
          uri_with_creds = scheme + '://' + authcreds + uri + '/pm_tools/' + uritype + '/';
          uri_xmlhttp_req = scheme + '://' + uri + '/pm_tools/' + uritype + '/';
      }

      if (uri_with_creds === '') {
        return;
      }

      if (is_auth && (is_chrome || is_ff)) {
        window.open(uri_with_creds);
      } else {
        window.open(uri_xmlhttp_req);
      }
    }
  }
});