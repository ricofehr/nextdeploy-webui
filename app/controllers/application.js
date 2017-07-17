import Ember from 'ember';

/**
 *  This controller manages global search field
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Application
 *  @namespace controller
 *  @augments Ember.Controller
 *  @module nextdeploy
 */
export default Ember.Controller.extend({
  /**
   *  Define flag search and search value variable
   *
   *  @property search
   *  @type {String}
   */
  search: null,

  /**
   *  Display search field only on list of items pages
   *
   *  @function showSearch
   *  @returns {Boolean}
   */
  showSearch: function() {
    var currentRoute = this.get("currentPath");
    var showSearch = false;

    /* Load Search only list pages */
    if (/.*\.list/.test(currentRoute)) {
      showSearch = true;
    }

    this.set('search', null);

    return showSearch;
  }.property('currentPath'),
});
