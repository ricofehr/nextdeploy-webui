import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
// Return true if user is a Dev or more
  isDev: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level >= 30) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  // Check if we have mysql into model
  isMysql: function() {
    var technos = this.get('vm.technos');
    if (technos.findBy('name', 'mysql')) {
      return true;
    }

    return false;
  }.property('vm'),

  // Check if we have nodejs into model
  isNpm: function() {
    var technos = this.get('vm.technos');
    var isNode = false;

    technos.forEach(function (techno) {
      if (techno.get('technotype').get('name').match(/Node/)) {
        isNode = true;
      }
    });

    return isNode;
  }.property('vm'),

  // Check if we have nodejs framework
  isNodejs: function() {
    var framework = this.get('uri.framework.name');
    if (framework.match(/^NodeJS/)) {
      return true;
    }

    return false;
  }.property('uri'),

  // Check if we have react framework
  isReactjs: function() {
    var framework = this.get('uri.framework.name');
    if (framework.match(/^ReactJS/)) {
      return true;
    }

    return false;
  }.property('uri'),

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

  // Check if we have sf2 framework
  isSf2: function() {
    var framework = this.get('uri.framework.name');
    if (framework.match(/^Symfony/)) {
      return true;
    }

    return false;
  }.property('uri'),

  // Check if we have composer with cms/framework
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

  // Check if we have drupal
  isDrupal: function() {
    var framework = this.get('uri.framework.name');
    if (framework.match(/^Drupal/)) {
      return true;
    }

    return false;
  }.property('uri'),

  // Check if we have drupal
  isDrupal8: function() {
    var framework = this.get('uri.framework.name');
    if (framework.match(/^Drupal8/)) {
      return true;
    }

    return false;
  }.property('uri'),

  actions: {
    requestTool: function(request, command) {
      var self = this;
      var current_id = this.get('uri').get('id');

      this.set('requestRunning', true);
      this.set('loadingModal', true);

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
  }
});
