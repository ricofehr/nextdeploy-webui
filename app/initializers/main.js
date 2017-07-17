import Ember from 'ember';

/**
 *  Injects the main object in all Ember components
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Main
 *  @namespace initializer
 *  @module nextdeploy
 */
export function initialize() {
  if (Ember.Debug && typeof Ember.Debug.registerDeprecationHandler === 'function') {
      Ember.Debug.registerDeprecationHandler((message, options, next) => {
          if (options && options.until) {
              return;
          }
          next(message, options);
      });
  }
}

export default {
  name: 'main',
  initialize: initialize
};
