import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level === 50) {
      return Ember.RSVP.hash({
        brands: this.store.peekAll('brand'),
        frameworks: this.store.peekAll('framework'),
        technos: this.store.peekAll('techno'),
        technotypes: this.store.peekAll('technotype'),
        vmsizes: this.store.peekAll('vmsize'),
        users: this.store.peekAll('user'),
        systems: this.store.peekAll('systemimage'),
        project: this.store.findRecord('project', params.project_id, { reload: true }),
        projects: this.store.peekAll('project').filterBy('name')
      });
    } else {

      return Ember.RSVP.hash({
        brands: this.store.peekAll('brand'),
        frameworks: this.store.peekAll('framework'),
        technos: this.store.peekAll('techno'),
        technotypes: this.store.peekAll('technotype'),
        vmsizes: this.store.peekAll('vmsize'),
        users: this.store.peekAll('user'),
        systems: this.store.peekAll('systemimage'),
        project: this.store.findRecord('project', params.project_id, { reload: true }),
        projects: []
      });
    }
  }
});