import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    return Ember.RSVP.hash({
      projects: this.store.peekAll('project').toArray().sort(function(a, b) {
        return Ember.compare(parseInt(b.id), parseInt(a.id));
      }),
      userId: params.user_id
    });
  },

  // Same template than the standard list
  renderTemplate:function () {
    this.render('projects/list');
  },

  // Setup the controller
  setupController: function(controller, model) {
    this.controllerFor('projects.list').setProperties({model: model,
                                                       userId: model.userId,
                                                       brandId: 0,
                                                       currentPage: 0});
  }
});