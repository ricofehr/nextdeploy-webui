import DeviseAuthorizer from 'ember-simple-auth/authorizers/devise';

/**
 *  Define username attribute for devise auth module
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Devise
 *  @namespace authorizer
 *  @module nextdeploy
 *  @augments DeviseAuthorizer
 */
export default DeviseAuthorizer.extend({
  /**
   *  Define the username attribute
   *
   *  @property identificationAttributeName
   *  @type {String}
   */
  identificationAttributeName: 'email'
});
