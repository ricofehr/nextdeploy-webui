// Ember controller for list projects into html array
var ProjectsListController = Ember.ArrayController.extend({
  // Show / hide on html side
  isShowingDeleteConfirmation: false,
  isAllDelete: false,

  // Return model array sorted
  sortModel: function() {
    var model = this.get('model') ;
    // sort projects by id
    var projectsSort = model.filterBy('name').sort(function(a, b) {
        return Ember.compare(parseInt(a.id, 10), parseInt(b.id, 10)); 
    }).reverse() ;
    var self = this;

    // reset delete toggle
    this.set('isAllDelete', false);
    this.set('isShowingDeleteConfirmation', false);

    //filter projects array only with valid item for current user
    this.set('projects', projectsSort.map(function(model){
      model.set('gitpath_href', "git@" + model.get('gitpath')) ;
      model.set('created_at_short', model.get('created_at').getDate() + "/" + (model.get('created_at').getMonth()+1) + "/" + model.get('created_at').getFullYear()) ;

      return model ;
    }));
  }.observes('model'),

  // Check if current user is admin
  isAdmin: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel') ;

    if (access_level == 50) return true ;
    return false ;
  }.property('App.AuthManager.apiKey'),

  // Check if current user can create project
  isProjectCreate: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel') ;
    if (access_level == 50) return true ;
    
    return App.AuthManager.get('apiKey.is_project_create') ;
  }.property('App.AuthManager.apiKey'),


  // Check if current user is lead
  isLead: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel') ;

    if (access_level >= 40) return true ;
    return false ;
  }.property('App.AuthManager.apiKey'),

  // actions binding with user event
  actions: {
    // action for delete event
    deleteItems: function() {
      var router = this.get('target');
      var projects = this.get('projects') ;
      var items = this.get('projects').filterBy('todelete', true) ;

      items.forEach(function(model) {
          model.destroyRecord() ;
          projects.removeObject(model) ;
      }) ;

      this.set('isShowingDeleteConfirmation', false) ;
      this.set('isAllDelete', false) ;
    },

    // Change hide/show for delete confirmation
    showDeleteConfirmation: function() {
      this.toggleProperty('isShowingDeleteConfirmation') ;
    },

    // Action for add a new item, change current page to create form
    newItem: function() {
      var router = this.get('target') ;
      router.transitionTo('projects.new') ;
    },

    // Toggle or untoggle all items
    toggleDeleteAll: function() {
      if (this.get('isAllDelete')) this.set('isAllDelete', false) ;
      else this.set('isAllDelete', true) ;

      this.setEach('todelete', this.get('isAllDelete'));
    },
  }
});

module.exports = ProjectsListController;