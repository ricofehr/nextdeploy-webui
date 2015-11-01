var AuthenticatedRoute = require('../authenticated_route');

// Modal vm route
var VmsModalRoute = Ember.Route.extend({
  // Empty model
  model: function() {
    return Ember.Object.create();
  }
});

module.exports = VmsModalRoute;

