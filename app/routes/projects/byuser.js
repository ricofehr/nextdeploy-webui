import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) projects list route filter by user
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class ProjectsByUser
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the model for projects list
   *    - projects array list sorted by id
   *    - user id
   *
   *  @function model
   *  @param {Hash} params String => String (with brand id)
   *  @returns {Hash} a RSVP hash included projects and user id
   */
  model(params) {
    return Ember.RSVP.hash({
      projects: this.store.peekAll('project').toArray().sort(function(a, b) {
        return Ember.compare(parseInt(b.id), parseInt(a.id));
      }),
      userId: params.user_id
    });
  },

  /**
   *  Define the template
   *
   *  @method renderTemplate
   */
  renderTemplate:function () {
    this.render('projects/list');
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
                                                       userId: model.userId,
                                                       brandId: 0,
                                                       currentPage: 0});
  }
});
