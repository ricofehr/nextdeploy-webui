import Ember from 'ember';

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