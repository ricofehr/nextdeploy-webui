import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  // request server for refreshed project list and sort it
  model() {
    var sortProjects = function(projects) {
      return projects.sortBy('name');
    };

    return Ember.RSVP.hash({
      projects: this.store.findAll('project').then(sortProjects),
      vm: this.store.createRecord('vm', { project: null, user: null, group: null,
                                          vmsize: null, systemimage: null, commit: null,
                                          is_auth: true, is_prod: false, is_cached: false,
                                          is_backup: false, is_ci: false, is_cors: true,
                                          is_ro: false, technos: [], is_jenkins: true })
    });
  },

  // Same template than the standard list
  renderTemplate:function () {
    this.render('cis/new');
  },
});
