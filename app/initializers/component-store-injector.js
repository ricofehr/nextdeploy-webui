// Injects the store object in all Ember components
export function initialize(application) {
  application.inject('component', 'store', 'service:store');
}

export default {
  name: 'component-store-injector',
  initialize: initialize
};