// Ember controller for list users into html array
var UsersListController = Ember.ArrayController.extend({
  //sortedUsers: Ember.computed.sort('model', 'sortProperties'),

  // Show / hide on html side
  isShowingDeleteConfirmation: false,
  isAllDelete: false,

  // Filters by input param
  projectId: 0,
  groupId: 0,

  // Return model array with email setted, sorted by email and with isCurrent parameter
  sortModel: function() {
    var groupId = parseInt(this.get('groupId'), 10);
    var projectId = parseInt(this.get('projectId'), 10);
    var firstUser = null;
    // get users who has already created (filter on created_at field) and not remove since (filter on group field)
    var users = this.get('model').filterBy('created_at').filterBy('group').sortBy('email');

    // if groupId parameter exists
    if (groupId != 0) {
      users = users.filter(function(item, index, enumerable){
        return parseInt(item.get('group.id'), 10) == groupId;
      });
    }

    // if projectId parameter exists
    if (projectId != 0) {
      users = users.filter(function(item, index, enumerable){
        return item.get('projects').any(function(item, index, enumerable){
          return parseInt(item.get('id'), 10) == projectId;
        });
      });
    }

    
    users = users.map(function(model){
      var user_id = model.get('id');
      var current_id = App.AuthManager.get('apiKey.user');

      model.set('isCurrent', (user_id == current_id));
      if (user_id == current_id) firstUser = model;
      
      return model;
    });

    if (firstUser) {
      users.removeObject(firstUser);
      users.unshiftObject(firstUser);
    }

    this.set('users', users);
  }.observes(
    'model.[]',
    'model.@each.created_at',
    'model.@each.group',
    'model.@each.email',
    'model.@each.company',
    'model.@each.projects',
    'model.@each.vms',
    'projectId',
    'groupId'
  ),

  // Check if current user is admin
  isAdmin: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');

    if (access_level == 50) return true;
    return false;
  }.property('App.AuthManager.apiKey'),

  // Check if current user is admin
  isLead: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');

    if (access_level >= 40) return true;
    return false;
  }.property('App.AuthManager.apiKey'),

  // Return current user
  isCurrent: function(user_id) {
    var current_id = App.AuthManager.get('apiKey.user');

    if (user_id == current_id) return true;
    return false;
  }.property('App.AuthManager.apiKey'),

  // actions binding with user event
  actions: {
    // action for delete event
    deleteItems: function() {
      var router = this.get('target');
      var users = this.get('users');
      var items = this.filterProperty('todelete', true);

      items.forEach(function(model) {
        model.destroyRecord();
        users.removeObject(model);
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
      router.transitionTo('users.new');
    },

    // Toggle or untoggle all items
    toggleDeleteAll: function() {
      if (this.get('isAllDelete')) this.set('isAllDelete', false);
      else this.set('isAllDelete', true);
      this.setEach('todelete', this.get('isAllDelete'));
    }
  }
});

module.exports = UsersListController;