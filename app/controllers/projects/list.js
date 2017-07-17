import Ember from 'ember';

/**
 *  This controller manages search and refresh triggers for projects list
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class ProjectsList
 *  @namespace controller
 *  @augments Ember.Controller
 *  @module nextdeploy
 */
export default Ember.Controller.extend({
  /**
   *  Store the current page number
   *
   *  @property currentPage
   *  @type {Integer}
   */
  currentPage: 0,

  /**
   *  Store an incremented number to triggers a list refreshment
   *
   *  @property refreshList
   *  @type {Integer}
   */
  refreshList: 0,

  /**
   *  A busy state who forbid a refresh action
   *
   *  @property isBusy
   *  @type {Boolean}
   */
  isBusy: false,

  /**
   *  The parent controller
   *
   *  @property appController
   *  @type {Controller}
   */
  appController: Ember.inject.controller('application'),

  /**
   *  Get search field from application context
   *
   *  @property search
   *  @type {Input}
   */
  search: Ember.computed.reads('appController.search'),

  /**
   *  Reset current page if changes in search field
   *
   *  @method resetCurrentPage
   */
  resetCurrentPage: function() {
    this.set('currentPage', 0);
  }.observes('search'),

  /**
   *  Triggers a refresh of items list
   *
   *  @method prepareList
   */
  prepareList: function() {
    var cp = this.get('refreshList');
    this.set('refreshList', parseInt(cp+1));
  }
});
