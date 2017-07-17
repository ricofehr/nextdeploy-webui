import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) users list route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class UsersList
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the model for users list
   *    - groups list
   *    - users list sorted by email
   *    - sshkeys list
   *    - vms list
   *
   *  @function model
   *  @returns {Hash} a RSVP hash included groups, users, sshkeys and vms
   */
  model() {
    return Ember.RSVP.hash({
      groups: this.store.peekAll('group'),
      users: this.store.peekAll('user').sortBy('email'),
      sshkeys: this.store.peekAll('sshkey'),
      vms: this.store.peekAll('vm')
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
    this.controllerFor('users.list').setProperties({model: model,
                                                    groupId: 0,
                                                    projectId: 0});
  }
});
