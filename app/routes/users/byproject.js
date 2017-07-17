import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) users list route filter by project
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class UsersByProject
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the model for users list
   *    - users array list sorted by email
   *    - project id
   *
   *  @function model
   *  @param {Hash} params String => String (with project id)
   *  @returns {Hash} a RSVP hash included users and project id
   */
  model(params) {
    return Ember.RSVP.hash({
      users: this.store.peekAll('user').sortBy('email'),
      projectId: params.project_id
    });
  },

  /**
   *  Define the template
   *
   *  @method renderTemplate
   */
  renderTemplate:function () {
    this.render('users/list');
  },

  /**
   *  Setup the controller with the model
   *
   *  @method setupController
   *  @param {Controller}
   *  @param {model} the model
   */
  setupController: function(controller, model) {
    this.controllerFor('users.list').setProperties({model: model,
                                                  groupId: 0,
                                                  projectId: model.projectId,
                                                  currentPage: 0});
  }
});
