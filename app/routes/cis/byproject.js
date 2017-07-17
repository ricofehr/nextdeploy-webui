import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) ci vms list route filter by project
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class CisByProject
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the model for ci vms list
   *    - vms arrays with jenkins state and sorted by status, id
   *    - project id
   *
   *  @function model
   *  @param {Hash} params String => String (with project id)
   *  @returns {Hash} a RSVP hash included vms and project id
   */
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
      projectId: params.project_id
    });
  },

  /**
   *  Define the template
   *
   *  @method renderTemplate
   */
  renderTemplate:function () {
    this.render('cis/list');
  },

  /**
   *  Setup the controller with the model
   *
   *  @method setupController
   *  @param {Controller}
   *  @param {model} the model
   */
  setupController: function(controller, model) {
    this.controllerFor('cis.list').setProperties({model: model,
                                                  ciVms: true,
                                                  userId: 0,
                                                  projectId: model.projectId,
                                                  currentPage: 0});
  }
});
