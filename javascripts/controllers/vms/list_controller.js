// Ember controller for list vm into html array
var VmsListController = Ember.ArrayController.extend({
  // Sort order
  sortProperties: ['project', 'user.email'],
  sortAscending: true,

  // Show / hide on html side
  isShowingDeleteConfirmation: false,
  isAllDelete: false,

  // // Filter model values for html display
  // sortModel: function() {
  //   var model = this.get('model') ;
  //   var vmsFilter = model.filterBy('nova_id') ;
  //   var vmsSort = vmsFilter.sort('sortProperties') ;
  //   vmsSort.map(function (model) {
  //     var textStatus = '';
  //     var warnStatus = false;
  //     var dangStatus = false;
  //     var sucStatus = false;
  //     var status = model.get('status');

  //     if (status == 0) { textStatus = 'SETUP'; warnStatus = true; }
  //     if (status == 1) { textStatus = 'RUNNING'; sucStatus = true; }
  //     if (status == 2) { textStatus = 'ERROR'; dangStatus = true; }

  //     model.set('created_at_short', model.get('created_at').getDate() + "/" + (model.get('created_at').getMonth() + 1) + "/" + model.get('created_at').getFullYear()) ;

  //     model.set('todelete', false) ;
  //     model.set('textStatus', textStatus);
  //     model.set('sucStatus', sucStatus);
  //     model.set('warnStatus', warnStatus);
  //     model.set('dangStatus', dangStatus);

  //     //return model ;
  //   }) ;

  //   //this.set('vms', vms) ;
  // }.observes('model.[]'),

  // Filter model values for html display
  vms: Ember.computed.map('model', function(model){
      var textStatus = '';
      var warnStatus = false;
      var dangStatus = false;
      var sucStatus = false;
      var status = model.get('status');

      if (status == 0) { textStatus = 'SETUP'; warnStatus = true; }
      if (status == 1) { textStatus = 'RUNNING'; sucStatus = true; }
      if (status == 2) { textStatus = 'ERROR'; dangStatus = true; }

      model.set('created_at_short', model.get('created_at').getDate() + "/" + (model.get('created_at').getMonth() + 1) + "/" + model.get('created_at').getFullYear()) ;

      model.set('todelete', false) ;
      model.set('textStatus', textStatus);
      model.set('sucStatus', sucStatus);
      model.set('warnStatus', warnStatus);
      model.set('dangStatus', dangStatus);

      return model ;
  }),

  // Check if current user is admin
  isAdmin: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel') ;

    if (access_level == 50) return true ;
    return false ;
  }.property('App.AuthManager.apiKey'),

  // Check if current user can launch vm
  isVm: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel') ;

    if (access_level >= 20) return true ;
    return false ;
  }.property('App.AuthManager.apiKey'),

  // actions binding with user event
  actions: {
    // action to show vm uri into popin modal
    showUri: function(uri, login, password, technos) {
      var technonjs = technos.findBy('name', 'nodejs');
      var modal = $('#textModal');
      modal.find('.modal-title').text('Urls');

      if (technonjs) {
        modal.find('.modal-body').html(
          '<a href="http://' + login + ':' + password + '@' + uri + '" target="_blank">'+ uri + '</a><br/>' +
          '<a href="http://' + login + ':' + password + '@' + 'admin.' + uri + '" target="_blank">admin.'+ uri + '</a><br/>' +
          '<a href="http://' + login + ':' + password + '@' + 'm.' + uri + '" target="_blank">m.'+ uri + '</a><br/>' +
          '<a href="http://' + login + ':' + password + '@' + 'nodejs.' + uri + '" target="_blank">nodejs.'+ uri + '</a><br/>'
        );
      } else {
        modal.find('.modal-body').html(
          '<a href="http://' + login + ':' + password + '@' + uri + '" target="_blank">'+ uri + '</a><br/>' +
          '<a href="http://' + login + ':' + password + '@' + 'admin.' + uri + '" target="_blank">admin.'+ uri + '</a><br/>' +
          '<a href="http://' + login + ':' + password + '@' + 'm.' + uri + '" target="_blank">m.'+ uri + '</a><br/>'
        );
      }
      modal.modal();
    },

    // action for delete event
    deleteItems: function() {
      var router = this.get('target');
      var vms = this.get('model.[]') ;
      var items = this.filterProperty('todelete', true) ;

      items.forEach(function(model) {
        model.destroyRecord() ;
        vms.removeObject(model) ;
      }) ;

      this.set('isShowingDeleteConfirmation', false) ;
      this.set('isAllDelete', false) ;
      router.transitionTo('vms.list');
    },

    // Change hide/show for delete confirmation
    showDeleteConfirmation: function() {
      this.toggleProperty('isShowingDeleteConfirmation') ;
    },

    // Action for add a new item, change current page to create form
    newItem: function() {
      var router = this.get('target');
      router.transitionTo('vms.new');
    },

    // Toggle or untoggle all items
    toggleDeleteAll: function() {
      if (this.get('isAllDelete')) this.set('isAllDelete', false) ;
      else this.set('isAllDelete', true) ;
      this.setEach('todelete', this.get('isAllDelete'));
    },
  }
});

module.exports = VmsListController;
