/**
 *  Injects the session object in all Ember components
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class ComponentSessionInjector
 *  @namespace initializer
 *  @module nextdeploy
 */
export function initialize(application) {
  application.inject('component', 'session', 'service:session');
}

export default {
  name: 'component-session-injector',
  initialize: initialize
};
