import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from '../../config/environment';

/**
 *  Define the (authenticated) project new route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class ProjectsList
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the model for new project form
   *    - brands list
   *    - frameworks list
   *    - technos list
   *    - technotypes list
   *    - vmsizes list
   *    - users list
   *    - systems list
   *    - groups list
   *    - projects list
   *    - a default project model with filled values
   *
   *  @function model
   *  @returns {Hash} a RSVP hash included brands, frameworks, technos, technotypes,
   *           vmsizes, users, systems, groups, projects and a default new project object
   */
  model() {
    var accessLevel = this.get('session').get('data.authenticated.access_level');
    var self = this;
    var content = this.store.createRecord('project');
    var technoids = [];
    var vmsizeids = [];
    var systemimageids = [];

    // load a json for have a pre-completed form
    Ember.$.ajax({
      url: config.APP.APIHost + "/api/v1/projects/0",
      dataType: "json",
      async: false,
      global: false,
      headers: { 'Authorization': 'Token token=' + self.get('session').get('data.authenticated.token') }
    })
    // prepare an project object with the json response
    .done(function(data) {
      var project = data.project;
      var ep = null;
      var cleanEndpoints = self.store.peekAll('endpoint').filterBy('id', null);

      cleanEndpoints.forEach(function (clean) {
        if (clean) { clean.deleteRecord(); }
      });

      content.set('id', null);
      content.set('name', project.name);
      content.set('gitpath', project.gitpath);
      content.set('enabled', project.enabled);
      content.set('login', project.login);
      content.set('password', project.password);
      content.set('created_at', project.created_at);
      content.set('is_ht', false);
      content.set('owner', self.store.peekRecord('user', self.get('session').get('data.authenticated.user.id')));

      self.store.findRecord('brand', project.brand).then(function (brand) {
        content.set('brand', brand);
      });

      content.set('endpoints', []);
      self.store.peekAll('framework').forEach(function (framework) {
        // HACK select default framework by his name (dynamic data from api)
        if (framework.get('name') === "Symfony2") {
          ep = self.store.createRecord(
                            'endpoint',
                            {
                              prefix: '', path: 'server', envvars: '', aliases: '',
                              port: 8080, ipfilter: '', is_install: true,
                              is_sh: false, is_import: true, is_ssl: false, framework: framework
                            }
              );

          content.get('endpoints').addObject(ep);
        }

        // HACK select default framework by his name (dynamic data from api)
        if (framework.get('name') === "Static") {
          ep = self.store.createRecord(
                            'endpoint',
                            {
                              prefix: 'html', path: 'html', envvars: '', aliases: '',
                              port: 8080, ipfilter: '', is_install: true,
                              is_sh: false, is_import: false, is_ssl: false, framework: framework
                            }
               );

          content.get('endpoints').addObject(ep);
        }
      });

      content.set('branches', []);
      content.set('users', [self.store.peekRecord('user', self.get('session').get('data.authenticated.user.id'))]);

      content.set('vmsizes', []);
      vmsizeids = project.vmsizes;
      vmsizeids.forEach(function (vmsizeid) {
        self.store.findRecord('vmsize', vmsizeid).then(function (vmsize) {
          content.get('vmsizes').pushObject(vmsize);
        });
      });

      content.set('systemimages', []);
      systemimageids = project.systemimages;
      systemimageids.forEach(function (systemimageid) {
        self.store.findRecord('systemimage', systemimageid).then(function (systemimage) {
          content.get('systemimages').pushObject(systemimage);
        });
      });

      content.set('technos', []);
      technoids = project.technos;
      technoids.forEach(function (technoid) {
        self.store.findRecord('techno', technoid).then(function (techno) {
          content.get('technos').pushObject(techno);
        });
      });
    });

    // Admin (accessLevel == 50) or project-lead can create a new project
    if (accessLevel === 50) {
      return Ember.RSVP.hash({
        brands: this.store.peekAll('brand'),
        frameworks: this.store.peekAll('framework'),
        technos: this.store.peekAll('techno'),
        technotypes: this.store.peekAll('technotype'),
        vmsizes: this.store.peekAll('vmsize'),
        users: this.store.peekAll('user'),
        systems: this.store.peekAll('systemimage'),
        groups: this.store.peekAll('group'),
        projects: this.store.peekAll('project'),
        project: content
      });
    } else {
      return Ember.RSVP.hash({
        brands: this.store.peekAll('brand'),
        frameworks: this.store.peekAll('framework'),
        technos: this.store.peekAll('techno'),
        technotypes: this.store.peekAll('technotype'),
        vmsizes: this.store.peekAll('vmsize'),
        systems: this.store.peekAll('systemimage'),
        users: this.store.peekAll('user'),
        groups: this.store.peekAll('group'),
        projects: [],
        project: content
      });
    }
  },
});
