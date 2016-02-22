import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    // send authentification request to the server
    authenticate: function() {
      this.get('router').transitionTo('loading');
      return this.get('session').authenticate('authenticator:devise', this.get('email'), this.get('password')).catch((reason) => {
        Ember.Logger.debug(reason);
        this.get('router').transitionTo('error');
      });
    }
  }
});