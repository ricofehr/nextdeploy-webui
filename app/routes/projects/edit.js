import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) projects edit route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class ProjectsEdit
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the model for edit project form
   *    - brands list
   *    - frameworks list
   *    - technos list
   *    - technotypes list
   *    - vmsizes list
   *    - users list
   *    - systems list
   *    - groups list
   *    - projects list
   *    - the project recorded object
   *
   *  @function model
   *  @param {Hash} params String => String (with project id)
   *  @returns {Hash} a RSVP hash included brands, frameworks, technos, technotypes,
   *           vmsizes, users, systems, groups, projects and the project recorded object
   */
  model(params) {
    var accessLevel = this.get('session').get('data.authenticated.access_level');

    if (accessLevel === 50) {
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
