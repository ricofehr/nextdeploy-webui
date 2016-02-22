import Ember from 'ember';

export default Ember.Route.extend({
  // default application page is dashboard
  redirect: function() {
   this.transitionTo('dashboard');
  }
});