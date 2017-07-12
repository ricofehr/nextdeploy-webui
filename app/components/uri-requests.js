import Ember from 'ember';
import config from '../config/environment';

/**
 *  This component manages requests from uris & tools modal
 *
 *  @module components/uri-requests
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Must confirm an action
     *
     *  @function
     */
    confirm: function(request) {
        this.set('mustConfirm' + request, true);
    },

    /**
     *  Launch request to api
     *
     *  @function
     */
    requestTool: function(request, command) {
      var self = this;
      var current_id = this.get('uri').get('id');

      this.set('requestRunning', true);
      this.set('loadingModal', true);
      this.set('message', null);
      this.showSubModal(true);

      Ember.$.ajax({
          url: config.APP.APIHost + "/api/v1/uris/" + current_id + "/" + request,
          method: "POST",
          global: false,
          data: { command: command },
          headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
        })
        .done(function(plain) {
          self.set('requestRunning', false);
          if (plain && plain.length) {
            self.set('message', plain);
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
  },

  /**
   *  Array of scripts name
   *
   *  @type {String[]}
   */
  SCRIPTS: [],

  /**
   *  Flag to show the site-install confirm question
   *
   *  @type {Boolean}
   */
  mustConfirmSiteInstall: false,

  /**
   *  Trigger when receives models
   *
   *  @function
   */
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('SCRIPTS', []);
    this.initScripts();
    this.set('mustConfirmSiteInstall', false);
  },

  /**
   *  Switch between modals display
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
      this.set('isShowingUris', true);

      Ember.run.later(function() {
        self.set('fadeUris', true);
      }, 500);
    }
  },

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
   *  Check if we have mysql into technos vm
   *
   *  @function
   *  @returns {Boolean}
   */
  isMysql: function() {
    var technos = this.get('vm.technos');

    // HACK techno name test (a dynamic value from api)
    if (technos.findBy('name', 'mysql')) {
      return true;
    }

    return false;
  }.property('vm'),

  /**
   *  Check if we have nodejs into technos vm
   *
   *  @function
   *  @returns {Boolean}
   */
  isNpm: function() {
    var technos = this.get('vm.technos');
    var isNode = false;

    technos.forEach(function (techno) {
      // HACK techno name test (a dynamic value from api)
      if (techno.get('technotype').get('name').match(/Node/)) {
        isNode = true;
      }
    });

    return isNode;
  }.property('vm'),

  /**
   *  Check if we have nodejs framework
   *
   *  @function
   *  @returns {Boolean}
   */
  isNodejs: function() {
    var framework = this.get('uri.framework.name');

    // HACK framework name test (a dynamic value from api)
    if (framework.match(/^NodeJS/)) {
      return true;
    }

    return false;
  }.property('uri'),

  /**
   *  Check if we have react framework
   *
   *  @function
   *  @returns {Boolean}
   */
  isReactjs: function() {
    var framework = this.get('uri.framework.name');

    // HACK framework name test (a dynamic value from api)
    if (framework.match(/^ReactJS/)) {
      return true;
    }

    return false;
  }.property('uri'),

  /**
   *  Check if we have a web server into model
   *
   *  @function
   *  @returns {Boolean}
   */
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

  /**
   *  Check if we have sf2 framework
   *
   *  @function
   *  @returns {Boolean}
   */
  isSf2: function() {
    var framework = this.get('uri.framework.name');
    if (framework.match(/^Symfony/)) {
      return true;
    }

    return false;
  }.property('uri'),

  /**
   *  Check if we have composer with cms/framework
   *
   *  @function
   *  @returns {Boolean}
   */
  isComposer: function() {
    var framework = this.get('uri.framework.name');
    if (framework.match(/^Symfony/) ||
        framework.match(/^Drupal/) ||
        framework.match(/^Static/) ||
        framework.match(/^Wordpress/)) {
      return true;
    }

    return false;
  }.property('uri'),

  /**
   *  Check if we have drupal
   *
   *  @function
   *  @returns {Boolean}
   */
  isDrupal: function() {
    var framework = this.get('uri.framework.name');
    if (framework.match(/^Drupal/)) {
      return true;
    }

    return false;
  }.property('uri'),

  /**
   *  Check if we have drupal8
   *
   *  @function
   *  @returns {Boolean}
   */
  isDrupal8: function() {
    var framework = this.get('uri.framework.name');
    if (framework.match(/^Drupal8/)) {
      return true;
    }

    return false;
  }.property('uri'),

  /**
   *  Get the scripts list
   *
   *  @function
   */
  initScripts: function() {
    var self = this;
    var uri = this.get('uri');
    var current_id;

    if (!uri) {
      return;
    }

    current_id = this.get('uri').get('id');

    if (!current_id) {
      return;
    }

    if (this.get('uri.is_sh')) {
      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/uris/" + current_id + "/listscript",
        method: "POST",
        global: false,
        async: false,
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
      })
      .done(function(plain) {
        if (plain && plain.length) {
          plain.split("\n").forEach(function (scriptLine) {
            if (scriptLine.trim() !== "") {
              self.get('SCRIPTS').push({sfolder: scriptLine.split(",")[0], sbin: scriptLine.split(",")[1], command: scriptLine});
            }
          });
        }
      });
    }
  }
});
