/**
 *  Environment Settings part
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Environment
 *  @namespace config
 *  @module nextdeploy
 */
module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'nextdeploy',
    environment: environment,
    rootURL: '/',
    APIHost: '',
    locationType: 'hash',
    contentSecurityPolicy: {
      'connect-src': "*"
    },
    EmberENV: {
      FEATURES: {}
    },

    APP: {
      APIHost: ''
    }
  };

  if (environment === 'development') {
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.NBITEMSBYPAGE = 5;
  }

  if (environment === 'production') {
    ENV.APP.NBITEMSBYPAGE = 11;
  }

  // x-toggle parameters
  ENV['ember-toggle'] = {
    includedThemes: ['light', 'default', 'ios'],
    defaultTheme: 'ios',
    defaultSize: 'medium'
  };

  return ENV;
};
