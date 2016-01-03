// Ember controller for list vm into html array
var VmsListController = Ember.ArrayController.extend({
  // Show / hide on html side
  isShowingDeleteConfirmation: false,
  isAllDelete: false,

  // filters param
  userId: 0,
  projectId: 0,

  // Return model array sorted
  sortModel: function() {
    var self = this;
    var userId = parseInt(this.get('userId'), 10);
    var projectId = parseInt(this.get('projectId'), 10);
    var vms = self.get('model').filterBy('created_at');

    // if userId parameter exists
    if (userId != 0) {
      vms = vms.filter(function(item, index, enumerable){
        return parseInt(item.get('user.id'), 10) == userId;
      });
    }

    // if projectId != 0
    if (projectId != 0) {
      vms = vms.filter(function(item, index, enumerable){
        return parseInt(item.get('project.id'), 10) == projectId;
      });
    }

    // sort vms by id
    var vmsSort = vms.sort(function(a, b) {
        return Ember.compare(parseInt(a.id, 10), parseInt(b.id, 10));
    }).reverse();

    this.set('vms', vmsSort.map(function(model){
      var textStatus = '';
      var warnStatus = false;
      var dangStatus = false;
      var sucStatus = false;
      var status = model.get('status');

      model.set('todelete', false);
      model.set('created_at_short', model.get('created_at').getDate() + "/" + (model.get('created_at').getMonth() + 1) + " " +  + model.get('created_at').getHours() + ":" +  + model.get('created_at').getMinutes());

      if (status < 1) {
        textStatus = 'SETUP';
        warnStatus = true;
        //if status is negative => setup in progress
        model.set('timeStatus', -parseInt(status));
      }
      if (status > 1) { textStatus = 'RUNNING'; sucStatus = true; model.set('timeStatus', (status)); }
      if (status == 1) { textStatus = 'ERROR'; dangStatus = true; }

      model.set('textStatus', textStatus);
      model.set('sucStatus', sucStatus);
      model.set('warnStatus', warnStatus);
      model.set('dangStatus', dangStatus);
      return model;
    }));

  }.observes('model.@each.created_at', 'model.@each.status', 'model.[]', 'userId', 'projectId'),

  getStatus: function(model) {
    $.get("/api/v1/vms/" + model.get('id') + "/setupcomplete")
        .done(function(data) {
          model.set('status', data);
          model.set('timeStatus', data);
          model.set('textStatus', 'RUNNING');
          model.set('sucStatus', true);
          model.set('warnStatus', false);
        })
        .fail(function(data) {
          model.set('status', data.responseText);
          model.set('timeStatus', -parseInt(data.responseText));
        })
  },

  // Check if current user is admin
  isAdmin: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');

    if (access_level == 50) return true;
    return false;
  }.property('App.AuthManager.apiKey'),

  // Check if current user at least a dev
  isDev: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');

    if (access_level >= 30) return true;
    return false;
  }.property('App.AuthManager.apiKey'),

  // Check if current user is admin
  isLead: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');

    if (access_level >= 40) return true;
    return false;
  }.property('App.AuthManager.apiKey'),

  // Check if current user can launch vm
  isVm: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');

    if (access_level >= 20) return true;
    return false;
  }.property('App.AuthManager.apiKey'),

  // actions binding with user event
  actions: {
    // ajax call to get current status
    checkStatus: function(model) {
      var vm_id = model.get('id');

      // jquery get setupcomplete
      $.get("/api/v1/vms/" + vm_id + "/setupcomplete")
        .done(function(data) {
          model.set('status', data);
          model.set('timeStatus', data);
          model.set('textStatus', 'RUNNING');
          model.set('sucStatus', true);
          model.set('warnStatus', false);
          model.set('dangStatus', false);
        })
        .fail(function(data) {
          model.set('status', data.responseText);
          model.set('timeStatus', -parseInt(data.responseText));

          // check if error or setup
          if (parseInt(data.responseText) == 1) {
            model.set('textStatus', 'ERROR');
            model.set('sucStatus', false);
            model.set('warnStatus', false);
            model.set('dangStatus', true);
          } else {
            model.set('textStatus', 'SETUP');
            model.set('sucStatus', false);
            model.set('warnStatus', true);
            model.set('dangStatus', false);
          }
        });
    },

    // action for delete event
    deleteItems: function() {
      var router = this.get('target');
      var vms = this.get('vms');
      var items = this.filterProperty('todelete', true);

      items.forEach(function(model) {
        model.destroyRecord();
        vms.removeObject(model);
      });

      this.set('isShowingDeleteConfirmation', false);
      this.set('isAllDelete', false);
      router.transitionTo('vms.list');
    },

    // Change hide/show for delete confirmation
    showDeleteConfirmation: function() {
      this.toggleProperty('isShowingDeleteConfirmation');
    },

    // Action for add a new item, change current page to create form
    newItem: function() {
      var router = this.get('target');
      router.transitionTo('vms.new');
    },

    // Toggle or untoggle all items
    toggleDeleteAll: function() {
      if (this.get('isAllDelete')) this.set('isAllDelete', false);
      else this.set('isAllDelete', true);
      this.setEach('todelete', this.get('isAllDelete'));
    },
  }
});

module.exports = VmsListController;
