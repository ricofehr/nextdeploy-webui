import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model(params) {

    return Ember.RSVP.hash({
      vms: this.store.peekAll('vm').toArray().filterBy('is_jenkins', false).sort(function(a, b) {
        return Ember.compare(parseInt(b.id), parseInt(a.id));
      }),
      userId: params.user_id
    });
  },

  // Same template than the standard list of vms
  renderTemplate:function () {
    this.render('vms/list');
  },

  // Setup the controller for vms.list with this model
  setupController: function(controller, model) {
    this.controllerFor('vms.list').setProperties({model: model,
                                                  ciVms: false,
                                                  userId: model.userId,
                                                  projectId: 0,
                                                  currentPage: 0});
  }
});
