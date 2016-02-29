/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'nextdeploy',
    environment: environment,
    baseURL: '/',
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
    /*
    ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
    */
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;

    ENV.APP.APIHost = "https://api.nextdeploy.local";
    ENV.APP.NBITEMSBYPAGE = 3;
  }

  if (environment === 'staging') {
    ENV.APP.APIHost = "";
    ENV.APP.NBITEMSBYPAGE = 6;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
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
    defaultSize: 'small'
  };

  return ENV;
};