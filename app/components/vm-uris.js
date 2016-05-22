import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  URIS: [],
  loadingModal: false,
  requestRunning: false,
  message: null,
  viewPostinstall: false,

  // trigger function when model changes
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('loadingModal', false);
    this.set('message', null);
    this.set('requestRunning', false);
    this.set('viewPostinstall', false);
  },

  // inverse of isrunning
  closeModal: function() {
    if (this.get('requestRunning')) { return false; }
    return true;
  }.property('requestRunning'),

  // Return true if is running state
  isRunning: function() {
    if (parseInt(this.get('vm.status'), 10) > 0) { return true; }
    return false;
  }.property('vm.status'),

  // Check if we have a web server into model
  isWeb: function() {
    var technos = this.get('vm.technos');
    var isWeb = false;

    technos.forEach(function (techno) {
      if (techno.get('technotype').get('name').match(/^Web/)) {
        isWeb = true;
      }
    });

    return isWeb;
  }.property('vm'),

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
  }.observes('isShowingUris'),

  // init URIS array
  initURIS: function () {
    var self = this;

    this.set('URIS', []);
    this.get('vm').get('uris').forEach(function (ep) {
      if (ep.get('framework').get('name') !== 'NoWeb') {
        self.get('URIS').push({uri: ep.get('absolute'), href: self.getURI(ep.get('absolute'))});
        if (ep.get('aliases') && ep.get('aliases') !== '') {
          ep.get('aliases').split(' ').forEach(function (aliase) {
            self.get('URIS').push({uri: aliase, href: self.getURI(aliase)});
          });
        }
      }
    });
  }.observes('isShowingUris', 'isHTTPS'),

  // return phpmyadmin uri for the vm
  pmaURI: function() {
    return this.getTOOL('phpmyadmin');
  }.property('isShowingUris', 'isHTTPS'),

  // return logs uri for the vm
  tailURI: function() {
    return this.getTOOL('tail');
  }.property('isShowingUris', 'isHTTPS'),

  // return phpinfo uri for the vm
  pminfoURI: function() {
    return this.getTOOL('pminfo');
  }.property('isShowingUris', 'isHTTPS'),

  // return (sf) logs uri for the vm
  sflogsURI: function() {
    return this.getTOOL('tailsf2');
  }.property('isShowingUris', 'isHTTPS'),

  // open vm uri
  getURI: function(uri) {
    var login = this.get('vm.htlogin');
    var password = this.get('vm.htpassword');
    var authcreds = login + ":" + password + "@";
    var is_auth = this.get('vm.is_auth');
    var uri_with_creds = '';
    var uri_xmlhttp_req = '';
    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    var is_ff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    var is_iphone = navigator.userAgent.toLowerCase().indexOf('iphone') > -1;
    var is_ipad = navigator.userAgent.toLowerCase().indexOf('ipad') > -1;
    var scheme = 'http';

    if (this.get('isHTTPS')) {
      scheme = 'https';
    }

    uri_with_creds = scheme + '://' + authcreds + uri + '/';
    uri_xmlhttp_req = scheme + '://' + uri + '/';

    if (is_auth && (is_chrome || is_ff || is_iphone || is_ipad)) {
      return uri_with_creds;
    } else {
      return uri_xmlhttp_req;
    }
  },

  // open vm uri
  getTOOL: function(uritype) {
    var login = this.get('vm.htlogin');
    var password = this.get('vm.htpassword');
    var authcreds = login + ":" + password + "@";
    var is_auth = this.get('vm.is_auth');
    var uri = this.get('vm.name');
    var uri_with_creds = '';
    var uri_xmlhttp_req = '';
    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    var is_ff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    var is_iphone = navigator.userAgent.toLowerCase().indexOf('iphone') > -1;
    var is_ipad = navigator.userAgent.toLowerCase().indexOf('ipad') > -1;
    var scheme = 'http';

    if (this.get('isHTTPS')) {
      scheme = 'https';
    }

    uri_with_creds = scheme + '://' + authcreds + 'pmtools.' + uri + '/' + uritype + '/';
    uri_xmlhttp_req = scheme + '://pmtools.' + uri + '/' + uritype + '/';

    if (is_chrome || is_ff || is_iphone || is_ipad) {
      return uri_with_creds;
    } else {
      return uri_xmlhttp_req;
    }
  },

  actions: {
    requestTool: function(request) {
      var self = this;
      var current_id = this.get('vm').get('id');

      this.set('requestRunning', true);
      this.set('message', null);
      this.set('loadingModal', true);

      if (request === 'postinstall_display') {
        this.set('viewPostinstall', true);
      }

      Ember.$.ajax({
          url: config.APP.APIHost + "/api/v1/vms/" + current_id + "/" + request,
          method: "POST",
          global: false,
          headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
        })
        .done(function(plain) {
          self.set('requestRunning', false);
          if (plain && plain.length) {
            self.set('message', plain);
            if (request === 'postinstall_display') {
              self.set('message2', "Look with attention the content of this script.<br>And if you are agree with that, you can now execute this on the vm at your own risk !");
            }
          } else {
            self.set('loadingModal', false);
          }
        })
        .fail(function() {
          self.set('requestRunning', false);
          self.set('message', 'Error occurs during execution !');
          Ember.run.later(function(){
            self.set('loadingModal', false);
          }, 10000);
        });
    },
    // close the modal, reset showing variable
    closeUris: function() {
      var self = this;
      this.set('isShowingUris', false);
      this.set('isBusy', false);
      // little pause before reset vm for avoif clipping
      Ember.run.later(function(){
       self.set('vm', null);
      }, 500);
    },

    // toggle https property
    toggleHTTPS: function(isToggled) {
      this.set('isHTTPS', isToggled);
    }
  }
});