// Injects the session object in all Ember routes
export function initialize(application) {
  application.inject('route', 'session', 'service:session');
}

export default {
  name: 'route-session-injector',
  initialize: initialize
};