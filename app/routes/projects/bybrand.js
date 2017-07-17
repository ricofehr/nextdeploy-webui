import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define the (authenticated) projects list route filter by brand
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class ProjectsByBrand
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  /**
   *  Return the model for projects list
   *    - projects array list sorted by id
   *    - brand id
   *
   *  @function model
   *  @param {Hash} params String => String (with brand id)
   *  @returns {Hash} a RSVP hash included projects and brand id
   */
  model(params) {
    return Ember.RSVP.hash({
      projects: this.store.peekAll('project').toArray().sort(function(a, b) {
        return Ember.compare(parseInt(b.id), parseInt(a.id));
      }),
      brandId: params.brand_id
    });
  },

  /**
   *  Define the template
   *
   *  @method renderTemplate
   */
  renderTemplate:function () {
    this.render('projects/list');
  },

  /**
   *  Setup the controller with the model
   *
   *  @method setupController
   *  @param {Controller}
   *  @param {model} the model
   */
  setupController: function(controller, model) {
    this.controllerFor('projects.list').setProperties({model: model,
                                                       userId: 0,
                                                       brandId: model.brandId,
                                                       currentPage: 0});
  }
});
