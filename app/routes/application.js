import Ember from 'ember';

/**
 *  Define the application route, main route of the webui
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Application
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend({
  /**
   *  Flag to keep the refresh ask of vms list
   *
   *  @property refreshVms
   *  @type {Boolean}
   */
  refreshVms: false,

  /**
   *  Flag to keep the refresh ask of users list
   *
   *  @property refreshUsers
   *  @type {Boolean}
   */
  refreshUsers: false,

  /**
   *  Flag to keep the refresh ask of projects list
   *
   *  @property refreshProjects
   *  @type {Boolean}
   */
  refreshProjects: false,

  /**
   *  Flag to keep the refresh ask of brands list
   *
   *  @property refreshBrands
   *  @type {Boolean}
   */
  refreshBrands: false,

  /**
   *  Load once all the model records during application loading
   *
   *  @function model
   *  @returns nothing
   */
  model() {
    return this.loadModel("index");
  },

  /**
   *  Start the reloadModel refresh loop
   *
   *  @method afterModel
   */
  afterModel() {
    var self = this;

    Ember.run.later(function(){
       self.reloadModel();
    }, 420000);
  },

  /**
   *  Load synchronisely all models records
   *
   *  @function loadModel
   *  @param {String} currentRoute
   *  @returns nothing
   */
  loadModel: function(currentRoute) {
    var self = this;
    var idProjects =
      this.store.peekAll('project').toArray().reduce(function(previous, project) {
        return previous + parseInt(project.get("id"));
      }, 0);

    var idBrands =
      this.store.peekAll('brand').toArray().reduce(function(previous, brand) {
        return previous + parseInt(brand.get("id"));
      }, 0);

    var idHpmessages =
      this.store.peekAll('hpmessage').toArray().reduce(function(previous, hpm) {
        return previous + parseInt(hpm.get("id"));
      }, 0);

    var idUsers =
      this.store.peekAll('user').toArray().reduce(function(previous, user) {
        return previous + parseInt(user.get("id"));
      }, 0);

    var idVms =
      this.store.peekAll('vm').toArray().reduce(function(previousValue, vm){
        return previousValue + parseInt(vm.get("id"));
      }, 0);

    var fail = function(){};
    var opt = { backgroundReload: false, reload: true };

    // index is the first route when ember is launching
    if (currentRoute === "index") {
      fail = function() {
        self.transitionTo('error');
      };
    }

    var passSupervises = function() {
      return;
    };

    var loadSupervises = function() {
      return self.store.findAll('supervise', opt).then(passSupervises, fail);
    };

    var loadUris = function(vms){
      var currentRoute = self.controllerFor("application").get("currentRouteName");

      if (currentRoute === "vms.list") {
        var idVmsNow = vms.toArray().reduce(function(previousValue, vm){
            return previousValue + parseInt(vm.get("id"));
        }, 0);

        if (idVmsNow !== idVms) {
          self.set('refreshVms', true);
        }

        if (self.get('refreshVms') && !self.controllerFor("vms.list").get('isBusy')) {
          self.get('router.router').refresh();
          self.set('refreshVms', false);
        }

        self.controllerFor("vms.list").prepareList();
      }

      return self.store.findAll('uri', opt).then(loadSupervises, fail);
    };

    var loadVms = function() {
      return self.store.findAll('vm', opt).then(loadUris, fail);
    };

    var loadEndpoints = function(projects) {
      var currentRoute = self.controllerFor("application").get("currentRouteName");

      if (currentRoute === "projects.list") {
        var idProjectsNow = projects.toArray().reduce(function(previous, project){
            return previous + parseInt(project.get("id"));
        }, 0);

        if (idProjectsNow !== idProjects) {
          self.set('refreshProjects', true);
        }

        if (self.get('refreshProjects') && !self.controllerFor("projects.list").get('isBusy')) {
          self.get('router.router').refresh();
          self.set('refreshProjects', false);
        }

        self.controllerFor("projects.list").prepareList();
      }

      return self.store.findAll('endpoint', opt).then(loadVms, fail);
    };

    var loadProjects = function(users) {
      var currentRoute = self.controllerFor("application").get("currentRouteName");

      if (currentRoute === "users.list") {
        var idUsersNow = users.toArray().reduce(function(previous, user){
            return previous + parseInt(user.get("id"));
        }, 0);

        if (idUsersNow !== idUsers) {
          self.set('refreshUsers', true);
        }

        if (self.get('refreshUsers') && !self.controllerFor("users.list").get('isBusy')) {
          self.get('router.router').refresh();
          self.set('refreshUsers', false);
        }

        self.controllerFor("users.list").prepareList();
      }

      return self.store.findAll('project', opt).then(loadEndpoints, fail);
    };

    var loadUsers = function(brands) {
      var currentRoute = self.controllerFor("application").get("currentRouteName");

      if (currentRoute === "brands.list") {
        var idBrandsNow = brands.toArray().reduce(function(previous, brand){
          return previous + parseInt(brand.get("id"));
        }, 0);

        if (idBrandsNow !== idBrands) {
          self.set('refreshBrands', true);
        }

        if (self.get('refreshBrands') && !self.controllerFor("brands.list").get('isBusy')) {
          self.get('router.router').refresh();
          self.set('refreshBrands', false);
        }

        self.controllerFor("brands.list").prepareList();
      }

      return self.store.findAll('user', opt).then(loadProjects, fail);
    };

    var loadBrands = function(hpmessages) {
      var currentRoute = self.controllerFor("application").get("currentRouteName");

      if (currentRoute === "dashboard") {
        var idHpmessagesNow = hpmessages.toArray().reduce(function(previous, hpmessage){
          return previous + parseInt(hpmessage.get("id"));
        }, 0);

        if (idHpmessagesNow !== idHpmessages) {
          self.get('router.router').refresh();
        }
      }

      return self.store.findAll('brand', opt).then(loadUsers, fail);
    };

    var loadHpmessages = function() {
      return self.store.findAll('hpmessage', opt).then(loadBrands, fail);
    };

    var loadSshkeys = function() {
      return self.store.findAll('sshkey', opt).then(loadHpmessages, fail);
    };

    var loadGroups = function() {
      return self.store.findAll('group', opt).then(loadSshkeys, fail);
    };

    var loadSystemimages = function() {
      return self.store.findAll('systemimage', opt).then(loadGroups, fail);
    };

    var loadSystemtypes = function() {
      return self.store.findAll('systemimagetype', opt).then(loadSystemimages, fail);
    };

    var loadTechnos = function() {
      return self.store.findAll('techno', opt).then(loadSystemtypes, fail);
    };

    var loadTechnotypes = function() {
      return self.store.findAll('technotype', opt).then(loadTechnos, fail);
    };

    var loadFrameworks = function() {
      return self.store.findAll('framework', opt).then(loadTechnotypes, fail);
    };

    if (this.get('session').get('isAuthenticated')) {
      // begin recursive model load
      return this.store.findAll('vmsize', opt).then(loadFrameworks, fail);
    } else {
      return;
    }
  },

  /**
   *  Refresh loop
   *
   *  @function
   */
  reloadModel() {
    var self = this;
    var currentRoute = this.controllerFor("application").get("currentRouteName");

    // Load models only on list pages and dashboard
    if (/.*\.list/.test(currentRoute) ||
        /dashboard/.test(currentRoute)) {
      this.loadModel(currentRoute);
    }

    Ember.run.later(function(){
      self.reloadModel();
    }, 420000);
  },

  actions: {
    /**
     *  Logout action
     *
     *  @event invalidateSession
     */
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
