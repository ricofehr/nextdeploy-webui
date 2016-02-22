import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model(params) {

    return Ember.RSVP.hash({
      users: this.store.peekAll('user').sortBy('email'),
      projectId: params.project_id
    });
  },

  // Same template than the standard list of vms
  renderTemplate:function () {
    this.render('users/list');
  },

  // Setup the controller for users.list with this model
  setupController: function(controller, model) {
    this.controllerFor('users.list').setProperties({model: model,
                                                  groupId: 0,
                                                  projectId: model.projectId,
                                                  currentPage: 0});
  }
});