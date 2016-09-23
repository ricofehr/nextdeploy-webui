/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'nextdeploy',
    environment: environment,
    rootURL: '/',
    locationType: 'hash',
    contentSecurityPolicy: {
      'connect-src': "*"
    },
    EmberENV: {
      FEATURES: {}
    },

    APP: {}
  };

  if (environment === 'development') {
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;

    ENV.APP.APIHost = "";
    ENV.APP.NBITEMSBYPAGE = 3;
  }

  if (environment === 'staging') {
    ENV.APP.APIHost = "";
    ENV.APP.NBITEMSBYPAGE = 5;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.rootURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.APP.APIHost = "";
    ENV.APP.NBITEMSBYPAGE = 10;
  }

  // x-toggle parameters
  ENV['ember-cli-toggle'] = {
    includedThemes: ['light', 'default', 'ios'],
    defaultTheme: 'ios',
    defaultSize: 'medium'
  };

  return ENV;
};
