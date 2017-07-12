import Ember from 'ember';

/**
 *  This component manages the sshkey form
 *
 *  @module components/sshkey-form
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Submit form for create current object
     *
     *  @function
     */
    postItem: function() {
      var router = this.get('router');
      var self = this;

      // if success, redirect on profile page
      var pass = function() {
        router.transitionTo('users.edit', self.get('user.id'));
      };

      // if error occurs, redirect on error page
      var fail = function() {
        router.transitionTo('error');
      };

      // check if form is valid
      if (!this.formIsValid()) {
        return;
      }

      // loading modal and requests server
      router.transitionTo('loading');
      this.get('sshkey').save().then(pass, fail);
    }
  },

  /**
   *  Trigger when receives models
   *
   *  @function
   */
  didReceiveAttrs() {
    this._super(...arguments);
    this.formIsValid();
  },

  /**
   *  Ensure name is filled and normalize it
   *
   *  @function
   *  @returns {Boolean} true if no valid field
   */
  errorName: function() {
    var name = this.get('sshkey.name');
    var errorName = true;
    var self = this;

    if (name) {
      errorName = false;

      // normalize
      name = name.toLowerCase();
      name = name.replace(/ /g, '');

      if (this.get('sshkey.name') !== name) {
          Ember.run.once(function() {
            self.set('sshkey.name', name);
          });
      }
    }

    return errorName;
  }.property('sshkey.name'),

  /**
   *  Ensure key is filled
   *
   *  @function
   *  @returns {Boolean} true if no valid field
   */
  errorKey: function() {
    var key = this.get('sshkey.key');

    if (!key) {
      return true;
    }

    return false;
  }.property('sshkey.key'),

  /**
   *  Ensures all form fields are valids before submit
   *
   *  @function
   */
  formIsValid: function() {
    this.checkName();
    this.checkKey();

    if (!this.get('errorName') &&
        !this.get('errorKey')) {
      return true;
    }
    return false;
  }
});
