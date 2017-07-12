import Ember from 'ember';

/**
 *  This component manages the sshkeys list
 *
 *  @module components/sshkey-list
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  /**
   *  Flag to show the delete confirm modal
   *
   *  @type {Boolean}
   */
  isShowingDeleteConfirmation: false,

  /**
   *  Flag to select all the user sshkeys to being deleted
   *
   *  @type {Boolean}
   */
  isAllDelete: false,

  /**
   *  Trigger when receives models
   *
   *  @function
   */
  didReceiveAttrs() {
    this._super(...arguments);
    this.cleanModel();
    this.shortKey();
  },

  /**
   *  Delete records unsaved or deleted
   *
   *  @function
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
   *  @function
   */
  shortKey() {
    var self = this;
    this.get('user').get('sshkeys').map(function (model) {
      self.store.findRecord('sshkey', model.id).then(function (sshkey) {
        var key = sshkey.get('key');
        var key_l = key.length;
        var key_s = key;

        // crop key for display it into array
        if (key_l > 70) {
          key_s = key.substring(0,30) + '...' + key.substring(key_l-40, key_l);
        }
        model.set('key_short', key_s);
      });
    });
  }
});
