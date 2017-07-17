import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) users new route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class UsersNew
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the model for new user form
   *    - groups list
   *    - projects list
   *    - users list
   *    - an empty user created object
   *
   *  @function model
   *  @returns {Hash} a RSVP hash included users, groups, projects and the new empty user object
   */
  model() {
    return Ember.RSVP.hash({
      groups: this.store.peekAll('group').sortBy('access_level').reverse(),
      projects: this.store.peekAll('project'),
      users: this.store.peekAll('user'),
      user: this.store.createRecord('user', { quotavm: '4', quotaprod: '0', nbpages: 11, layout: 'fr', is_credentials_send: true, is_recv_vms: false })
    });
  },
});
