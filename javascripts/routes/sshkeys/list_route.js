var AuthenticatedRoute = require('../authenticated_route');

// Sshkey Ember Route Class (inherit from auth route because restricted)
var SshkeysListRoute = AuthenticatedRoute.extend({
  model: function(params) {
    return this.store.find('user', params.user_id);
  },
});

module.exports = SshkeysListRoute;

