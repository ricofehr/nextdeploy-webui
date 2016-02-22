import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from '../../config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

model() {
    var access_level = this.get('session').get('data.authenticated.access_level');
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
          content.set('id', null);
          content.set('name', project.name);
          content.set('gitpath', project.gitpath);
          content.set('enabled', project.enabled);
          content.set('login', project.login);
          content.set('password', project.password);
          content.set('created_at', project.created_at);
          content.set('owner', self.store.peekRecord('user', self.get('session').get('data.authenticated.user.id')));

          self.store.findRecord('brand', project.brand).then(function (brand) {
            content.set('brand', brand);
          });

          self.store.findRecord('framework', project.framework).then(function (framework) {
            content.set('framework', framework);
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

    // Admin (access_level == 50) or project-lead can create a new project
    if (access_level === 50) {
      return Ember.RSVP.hash({
        brands: this.store.peekAll('brand'),
        frameworks: this.store.peekAll('framework'),
        technos: this.store.peekAll('techno'),
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
        technos: this.store.peekAll('techno').filter(function(item) {
          if (technoids.contains(parseInt(item.get("id")))) { return true; }
        }),
        vmsizes: this.store.peekAll('vmsize').filter(function(item) {
         if (vmsizeids.contains(parseInt(item.get("id")))) { return true; }
        }),
        systems: this.store.peekAll('systemimage').filter(function(item) {
         if (systemimageids.contains(parseInt(item.get("id")))) { return true; }
        }),
        users: this.store.peekAll('user'),
        groups: this.store.peekAll('group'),
        projects: [],
        project: content
      });
    }
  },
});