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

  // Return true if user is a Dev or more
  isDev: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 30) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  // Return true if user is a PM or more
  isPM: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 20) { return true; }
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
    var isNode = false;

    technos.forEach(function (techno) {
      if (techno.get('technotype').get('name').match(/Node/)) {
        isNode = true;
      }
    });

    return isNode;
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
    if (framework.match(/^Symfony/) ||
        framework.match(/^Drupal/) ||
        framework.match(/^Static/) ||
        framework.match(/^Wordpress/)) {
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

  // Check if we have drupal
  isDrupal8: function() {
    var framework = this.get('vm.project.framework.name');
    if (framework.match(/^Drupal8/)) {
      return true;
    }

    return false;
  }.property('isShowingUris'),

  // reset isHTTPS property
  resetHTTPS: function () {
    this.set('isHTTPS', false);
  }.property('isShowingUris'),

  // return main uri for the vm
  mainURI: function() {
    return this.getURI('main');
  }.property('isShowingUris', 'isHTTPS'),

  // return admin uri for the vm
  adminURI: function() {
    return this.getURI('admin');
  }.property('isShowingUris', 'isHTTPS'),

  // return mobile uri for the vm
  mobileURI: function() {
    return this.getURI('mobile');
  }.property('isShowingUris', 'isHTTPS'),

  // return html uri for the vm
  htmlURI: function() {
    return this.getURI('html');
  }.property('isShowingUris', 'isHTTPS'),

  // return nodejs uri for the vm
  nodejsURI: function() {
    return this.getURI('nodejs');
  }.property('isShowingUris', 'isHTTPS'),

  // return gitsync uri for the vm
  gitsyncURI: function() {
    return this.getURI('gitsync');
  }.property('isShowingUris', 'isHTTPS'),

  // return npmsh uri for the vm
  npmURI: function() {
    return this.getURI('npmsh');
  }.property('isShowingUris', 'isHTTPS'),

  // return phpmyadmin uri for the vm
  pmaURI: function() {
    return this.getURI('phpmyadmin');
  }.property('isShowingUris', 'isHTTPS'),

  // return logs uri for the vm
  tailURI: function() {
    return this.getURI('tail');
  }.property('isShowingUris', 'isHTTPS'),

  // return phpinfo uri for the vm
  pminfoURI: function() {
    return this.getURI('pminfo');
  }.property('isShowingUris', 'isHTTPS'),

  // return (drupal) cc uri for the vm
  druccURI: function() {
    return this.getURI('drupalcc');
  }.property('isShowingUris', 'isHTTPS'),

  // return (drupal) updb uri for the vm
  drupdbURI: function() {
    return this.getURI('drupalupdb');
  }.property('isShowingUris', 'isHTTPS'),

  // return (drupal) cim uri for the vm
  drucimURI: function() {
    return this.getURI('drupalcim');
  }.property('isShowingUris', 'isHTTPS'),

  // return composer uri for the vm
  composerURI: function() {
    return this.getURI('composerinstall');
  }.property('isShowingUris', 'isHTTPS'),

  // return (sf) doctrine uri for the vm
  sfdoctrineURI: function() {
    return this.getURI('sf2schema');
  }.property('isShowingUris', 'isHTTPS'),

  // return (sf) migration uri for the vm
  sfmigrationURI: function() {
    return this.getURI('sf2migrate');
  }.property('isShowingUris', 'isHTTPS'),

  // return (sf) logs uri for the vm
  sflogsURI: function() {
    return this.getURI('tailsf2');
  }.property('isShowingUris', 'isHTTPS'),

  // open vm uri
  getURI: function(uritype) {
    var login = this.get('vm.htlogin');
    var password = this.get('vm.htpassword');
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
      return uri_with_creds;
    } else {
      return uri_xmlhttp_req;
    }
  },

  actions: {
    // close the modal, reset showing variable
    closeUris: function() {
      this.set('isShowingUris', -1);
      this.set('isBusy', false);
    },

    // toggle https property
    toggleHTTPS: function() {
      this.toggleProperty('isHTTPS');
    }
  }
});