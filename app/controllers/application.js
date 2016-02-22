import Ember from 'ember';

export default Ember.Controller.extend({

  // difeine flag search and search value variable
  showSearch: false,
  search: null,

  // we want display search field only on list of items pages
  hideSearch: function() {
    var currentRoute = this.get("currentPath");
    var showSearch = false;

    /* Load Search only list pages */
    if (/.*\.list/.test(currentRoute)) {
      showSearch = true;
    }

    this.set('showSearch', showSearch);
    this.set('search', null);

  }.observes('currentPath'),
});