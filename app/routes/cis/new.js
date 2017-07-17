import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) ci vms new route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class CisNew
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the model for new ci vm form
   *    - projects list sorted by name
   *    - create a vm empty object with some default attributes value
   *
   *  @function model
   *  @returns {Hash} a RSVP hash included projects, and vm empty object
   */
  model() {
    var sortProjects = function(projects) {
      return projects.sortBy('name');
    };

    return Ember.RSVP.hash({
      projects: this.store.findAll('project').then(sortProjects),
      vm: this.store.createRecord('vm',
                                  {
                                    project: null, user: null, group: null,
                                    vmsize: null, systemimage: null, commit: null,
                                    is_auth: true, is_prod: false, is_cached: false,
                                    is_backup: false, is_ci: false, is_cors: true,
                                    is_ro: false, is_offline: false, technos: [],
                                    is_jenkins: true
                                  }
                                )
    });
  },

  /**
   *  Define the template
   *
   *  @method renderTemplate
   */
  renderTemplate:function () {
    this.render('cis/new');
  },
});
