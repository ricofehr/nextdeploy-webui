// define session actions after authenticate and after logout
export function initialize(container) {
  var applicationRoute = container.lookup('route:application');
  var session          = container.lookup('service:session');
  var store          = container.lookup('service:store');
  var fail  = function() {
    applicationRoute.transitionTo('error');
  };

  // load sequentially datas from api
  var success = function() {
    applicationRoute.transitionTo('index');
  };

  var successSupervise = function() {
    store.findAll('hpmessage', { backgroundReload: false, reload: true }).then(success, fail);
  };

  var successUri = function() {
    store.findAll('supervise', { backgroundReload: false, reload: true }).then(successSupervise, fail);
  };

  var successVm = function() {
    store.findAll('uri', { backgroundReload: false, reload: true }).then(successUri, fail);
  };

  var successEndpoint = function() {
    store.findAll('vm', { backgroundReload: false, reload: true }).then(successVm, fail);
  };

  var successProject = function() {
    store.findAll('endpoint', { backgroundReload: false, reload: true }).then(successEndpoint, fail);
  };

  var successSshkey = function() {
    store.findAll('project', { backgroundReload: false, reload: true }).then(successProject, fail);
  };

  var successUser = function() {
    store.findAll('sshkey', { backgroundReload: false, reload: true }).then(successSshkey, fail);
  };

  var successGroup = function() {
    store.findAll('user', { backgroundReload: false, reload: true }).then(successUser, fail);
  };

  var successSystemimage = function() {
    store.findAll('group', { backgroundReload: false, reload: true }).then(successGroup, fail);
  };

  var successSystemimagetype = function() {
    store.findAll('systemimage', { backgroundReload: false, reload: true }).then(successSystemimage, fail);
  };

  var successTechno = function() {
    store.findAll('systemimagetype', { backgroundReload: false, reload: true }).then(successSystemimagetype, fail);
  };

  var successTechnotype = function() {
    store.findAll('techno', { backgroundReload: false, reload: true }).then(successTechno, fail);
  };

  var successFramework = function() {
    store.findAll('technotype', { backgroundReload: false, reload: true }).then(successTechnotype, fail);
  };

  var successVmsize = function() {
    store.findAll('framework', { backgroundReload: false, reload: true }).then(successFramework, fail);
  };

  var successBrand = function() {
    store.findAll('vmsize', { backgroundReload: false, reload: true }).then(successVmsize, fail);
  };

  session.on('authenticationSucceeded', function() {
      store.findAll('brand', { backgroundReload: false, reload: true }).then(successBrand, fail);
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
