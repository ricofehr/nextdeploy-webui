/**
 *  Injects the store object in all Ember components
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class ComponentStoreInjector
 *  @namespace initializer
 *  @module nextdeploy
 */
export function initialize(application) {
  application.inject('component', 'store', 'service:store');
}

export default {
  name: 'component-store-injector',
  initialize: initialize
};
