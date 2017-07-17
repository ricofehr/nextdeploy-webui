import DeviseAuthenticator from 'ember-simple-auth/authenticators/devise';
import config from '../config/environment';

/**
 *  Define sign-in request for devise auth module
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Devise
 *  @namespace authenticator
 *  @module nextdeploy
 *  @augments DeviseAuthenticator
 */
export default DeviseAuthenticator.extend({
  /**
   *  Define the api sign-in absolute URI
   *
   *  @property serverTokenEndpoint
   *  @type {String}
   */
  serverTokenEndpoint: config.APP.APIHost + '/api/v1/users/sign_in'
});
