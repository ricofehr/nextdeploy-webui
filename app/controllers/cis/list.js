import Ember from 'ember';

export default Ember.Controller.extend({
  currentPage: 0,
  refreshList: 0,
  isBusy: false,
  // get search field from application context
  appController: Ember.inject.controller('application'),
  search: Ember.computed.reads('appController.search'),

  // reset current page if search field changes
  resetCurrentPage: function() {
    this.set('currentPage', 0);
  }.observes('search'),

  // refresh user list
  prepareList: function() {
    var cp = this.get('refreshList');
    this.set('refreshList', parseInt(cp+1));
  }
});