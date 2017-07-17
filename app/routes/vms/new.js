import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) vms new route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class VmsNew
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the model for new vm form
   *    - projects list sorted by name
   *    - an empty vm created object
   *
   *  @function model
   *  @returns {Hash} a RSVP hash included projects and the new empty vm object
   */
  model() {
    var sortProjects = function(projects) {
      return projects.sortBy('name');
    };

    return Ember.RSVP.hash({
      projects: this.store.findAll('project').then(sortProjects),
      vm: this.store.createRecord('vm', { project: null, user: null, group: null,
                                          vmsize: null, systemimage: null, commit: null,
                                          is_auth: true, is_prod: false, is_cached: false,
                                          is_backup: false, is_ci: false, is_cors: true,
                                          is_ro: false, is_offline: false, technos: [], is_jenkins: false })
    });
  },
});
