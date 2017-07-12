import Ember from 'ember';
import config from '../config/environment';

/**
 *  This component manages uris modal for vm
 *
 *  @module components/vm-uris
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Send a request to the api for executing a tool into the vm
     *
     *  @function
     */
    requestTool: function(request) {
      var self = this;
      var current_id = this.get('vm').get('id');

      this.set('requestRunning', true);
      this.set('message', null);
      this.set('message2', null);

      this.showSubModal(true);

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
            var message2 = "Look with attention the content of this script.<br>" +
                          "And if you are agree with that, " +
                          "you can now execute this on the vm at your own risk !";
            self.set('message2', message2);
          }
        } else {
          self.showSubModal(false);
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
     *  @function
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
     *  @function
     */
    closedLoading: function() {
      this.showSubModal(false);
    },
  },

  /**
   *  Flag to show the loading modal
   *
   *  @type {Boolean}
   */
  loadingModal: false,

  /**
   *  Flag on request running state
   *
   *  @type {Boolean}
   */
  requestRunning: false,

  /**
   *  Message to display for user
   *
   *  @type {String}
   */
  message: null,

  /**
   *  Flag to display the postinstall confirm
   *
   *  @type {Boolean}
   */
  viewPostinstall: false,

  /**
   *  Flag to display the submodal (for cmd return)
   *
   *  @type {Boolean}
   */
  subModal: false,

  /**
   *  Flag to enable the fade effect on modal
   *
   *  @type {Boolean}
   */
  fadeUris: true,

  /**
   *  Inverse of isrunning
   *
   *  @function
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
   *  @function
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
   *  @function
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
   *  @function
   *  @returns {Boolean} True if admin, lead, or dev
   */
  isDev: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 30) {
      return true;
    }

    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Check if current user is admin, lead, dev, or ProjectManager
   *
   *  @function
   *  @returns {Boolean} True if admin, lead, dev, or pm
   */
  isPM: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 20) {
      return true;
    }

    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Return true if vm includes a mysql techno
   *
   *  @function
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
   *  @function
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
   *  @function
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
   *  @function
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
   *  @function
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
   *  @function
   *  @returns {Boolean} true if local install (or endpoint already exists)
   */
  isLocal: function() {
    var vm_name = this.get('vm.name');
    // HACK verify a local install from the vm name
    return vm_name.match(/os.nextdeploy$/);
  }.property('vm'),

  /**
   *  Return jenkins uri for the vm
   *
   *  @function
   *  @returns {String}
   */
  jenkinsURI: function() {
    return this.getCITOOL('jenkins');
  }.property('vm'),

  /**
   *  Return sonar uri for the vm
   *
   *  @function
   *  @returns {String}
   */
  sonarURI: function() {
    return this.getCITOOL('sonar');
  }.property('vm'),

  /**
   *  Return doc uri for the vm
   *
   *  @function
   *  @returns {String}
   */
  pmdocURI: function() {
    return this.getCITOOL('pmdoc');
  }.property('vm'),

  /**
   *  Return phpmyadmin uri for the vm
   *
   *  @function
   *  @returns {String}
   */
  pmaURI: function() {
    return this.getTOOL('phpmyadmin');
  }.property('vm'),

  /**
   *  Return logs uri for the vm
   *
   *  @function
   *  @returns {String}
   */
  tailURI: function() {
    return this.getTOOL('tail');
  }.property('vm'),

  /**
   *  Return phpinfo uri for the vm
   *
   *  @function
   *  @returns {String}
   */
  pminfoURI: function() {
    return this.getTOOL('pminfo');
  }.property('vm'),

  /**
   *  Return (sf) logs uri for the vm
   *
   *  @function
   *  @returns {String}
   */
  sflogsURI: function() {
    return this.getTOOL('tailsf2');
  }.property('vm'),

  /**
   *  Trigger when receives models
   *
   *  @function
   */
  didReceiveAttrs() {
    this._super(...arguments);
  },

  /**
   *  Switch between uris modal and cmd submodal
   *
   *  @function
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
   *  @function
   */
  getURI: function(uri, is_ssl) {
    var login = this.get('vm.htlogin');
    var password = this.get('vm.htpassword');
    var authcreds = login + ":" + password + "@";
    var is_auth = this.get('vm.is_auth');
    var uri_with_creds = '';
    var uri_xmlhttp_req = '';
    // var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    var is_ff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    var is_iphone = navigator.userAgent.toLowerCase().indexOf('iphone') > -1;
    var is_ipad = navigator.userAgent.toLowerCase().indexOf('ipad') > -1;
    var scheme = 'http';

    if (is_ssl) {
      scheme = 'https';
    }

    uri_with_creds = scheme + '://' + authcreds + uri + '/';
    uri_xmlhttp_req = scheme + '://' + uri + '/';

    if (is_auth && (is_ff || is_iphone || is_ipad)) {
      return uri_with_creds;
    } else {
      return uri_xmlhttp_req;
    }
  },

  /**
   *  Generates an absolute URI for a Tool
   *
   *  @function
   */
  getTOOL: function(uritype) {
    var login = this.get('vm.htlogin');
    var password = this.get('vm.htpassword');
    var authcreds = login + ":" + password + "@";
    var uri = this.get('vm.name');
    var uri_with_creds = '';
    var uri_xmlhttp_req = '';
    // var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    var is_ff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    var is_iphone = navigator.userAgent.toLowerCase().indexOf('iphone') > -1;
    var is_ipad = navigator.userAgent.toLowerCase().indexOf('ipad') > -1;
    var scheme = 'https';

    // HACK force http for local install
    if (uri.match(/os.nextdeploy$/)) {
      scheme = 'http';
    }

    uri_with_creds = scheme + '://' + authcreds + 'pmtools-' + uri + '/' + uritype + '/';
    uri_xmlhttp_req = scheme + '://pmtools-' + uri + '/' + uritype + '/';

    if (is_ff || is_iphone || is_ipad) {
      return uri_with_creds;
    } else {
      return uri_xmlhttp_req;
    }
  },

  /**
   *  Generates an absolute URI for a CI Tool
   *
   *  @function
   */
  getCITOOL: function(uritype) {
    var login = this.get('vm.htlogin');
    var password = this.get('vm.htpassword');
    var authcreds = login + ":" + password + "@";
    var uri = this.get('vm.name');
    var uri_with_creds = '';
    var uri_xmlhttp_req = '';
    // var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    var is_ff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    var is_iphone = navigator.userAgent.toLowerCase().indexOf('iphone') > -1;
    var is_ipad = navigator.userAgent.toLowerCase().indexOf('ipad') > -1;
    var scheme = 'https';

    // HACK force http for local install
    if (uri.match(/os.nextdeploy$/)) {
      scheme = 'http';
    }

    uri_with_creds = scheme + '://' + authcreds + uritype + '-' + uri + '/';
    uri_xmlhttp_req = scheme + '://' + uritype + '-' + uri + '/';

    if (is_ff || is_iphone || is_ipad) {
      return uri_with_creds;
    } else {
      return uri_xmlhttp_req;
    }
  }
});
