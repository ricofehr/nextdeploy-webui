// Ember controller for list projects into html array
var ProjectsListController = Ember.ArrayController.extend({
  // Show / hide on html side
  isShowingDeleteConfirmation: false,
  isAllDelete: false,

  // filters param
  userId: 0,
  brandId: 0,

  // Return model array sorted
  sortModel: function() {
    var model = this.get('model');
    var userId = parseInt(this.get('userId'), 10);
    var brandId = parseInt(this.get('brandId'), 10);
    var projects = model.filterBy('created_at').filterBy('brand');
    var day = '';
    var month = '';
    var year = '';
    
    // if brandId parameter exists
    if (brandId != 0) {
      projects = projects.filter(function(item, index, enumerable){
        return parseInt(item.get('brand.id'), 10) == brandId;
      });
    }

    // if userId parameter exists
    if (userId != 0) {
      projects = projects.filter(function(item, index, enumerable){
        return item.get('users').any(function(item, index, enumerable){
          return parseInt(item.get('id'), 10) == userId;
        });
      });
    }

    // sort projects by id
    var projectsSort = projects.sort(function(a, b) {
        return Ember.compare(parseInt(a.id, 10), parseInt(b.id, 10));
    }).reverse();
    var self = this;

    // reset delete toggle
    this.set('isAllDelete', false);
    this.set('isShowingDeleteConfirmation', false);

    //filter projects array only with valid item for current user
    this.set('projects', projectsSort.map(function(model){
      model.set('gitpath_href', "git@" + model.get('gitpath'));
      // init date value
      day = model.get('created_at').getDate();
      if (parseInt(day) < 10) day = '0' + day;
      month = model.get('created_at').getMonth() + 1;
      if (parseInt(month) < 10) month = '0' + month;
      year = model.get('created_at').getFullYear();
      
      model.set('created_at_short', day + "/" + month + "/" + year);
      return model;
    }));
  }.observes(
    'model.[]',
    'model.@each.created_at',
    'model.@each.name',
    'model.@each.technos',
    'model.@each.users',
    'model.@each.vms',
    'userId',
    'brandId'
  ),

  // Check if current user is admin
  isAdmin: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');

    if (access_level == 50) return true;
    return false;
  }.property('App.AuthManager.apiKey'),

  // Check if current user can create project
  isProjectCreate: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');
    if (access_level == 50) return true ;

    return App.AuthManager.get('apiKey.is_project_create');
  }.property('App.AuthManager.apiKey'),


  // Check if current user is lead
  isLead: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');

    if (access_level >= 40) return true;
    return false ;
  }.property('App.AuthManager.apiKey'),

  // actions binding with user event
  actions: {
    // action for delete event
    deleteItems: function() {
      var router = this.get('target');
      var projects = this.get('projects');
      var items = this.get('projects').filterBy('todelete', true);
      var vmitems = null;

      // Delete project and vms associated
      items.forEach(function(model) {
        if (model) {
          model.destroyRecord();
          projects.removeObject(model);
          model.get('vms').forEach(function(vm) {
            if (vm) vm.destroyRecord();
          });

          model.get('users').forEach(function(user) {
            if (user) user.get('projects').removeObject(model);
          });

          model.get('brand').get('projects').removeObject(model);
        }
      });

      this.set('isShowingDeleteConfirmation', false);
      this.set('isAllDelete', false);
    },

    // Change hide/show for delete confirmation
    showDeleteConfirmation: function() {
      this.toggleProperty('isShowingDeleteConfirmation');
    },

    // Action for add a new item, change current page to create form
    newItem: function() {
      var router = this.get('target');
      router.transitionTo('projects.new');
    },

    // Toggle or untoggle all items
    toggleDeleteAll: function() {
      if (this.get('isAllDelete')) this.set('isAllDelete', false);
      else this.set('isAllDelete', true);

      this.setEach('todelete', this.get('isAllDelete'));
    },
  }
});

module.exports = ProjectsListController;