// Injects the session object in all Ember components
export function initialize(application) {
  application.inject('component', 'session', 'service:session');
}

export default {
  name: 'component-session-injector',
  initialize: initialize
};