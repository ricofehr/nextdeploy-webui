/**
 *  Injects a router object in all Ember components
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class ComponentRouterInjector
 *  @namespace initializer
 *  @module nextdeploy
 */
export function initialize(application) {
  application.inject('component', 'router', 'router:main');
}

export default {
  name: 'component-router-injector',
  initialize: initialize
};
