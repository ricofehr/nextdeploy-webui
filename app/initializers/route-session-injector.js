/**
 *  Injects the session object in all Ember routes
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class RouteSessionInjector
 *  @namespace initializer
 *  @module nextdeploy
 */
export function initialize(application) {
  application.inject('route', 'session', 'service:session');
}

export default {
  name: 'route-session-injector',
  initialize: initialize
};
