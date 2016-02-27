import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from '../../config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var technoids = [];
    var vmsizeids = [];
    var systemimageids = [];
    var self = this;

    if (access_level === 50) {
      return Ember.RSVP.hash({
        brands: this.store.peekAll('brand'),
        frameworks: this.store.peekAll('framework'),
        technos: this.store.peekAll('techno'),
        technotypes: this.store.peekAll('technotype'),
        vmsizes: this.store.peekAll('vmsize'),
        users: this.store.peekAll('user'),
        systems: this.store.peekAll('systemimage'),
        project: this.store.peekRecord('project', params.project_id),
        projects: this.store.peekAll('project').filterBy('name')
      });
    } else {

      Ember.$.ajax({
        url: config.APP.APIHost + "/api/v1/projects/0",
        dataType: "json",
        async: false,
        global: false,
        headers: { 'Authorization': 'Token token=' + self.get('session').get('data.authenticated.token') }
      })
          .done(function(data) {
            var project = data.project;
            vmsizeids = project.vmsizes;
            technoids = project.technos;
            systemimageids = project.systemimages;
          });

      return Ember.RSVP.hash({
        brands: this.store.peekAll('brand'),
        frameworks: this.store.peekAll('framework'),
        technotypes: this.store.peekAll('technotype'),
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
        project: this.store.peekRecord('project', params.project_id),
        projects: []
      });
    }
  }
});