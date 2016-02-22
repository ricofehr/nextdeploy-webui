import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    // logout action for error page
    invalidateSession() {
      var session = this.get('session');

      if (session.get('isAuthenticated')) {
        session.invalidate();
      } else {
        this.transitionTo('login');
      }
    }
  }
});