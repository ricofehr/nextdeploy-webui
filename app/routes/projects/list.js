import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) projects list route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class ProjectsList
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the model for projects list
   *    - projects array list sorted by id
   *    - vms array list
   *    - users array list
   *
   *  @function model
   *  @returns {Hash} a RSVP hash included projects, vms and users
   */
  model() {
    return Ember.RSVP.hash({
      projects: this.store.peekAll('project').toArray().sort(function(a, b) {
        return Ember.compare(parseInt(b.id), parseInt(a.id));
      }),
      vms: this.store.peekAll('vm'),
      users: this.store.peekAll('user')
    });
  },

  /**
   *  Setup the controller with the model
   *
   *  @method setupController
   *  @param {Controller}
   *  @param {model} the model
   */
  setupController: function(controller, model) {
    this.controllerFor('projects.list').setProperties({model: model,
                                                       userId: 0,
                                                       brandId: 0});
  }
});
