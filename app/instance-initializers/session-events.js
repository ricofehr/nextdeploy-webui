// define session actions after authenticate and after logout
export function initialize(container) {
  var applicationRoute = container.lookup('route:application');
  var session          = container.lookup('service:session');
  var store          = container.lookup('service:store');
  var fail  = function() {
    applicationRoute.transitionTo('error');
  };

  session.on('authenticationSucceeded', function() {
    store.findAll('brand', { backgroundReload: false, reload: true }).then({}, fail);
    store.findAll('vmsize', { backgroundReload: false, reload: true }).then({}, fail);
    store.findAll('framework', { backgroundReload: false, reload: true }).then({}, fail);
    store.findAll('techno', { backgroundReload: false, reload: true }).then({}, fail);
    store.findAll('technotype', { backgroundReload: false, reload: true }).then({}, fail);
    store.findAll('systemimagetype', { backgroundReload: false, reload: true }).then({}, fail);
    store.findAll('systemimage', { backgroundReload: false, reload: true }).then({}, fail);
    store.findAll('group', { backgroundReload: false, reload: true }).then({}, fail);
    store.findAll('user', { backgroundReload: false, reload: true }).then({}, fail);
    store.findAll('sshkey', { backgroundReload: false, reload: true }).then({}, fail);
    store.findAll('project', { backgroundReload: false, reload: true }).then({}, fail);
    store.findAll('endpoint', { backgroundReload: false, reload: true }).then({}, fail);
    store.findAll('vm', { backgroundReload: false, reload: true }).then({}, fail);
    store.findAll('uri', { backgroundReload: false, reload: true }).then({}, fail);

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