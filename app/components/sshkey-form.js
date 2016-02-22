import Ember from 'ember';

export default Ember.Component.extend({
  //validation variables
  errorName: false,
  errorKey: false,

  // trigger when model changes
  didReceiveAttrs() {
    this._super(...arguments);
    this.formIsValid();
  },

  // ensure that name attribute is not empty
  checkName: function() {
    var name = this.get('sshkey.name');
    var errorName = false;

    if (!name) {
      errorName = true;
    }

    this.set('errorName', errorName);
  }.observes('sshkey.name'),

  // ensure that key attribute is not empty
  checkKey: function() {
    var key = this.get('sshkey.key');
    var errorKey = false;

    if (!key) {
      errorKey = true;
    }

    this.set('errorKey', errorKey);
  }.observes('sshkey.key'),

  //check form before submit
  formIsValid: function() {
    this.checkName();
    this.checkKey();

    if (!this.get('errorName') &&
        !this.get('errorKey')) { return true; }
    return false;
  },

  actions: {
    // submit form creation
    postItem: function() {
      var router = this.get('router');

      // if success, redirect on profile page
      var pass = function() {
        router.transitionTo('users.edit', this.get('user.id'));
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
  }
});