import Ember from 'ember';

export default Ember.Component.extend({
  // return current user properties
  currentUser: function() {
    return this.get('session').get('data.authenticated.user');
  }.property('session.data.authenticated.user.id'),

});