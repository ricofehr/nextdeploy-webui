var IndexRoute = Ember.Route.extend({
  redirect: function() {
   this.transitionTo('sessions.new');
  }
});

module.exports = IndexRoute;