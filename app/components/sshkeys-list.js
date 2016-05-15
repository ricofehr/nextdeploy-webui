import Ember from 'ember';

export default Ember.Component.extend({
// Show / hide on html side
  isShowingDeleteConfirmation: false,
  isAllDelete: false,

  // trigger when model changes
  didReceiveAttrs() {
    this._super(...arguments);
    this.cleanModel();
    this.shortKey();
  },

  // delete records unsaved or deleted
  cleanModel: function() {
    var self = this;
    var cleanKeys = this.get('user').get('sshkeys').filterBy('isDeleted', true);

    cleanKeys.forEach(function (clean) {
      if (clean) { self.store.peekAll('sshkey').removeObject(clean); }
    });

    cleanKeys = this.store.peekAll('sshkey').filterBy('id', null);
    cleanKeys.forEach(function (clean) {
      if (clean) {
        self.store.peekAll('sshkey').removeObject(clean);
        clean.deleteRecord();
      }
    });
  },

  // add key_short parameter
  shortKey() {
    var self = this;
    this.get('user').get('sshkeys').map(function (model) {
      self.store.findRecord('sshkey', model.id).then(function (sshkey) {
        var key = sshkey.get('key');
        var key_l = key.length;
        var key_s = key;

        // crop key for display it into array
        if (key_l>70) {
          key_s = key.substring(0,30) + '...' + key.substring(key_l-40, key_l);
        }
        model.set('key_short', key_s);
      });
    });
  },

  // actions binding with user event
  actions: {
    // action for delete event
    deleteItems: function() {
      var router = this.get('router');
      var pass = function(){};
      var fail = function(){ router.transitionTo('error'); };

      var items = this.get('user.sshkeys').filterBy('todelete', true);

      for(var i=0; i<items.length; i++) {
        if (items[i] && items[i].todelete) {
          items[i].destroyRecord().then(pass, fail);
          items[i].get('user').get('sshkeys').removeObject(items[i]);
          this.store.peekAll('sshkey').removeObject(items[i]);
        }
      }

      this.set('isShowingDeleteConfirmation', false);
      this.set('isAllDelete', false);
    },

    // Change hide/show for delete confirmation
    showDeleteConfirmation: function() {
      var items = this.get('user.sshkeys').filterBy('todelete', true);
      var deleteItems = [];

      for(var i=0; i<items.length; i++) {
        deleteItems.push(items[i].get('name'));
      }

      if (deleteItems.length > 0) {
        this.set('deleteItems', deleteItems);
        this.set('isShowingDeleteConfirmation', true);
      }
    },

    // Action for add a new item, change current page to create form
    newItem: function() {
      var router = this.get('router');
      var user = this.get('user');

      router.transitionTo('sshkeys.new', user.get('id'));
    },

    // Toggle or untoggle all items
    toggleDeleteAll: function() {
      this.set('isShowingDeleteConfirmation', false);
      if (this.get('isAllDelete')) {
        this.set('isAllDelete', false);
      } else {
        this.set('isAllDelete', true);
      }
      this.get('user.sshkeys').setEach('todelete', this.get('isAllDelete'));
    }
  }
});