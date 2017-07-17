import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) vms list route
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class VmsList
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the model for vms list
   *    - vms arrays with no jenkins state and sorted by is_prod, status and id
   *
   *  @function model
   *  @returns {Hash} a RSVP hash included users and project id
   */
  model() {
    return Ember.RSVP.hash({
      vms: this.store.peekAll('vm').toArray().filterBy('is_jenkins', false).sort(function(a, b) {
        var prod_a = a.get('is_prod') ? 1 : 0;
        var prod_b = b.get('is_prod') ? 1 : 0;
        var status_a = parseInt(a.get('status'));
        var status_b = parseInt(b.get('status'));

        if (status_a !== 1) {
          status_a = status_a > 1 ? 0 : (-status_a);
        }

        if (status_b !== 1) {
          status_b = status_b > 1 ? 0 : (-status_b);
        }

        var comp_status = Ember.compare(status_b, status_a);
        var comp_prod = Ember.compare(prod_b, prod_a);

        if (comp_status === 0 && comp_prod === 0) {
          return Ember.compare(parseInt(b.get('id')), parseInt(a.get('id')));
        }

        if (comp_status === 0) {
          return comp_prod;
        }

        return comp_status;
      })
    });
  },

  /**
   *  Setup the controller with the model
   *
   *  @method setupController
   *  @param {Controller}
   *  @param {model} the model
   */
  setupController: function(controller, model) {
    this.controllerFor('vms.list').setProperties({model: model,
                                                  ciVms: true,
                                                  userId: 0,
                                                  projectId: 0});
  }
});
