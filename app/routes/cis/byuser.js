import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model(params) {

    return Ember.RSVP.hash({
      vms: this.store.peekAll('vm').toArray().filterBy('is_jenkins', true).sort(function(a, b) {
        var status_a = parseInt(a.get('status'));
        var status_b = parseInt(b.get('status'));

        if (status_a !== 1) {
          status_a = status_a > 1 ? 0 : (-status_a);
        }

        if (status_b !== 1) {
          status_b = status_b > 1 ? 0 : (-status_b);
        }

        var comp_status = Ember.compare(status_b, status_a);

        if (comp_status === 0) {
          return Ember.compare(parseInt(b.get('id')), parseInt(a.get('id')));
        }

        return comp_status;
      }),
      userId: params.user_id
    });
  },

  // Same template than the standard list of vms
  renderTemplate:function () {
    this.render('cis/list');
  },

  // Setup the controller for vms.list with this model
  setupController: function(controller, model) {
    this.controllerFor('cis.list').setProperties({model: model,
                                                  ciVms: true,
                                                  userId: model.userId,
                                                  projectId: 0,
                                                  currentPage: 0});
  }
});
