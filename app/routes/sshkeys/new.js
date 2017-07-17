import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) sshkey new route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class SshkeysNew
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return a model for sshkey creation for targetted user
   *    - user which is binding with the ssh key
   *    - a new sshkey object with user included
   *
   *  @function model
   *  @param {Hash} params String => String (with user id targetted)
   *  @returns {Hash} a RSVP hash included user targetted and an empty new sshkey object
   */
  model(params) {
    return Ember.RSVP.hash({
      user: this.store.peekRecord('user', params.user_id),
      sshkey: this.store.createRecord('sshkey',
                                      {
                                        name:'',
                                        key: '',
                                        user: this.store.peekRecord('user', params.user_id)
                                      })
    });
  },
});
