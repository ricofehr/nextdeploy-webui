import Ember from 'ember';
import config from '../config/environment';

/**
 *  This component manages requests from uris & tools modal
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class UriRequests
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Must confirm an action
     *
     *  @event confirm
     */
    confirm: function(request) {
        this.set('mustConfirm' + request, true);
    },

    /**
     *  Launch request to api
     *
     *  @event requestTool
     */
    requestTool: function(request, command) {
      var self = this;
      var currentId = this.get('uri').get('id');

      this.set('requestRunning', true);
      this.set('loadingModal', true);
      this.set('message', null);
      this.showSubModal(true);

      Ember.$.ajax({
          url: config.APP.APIHost + "/api/v1/uris/" + currentId + "/" + request,
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
            self.set('message', 'Request is finished on remote VM (silently return).');
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
   *  @property SCRIPTS
   *  @type {String[]}
   */
  SCRIPTS: [],

  /**
   *  Flag to show the site-install confirm question
   *
   *  @property mustConfirmSiteInstall
   *  @type {Boolean}
   */
  mustConfirmSiteInstall: false,

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
   *  Check if we have mysql into technos vm
   *
   *  @function isMysql
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
   *  @function isNpm
   *  @returns {Boolean}
   */
  isNpm: function() {
    var technos = this.get('vm.technos');
    var isNode = false;

    technos.forEach(function (techno) {
      // HACK technotype name test (a dynamic value from api)
      if (techno.get('technotype').get('name').match(/Node/)) {
        isNode = true;
      }
    });

    return isNode;
  }.property('vm'),

  /**
   *  Check if we have nodejs framework
   *
   *  @function isNodejs
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
   *  @function isReactjs
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
   *  @function isWeb
   *  @returns {Boolean}
   */
  isWeb: function() {
    var technos = this.get('vm.technos');
    var isWeb = false;

    technos.forEach(function (techno) {
      // HACK techno name test (a dynamic value from api)
      if (techno.get('technotype').get('name').match(/^Web/)) {
        isWeb = true;
      }
    });

    return isWeb;
  }.property('vm'),

  /**
   *  Check if we have sf2 framework
   *
   *  @function isSf2
   *  @returns {Boolean}
   */
  isSf2: function() {
    var framework = this.get('uri.framework.name');

    // HACK framework name test (a dynamic value from api)
    if (framework.match(/^Symfony/)) {
      return true;
    }

    return false;
  }.property('uri'),

  /**
   *  Check if we have composer with cms/framework
   *
   *  @function isComposer
   *  @returns {Boolean}
   */
  isComposer: function() {
    var framework = this.get('uri.framework.name');

    // HACK framework name test (a dynamic value from api)
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
   *  @function isDrupal
   *  @returns {Boolean}
   */
  isDrupal: function() {
    var framework = this.get('uri.framework.name');

    // HACK framework name test (a dynamic value from api)
    if (framework.match(/^Drupal/)) {
      return true;
    }

    return false;
  }.property('uri'),

  /**
   *  Check if we have drupal8
   *
   *  @function isDrupal8
   *  @returns {Boolean}
   */
  isDrupal8: function() {
    var framework = this.get('uri.framework.name');

    // HACK framework name test (a dynamic value from api)
    if (framework.match(/^Drupal8/)) {
      return true;
    }

    return false;
  }.property('uri'),

  /**
   *  Get the scripts list
   *
   *  @method initScripts
   */
  initScripts: function() {
    var self = this;
    var uri = this.get('uri');
    var currentId;

    if (!uri) {
      return;
    }

    currentId = this.get('uri').get('id');

    if (!currentId) {
      return;
    }

    if (this.get('uri.is_sh')) {
      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/uris/" + currentId + "/listscript",
        method: "POST",
        global: false,
        async: false,
        headers: { 'Authorization': 'Token token=' + this.get('session').get('data.authenticated.token') }
      })
      .done(function(plain) {
        if (plain && plain.length) {
          plain.split("\n").forEach(function (scriptLine) {
            if (scriptLine.trim() !== "") {
              self.get('SCRIPTS').push(
                {
                  sfolder: scriptLine.split(",")[0],
                  sbin: scriptLine.split(",")[1],
                  command: scriptLine
                }
              );
            }
          });
        }
      });
    }
  },

  /**
   *  Trigger when receives models
   *
   *  @method didReceiveAttrs
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
   *  @method showSubModal
   *  @property {Boolean} show is true for submodal display
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
  }
});
