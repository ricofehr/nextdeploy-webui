import Ember from 'ember';
import config from '../config/environment';

/**
 *  This component manages uris modal for vm
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class VmUris
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Send a request to the api for executing a tool into the vm
     *
     *  @event requestTool
     */
    requestTool: function(request) {
      var self = this;
      var currentId = this.get('vm').get('id');

      this.set('requestRunning', true);
      this.set('message', null);
      this.set('message2', null);

      this.showSubModal(true);

      if (request === 'postinstall_display') {
        this.set('viewPostinstall', true);
      }

      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/vms/" + currentId + "/" + request,
        method: "POST",
        global: false,
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
      })
      .done(function(plain) {
        self.set('requestRunning', false);
        if (plain && plain.length) {
          self.set('message', plain);
          if (request === 'postinstall_display') {
            var message2 = "Look with attention the content of this script.<br>" +
                          "And if you are agree with that, " +
                          "you can now execute this on the vm at your own risk !";
            self.set('message2', message2);
          }
        } else {
          self.set('message', 'Request is finished on remote VM (silently return).');
        }
      })
      .fail(function() {
        self.set('requestRunning', false);
        self.set('message', 'Error occurs during execution !');
        Ember.run.later(function(){
          self.showSubModal(false);
        }, 10000);
      });
    },

    /**
     *  Close the modal and reset component variables
     *
     *  @event closedUris
     */
    closedUris: function() {
      if (!this.get('subModal')) {
        this.set('isShowingUris', false);
        this.set('isBusy', false);
        this.set('vm', null);
      }
    },

    /**
     *  Close the loading/cmd modal
     *
     *  @event closedLoading
     */
    closedLoading: function() {
      this.showSubModal(false);
    },
  },

  /**
   *  Flag to show the loading modal
   *
   *  @property loadingModal
   *  @type {Boolean}
   */
  loadingModal: false,

  /**
   *  Flag on request running state
   *
   *  @property requestRunning
   *  @type {Boolean}
   */
  requestRunning: false,

  /**
   *  Message to display for user
   *
   *  @property message
   *  @type {String}
   */
  message: null,

  /**
   *  Flag to display the postinstall confirm
   *
   *  @property viewPostinstall
   *  @type {Boolean}
   */
  viewPostinstall: false,

  /**
   *  Flag to display the submodal (for cmd return)
   *
   *  @property subModal
   *  @type {Boolean}
   */
  subModal: false,

  /**
   *  Flag to enable the fade effect on modal
   *
   *  @property fadeUris
   *  @type {Boolean}
   */
  fadeUris: true,

  /**
   *  Inverse of isrunning
   *
   *  @function closeModal
   *  @returns {Boolean}
   */
  closeModal: function() {
    if (this.get('requestRunning')) {
      return false;
    }
    return true;
  }.property('requestRunning'),

  /**
   *  Return true if vm is in running state
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
   *  Return true if vm includes a web server techno
   *
   *  @function isWeb
   *  @returns {Boolean}
   */
  isWeb: function() {
    var technos = this.get('vm.technos');
    var isWeb = false;

    technos.forEach(function(techno) {
      // HACK technotype name test (a dynamic value from api)
      if (techno.get('technotype').get('name').match(/^Cache/)) {
        isWeb = true;
      }
    });

    return isWeb;
  }.property('vm'),

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
  }.property('session.data.authenticated.access_level'),

  /**
   *  Check if current user is admin, lead, dev, or ProjectManager
   *
   *  @function isPM
   *  @returns {Boolean} True if admin, lead, dev, or pm
   */
  isPM: function() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel >= 20) {
      return true;
    }

    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Return true if vm includes a mysql techno
   *
   *  @function isMysql
   *  @returns {Boolean}
   */
  isMysql: function() {
    var technos = this.get('vm.project.technos');

    // HACK techno name test (a dynamic value from api)
    if (technos.findBy('name', 'mysql')) {
      return true;
    }

    return false;
  }.property('vm'),

  /**
   *  Return true if vm includes a cms/framework using composer
   *
   *  @function isComposer
   *  @returns {Boolean}
   */
  isComposer: function() {
    var framework = this.get('vm.project.framework.name');

    // HACK framework name test (a dynamic value from api)
    if (framework.match(/^Symfony/) ||
        framework.match(/^Drupal/) ||
        framework.match(/^Static/) ||
        framework.match(/^Wordpress/)) {
      return true;
    }

    return false;
  }.property('vm'),

  /**
   *  Return true if vm includes a Drupal cms
   *
   *  @function isDrupal
   *  @returns {Boolean}
   */
  isDrupal: function() {
    var framework = this.get('vm.project.framework.name');

    // HACK framework name test (a dynamic value from api)
    if (framework.match(/^Drupal/)) {
      return true;
    }

    return false;
  }.property('vm'),

  /**
   *  Return true if vm includes a Drupal8 cms
   *
   *  @function isDrupal8
   *  @returns {Boolean}
   */
  isDrupal8: function() {
    var framework = this.get('vm.project.framework.name');

    // HACK framework name test (a dynamic value from api)
    if (framework.match(/^Drupal8/)) {
      return true;
    }

    return false;
  }.property('vm'),

  /**
   *  Generates URIS array
   *
   *  @function URIS
   *  @returns {String[]}
   */
  URIS: function () {
    var self = this;
    var ret = [];

    if (!this.get('vm')) {
      return ret;
    }

    // Rset some component variables
    this.set('message', null);
    this.set('requestRunning', false);
    this.set('viewPostinstall', false);

    this.get('vm').get('uris').forEach(function (ep) {
      if (ep.get('framework').get('name') !== 'NoWeb') {
        ret.push({
          uri: ep.get('absolute'),
          href: self.getURI(ep.get('absolute'), ep.get('is_ssl'))
        });
        if (ep.get('aliases') && ep.get('aliases') !== '') {
          ep.get('aliases').split(' ').forEach(function (aliase) {
            ret.push({
              uri: aliase,
              href: self.getURI(aliase, ep.get('is_ssl'))
            });
          });
        }
      }
    });

    return ret;
  }.property('vm'),

  /**
   *  Return true if local nextdeploy install
   *  In local install, ssl endpoints are forbidden
   *
   *  @function isLocal
   *  @returns {Boolean} true if local install (or endpoint already exists)
   */
  isLocal: function() {
    var vmName = this.get('vm.name');
    // HACK verify a local install from the vm name
    return vmName.match(/os.nextdeploy$/);
  }.property('vm'),

  /**
   *  Return jenkins uri for the vm
   *
   *  @function jenkinsURI
   *  @returns {String}
   */
  jenkinsURI: function() {
    return this.getCITOOL('jenkins');
  }.property('vm'),

  /**
   *  Return sonar uri for the vm
   *
   *  @function sonarURI
   *  @returns {String}
   */
  sonarURI: function() {
    return this.getCITOOL('sonar');
  }.property('vm'),

  /**
   *  Return doc uri for the vm
   *
   *  @function pmdocURI
   *  @returns {String}
   */
  pmdocURI: function() {
    return this.getCITOOL('pmdoc');
  }.property('vm'),

  /**
   *  Return phpmyadmin uri for the vm
   *
   *  @function pmaURI
   *  @returns {String}
   */
  pmaURI: function() {
    return this.getTOOL('phpmyadmin');
  }.property('vm'),

  /**
   *  Return logs uri for the vm
   *
   *  @function tailURI
   *  @returns {String}
   */
  tailURI: function() {
    return this.getTOOL('tail');
  }.property('vm'),

  /**
   *  Return phpinfo uri for the vm
   *
   *  @function pminfoURI
   *  @returns {String}
   */
  pminfoURI: function() {
    return this.getTOOL('pminfo');
  }.property('vm'),

  /**
   *  Return (sf) logs uri for the vm
   *
   *  @function sflogsURI
   *  @returns {String}
   */
  sflogsURI: function() {
    return this.getTOOL('tailsf2');
  }.property('vm'),

  /**
   *  Trigger when receives models
   *
   *  @method didReceiveAttrs
   */
  didReceiveAttrs() {
    this._super(...arguments);
  },

  /**
   *  Switch between uris modal and cmd submodal
   *
   *  @method showSubModal
   */
  showSubModal: function(show) {
    var self = this;

    this.set('subModal', show);
    if (show) {
      this.set('fadeUris', false);
      this.set('isShowingUris', false);
      this.set('loadingModal', true);
    } else {
      this.set('loadingModal', false);
      this.set('message2', null);
      this.set('isShowingUris', true);

      Ember.run.later(function() {
        self.set('fadeUris', true);
      }, 500);
    }
  },

  /**
   *  Generates an absolute URI for an endpoint into the vm
   *
   *  @function getURI
   *  @returns {String}
   */
  getURI: function(uri, isSsl) {
    var login = this.get('vm.htlogin');
    var password = this.get('vm.htpassword');
    var authcreds = login + ":" + password + "@";
    var isAuth = this.get('vm.is_auth');
    var uriWithCreds = '';
    var uriXmlHttpReq = '';
    // var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    var isFF = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    var isIphone = navigator.userAgent.toLowerCase().indexOf('iphone') > -1;
    var isIpad = navigator.userAgent.toLowerCase().indexOf('ipad') > -1;
    var scheme = 'http';

    if (isSsl) {
      scheme = 'https';
    }

    uriWithCreds = scheme + '://' + authcreds + uri + '/';
    uriXmlHttpReq = scheme + '://' + uri + '/';

    if (isAuth && (isFF || isIphone || isIpad)) {
      return uriWithCreds;
    } else {
      return uriXmlHttpReq;
    }
  },

  /**
   *  Generates an absolute URI for a Tool
   *
   *  @function getTOOL
   *  @returns {String}
   */
  getTOOL: function(uritype) {
    var login = this.get('vm.htlogin');
    var password = this.get('vm.htpassword');
    var authcreds = login + ":" + password + "@";
    var uri = this.get('vm.name');
    var uriWithCreds = '';
    var uriXmlHttpReq = '';
    // var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    var isFF = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    var isIphone = navigator.userAgent.toLowerCase().indexOf('iphone') > -1;
    var isIpad = navigator.userAgent.toLowerCase().indexOf('ipad') > -1;
    var scheme = 'https';

    // HACK force http for local install
    if (uri.match(/os.nextdeploy$/)) {
      scheme = 'http';
    }

    uriWithCreds = scheme + '://' + authcreds + 'pmtools-' + uri + '/' + uritype + '/';
    uriXmlHttpReq = scheme + '://pmtools-' + uri + '/' + uritype + '/';

    if (isFF || isIphone || isIpad) {
      return uriWithCreds;
    } else {
      return uriXmlHttpReq;
    }
  },

  /**
   *  Generates an absolute URI for a CI Tool
   *
   *  @function getCITOOL
   *  @returns {String}
   */
  getCITOOL: function(uritype) {
    var login = this.get('vm.htlogin');
    var password = this.get('vm.htpassword');
    var authcreds = login + ":" + password + "@";
    var uri = this.get('vm.name');
    var uriWithCreds = '';
    var uriXmlHttpReq = '';
    // var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    var isFF = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    var isIphone = navigator.userAgent.toLowerCase().indexOf('iphone') > -1;
    var isIpad = navigator.userAgent.toLowerCase().indexOf('ipad') > -1;
    var scheme = 'https';

    // HACK force http for local install
    if (uri.match(/os.nextdeploy$/)) {
      scheme = 'http';
    }

    uriWithCreds = scheme + '://' + authcreds + uritype + '-' + uri + '/';
    uriXmlHttpReq = scheme + '://' + uritype + '-' + uri + '/';

    if (isFF || isIphone || isIpad) {
      return uriWithCreds;
    } else {
      return uriXmlHttpReq;
    }
  }
});
