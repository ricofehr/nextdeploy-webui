import Ember from 'ember';

/**
 *  This component manages the auth form
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class LoginForm
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Send authentification request to the server
     *  Forward to error modal if server returns an issue
     *
     *  @event authenticate
     */
    authenticate: function() {
      var sess = this.get('session');

      this.get('router').transitionTo('loading');
      return sess.authenticate('authenticator:devise',
                                this.get('email'),
                                this.get('password')).catch((reason) => {
                                  Ember.Logger.debug(reason);
                                  this.get('router').transitionTo('error');
                                 });
    }
  }
});
