import Ember from 'ember';

export default Ember.Route.extend({
  // refresh variables during loadmodel
  refreshVms: false,
  refreshUsers: false,
  refreshProjects: false,
  refreshBrands: false,

  // load all models collection on application loading
  model() {
    return this.loadModel("index");
  },

  // start the refresh model loop
  afterModel() {
    var self = this;

    Ember.run.later(function(){
       self.reloadModel();
    }, 12000);
  },

  // load synchronisely all models
  loadModel: function(currentRoute) {
    var nbprojects = this.store.peekAll('project').toArray().length;
    var nbbrands = this.store.peekAll('brand').toArray().length;
    var nbvms = this.store.peekAll('vm').toArray().length;
    var nbusers = this.store.peekAll('user').toArray().length;

    var fail = function(){};
    var self = this;

    var passVms = function(vms){
      if (currentRoute === "vms.list") {
        if (vms.toArray().length !== nbvms) {
          self.set('refreshVms', true);
        }

        if (self.get('refreshVms') && !self.controllerFor("vms.list").get('isBusy')) {
          self.get('router.router').refresh();
          self.set('refreshVms', false);
        }
      }

      return;
    };

    var loadVms = function(projects) {
      if (currentRoute === "projects.list") {
        if (projects.toArray().length !== nbprojects) {
          self.set('refreshProjects', true);
        }

        if (self.get('refreshProjects') && !self.controllerFor("projects.list").get('isBusy')) {
          self.get('router.router').refresh();
          self.set('refreshProjects', false);
        }
      }

      return self.store.findAll('vm', { backgroundReload: false, reload: true }).then(passVms, fail);
    };

    var loadProjects = function(users) {
      if (currentRoute === "users.list") {
        if (users.toArray().length !== nbusers) {
          self.set('refreshUsers', true);
        }

        if (self.get('refreshUsers') && !self.controllerFor("users.list").get('isBusy')) {
          self.get('router.router').refresh();
          self.set('refreshUsers', false);
        }
      }

      return self.store.findAll('project', { backgroundReload: false, reload: true }).then(loadVms, fail);
    };

    var loadUsers = function(brands) {
      if (currentRoute === "brands.list") {
        if (brands.toArray().length !== nbbrands) {
          self.set('refreshBrands', true);
        }

        if (self.get('refreshBrands') && !self.controllerFor("brands.list").get('isBusy')) {
          self.get('router.router').refresh();
          self.set('refreshBrands', false);
        }
      }

      return self.store.findAll('user', { backgroundReload: false, reload: true }).then(loadProjects, fail);
    };

    var loadBrands = function() {
      return self.store.findAll('brand', { backgroundReload: false, reload: true }).then(loadUsers, fail);
    };

    var loadSshkeys = function() {
      return self.store.findAll('sshkey', { backgroundReload: false, reload: true }).then(loadBrands, fail);
    };

    var loadGroups = function() {
      return self.store.findAll('group', { backgroundReload: false, reload: true }).then(loadSshkeys, fail);
    };

    var loadSystemimages = function() {
      return self.store.findAll('systemimage', { backgroundReload: false, reload: true }).then(loadGroups, fail);
    };

    var loadSystemtypes = function() {
      return self.store.findAll('systemimagetype', { backgroundReload: false, reload: true }).then(loadSystemimages, fail);
    };

    var loadTechnos = function() {
      return self.store.findAll('techno', { backgroundReload: false, reload: true }).then(loadSystemtypes, fail);
    };

    var loadTechnotypes = function() {
      return self.store.findAll('technotype', { backgroundReload: false, reload: true }).then(loadTechnos, fail);
    };

    var loadFrameworks = function() {
      return self.store.findAll('framework', { backgroundReload: false, reload: true }).then(loadTechnotypes, fail);
    };

    if (this.get('session').get('isAuthenticated')) {
      // begin recursive model load
      return this.store.findAll('vmsize', { backgroundReload: false, reload: true }).then(loadFrameworks, fail);
    } else {
      return;
    }
  },

  // refresh model collections
  reloadModel() {
    var self = this;
    var currentRoute = this.controllerFor("application").get("currentRouteName");

    // Load models only on list pages
    if (/.*\.list/.test(currentRoute)) {
      this.loadModel(currentRoute);
    }

    Ember.run.later(function(){
      self.reloadModel();
    }, 60000);
  },

  actions: {
    // logout action
    invalidateSession() {
      var session = this.get('session');

      if (session.get('isAuthenticated')) {
        session.invalidate();
      } else {
        this.transitionTo('login');
      }
    }
  }
});