// define session actions after authenticate and after logout
export function initialize(container) {
  var applicationRoute = container.lookup('route:application');
  var session          = container.lookup('service:session');
  var store          = container.lookup('service:store');

  session.on('authenticationSucceeded', function() {
    store.findAll('brand', { backgroundReload: false, reload: true });
    store.findAll('vmsize', { backgroundReload: false, reload: true });
    store.findAll('framework', { backgroundReload: false, reload: true });
    store.findAll('techno', { backgroundReload: false, reload: true });
    store.findAll('technotype', { backgroundReload: false, reload: true });
    store.findAll('systemimagetype', { backgroundReload: false, reload: true });
    store.findAll('systemimage', { backgroundReload: false, reload: true });
    store.findAll('group', { backgroundReload: false, reload: true });
    store.findAll('user', { backgroundReload: false, reload: true });
    store.findAll('sshkey', { backgroundReload: false, reload: true });
    store.findAll('project', { backgroundReload: false, reload: true });
    store.findAll('vm', { backgroundReload: false, reload: true });

    applicationRoute.transitionTo('index');
  });

  session.on('invalidationSucceeded', function() {
    window.location.replace('/');
  });
}

export default {
  name: 'session-events',
  after:      'ember-simple-auth',
  initialize: initialize
};