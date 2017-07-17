import Ember from 'ember';

/**
 *  This component manages the sshkeys list
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class SshkeysList
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Submit delete event
     *
     *  @event deleteItems
     */
    deleteItems: function() {
      var router = this.get('router');
      var pass = function(){};
      var fail = function(){ router.transitionTo('error'); };

      var items = this.get('user.sshkeys').filterBy('todelete', true);

      for(var i = 0; i < items.length; i++) {
        if (items[i] && items[i].todelete) {
          items[i].destroyRecord().then(pass, fail);
          items[i].get('user').get('sshkeys').removeObject(items[i]);
          this.store.peekAll('sshkey').removeObject(items[i]);
        }
      }

      this.set('isShowingDeleteConfirmation', false);
      this.set('isAllDelete', false);
    },

    /**
     *  Display delete confirmation modal
     *
     *  @event showDeleteConfirmation
     */
    showDeleteConfirmation: function() {
      var items = this.get('user.sshkeys').filterBy('todelete', true);
      var deleteItems = [];

      for(var i = 0; i < items.length; i++) {
        deleteItems.push(items[i].get('name'));
      }

      if (deleteItems.length > 0) {
        this.set('deleteItems', deleteItems);
        this.set('isShowingDeleteConfirmation', true);
      }
    },

    /**
     *  Go to project creation form
     *
     *  @event newItem
     */
    newItem: function() {
      var router = this.get('router');
      var user = this.get('user');

      router.transitionTo('sshkeys.new', user.get('id'));
    },

    /**
     *  Toggle or untoggle all items
     *
     *  @event toggleDeleteAll
     */
    toggleDeleteAll: function() {
      this.set('isShowingDeleteConfirmation', false);
      if (this.get('isAllDelete')) {
        this.set('isAllDelete', false);
      } else {
        this.set('isAllDelete', true);
      }
      this.get('user.sshkeys').setEach('todelete', this.get('isAllDelete'));
    }
  },

  /**
   *  Flag to show the delete confirm modal
   *
   *  @property isShowingDeleteConfirmation
   *  @type {Boolean}
   */
  isShowingDeleteConfirmation: false,

  /**
   *  Flag to select all the user sshkeys to being deleted
   *
   *  @property isAllDelete
   *  @type {Boolean}
   */
  isAllDelete: false,

  /**
   *  Trigger when receives models
   *
   *  @method didReceiveAttrs
   */
  didReceiveAttrs() {
    this._super(...arguments);
    this.cleanModel();
    this.shortKey();
  },

  /**
   *  Delete records unsaved or deleted
   *
   *  @method cleanModel
   */
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

  /**
   *  Generates key_short attribute
   *
   *  @method shortKey
   */
  shortKey() {
    var self = this;
    this.get('user').get('sshkeys').map(function (model) {
      self.store.findRecord('sshkey', model.id).then(function (sshkey) {
        var key = sshkey.get('key');
        var keyL = key.length;
        var keyShort = key;

        // crop key for display it into array
        if (keyL > 70) {
          keyShort = key.substring(0,30) + '...' + key.substring(keyL-40, keyL);
        }
        model.set('key_short', keyShort);
      });
    });
  }
});
