import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) users list route filter by group
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class UsersByGroup
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the model for users list
   *    - users array list sorted by email
   *    - group id
   *
   *  @function model
   *  @param {Hash} params String => String (with group id)
   *  @returns {Hash} a RSVP hash included users, and group id
   */
  model(params) {
    return Ember.RSVP.hash({
      users: this.store.peekAll('user').sortBy('email'),
      groupId: params.group_id
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
                                                  groupId: model.groupId,
                                                  projectId: 0,
                                                  currentPage: 0});
  }
});
