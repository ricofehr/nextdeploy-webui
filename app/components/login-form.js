import Ember from 'ember';

/**
 *  This component manages the auth form
 *
 *  @module components/login-form
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Send authentification request to the server
     *  Forward to error modal if server returns an issue
     *
     *  @function
     */
    authenticate: function() {
      this.get('router').transitionTo('loading');
      return this.get('session').authenticate(
              'authenticator:devise', this.get('email'), this.get('password')
             ).catch((reason) => {
               Ember.Logger.debug(reason);
               this.get('router').transitionTo('error');
             });
    }
  }
});
