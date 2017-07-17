import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) users edit route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class UsersEdit
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the model for edit user form
   *    - groups list
   *    - projects list
   *    - users list
   *    - the user recorded object
   *
   *  @function model
   *  @param {Hash} params String => String (with user id)
   *  @returns {Hash} a RSVP hash included users, groups, projects and the user recorded object
   */
   model(params) {
    return Ember.RSVP.hash({
      groups: this.store.peekAll('group'),
      projects: this.store.peekAll('project'),
      user: this.store.findRecord('user', params.user_id, { reload: true }),
      users: this.store.peekAll('user')
    });
  },
});
