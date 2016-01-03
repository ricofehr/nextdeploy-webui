var AuthenticatedRoute = require('../authenticated_route');

// Sshkey Ember Route Class (inherit from auth route because restricted)
var SshkeysEditRoute = AuthenticatedRoute.extend({
  // Return all users for the sshkey form and the sshkey object following the parameter
  model: function(params) {
    return this.store.find('sshkey', params.sshkey_id);
  },
});

module.exports = SshkeysEditRoute;

