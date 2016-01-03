var SshkeysNewController = Ember.ObjectController.extend({
  //validation variables
  errorName: false,
  errorKey: false,

  //validation function
  checkName: function() {
    var name = this.get('name');
    var errorName = false;

    if (!name) {
      errorName = true;
    }

    this.set('errorName', errorName);
  }.observes('name'),

  checkKey: function() {
    var key = this.get('key');
    var errorKey = false;

    if (!key) {
      errorKey = true;
    }

    this.set('errorKey', errorKey);
  }.observes('key'),

  //check form before submit
  formIsValid: function() {
    this.checkName();
    this.checkKey();

    if (!this.get('errorName') &&
        !this.get('errorKey')) return true;
    return false;
  }.observes('model'),

  //clear form
  clearForm: function() {
    this.set('name', null);
    this.set('key', null);
  },

  actions: {
    postItem: function() {
      var router = this.get('target');
      var data = this.getProperties('id', 'name', 'key')
      var store = this.store;

      // check if form is valid
      if (!this.formIsValid()) {
        return;
      }

      data['user'] = this.get('user');

      //if id is present, so update item, else create new one
      if(data['id']) {
        store.find('sshkey', data['id']).then(function (sshkey) {
          sshkey.setProperties(data);
          sshkey.save();
        });
      } else {
        sshkey = store.createRecord('sshkey', data);
        sshkey.save();
      }

      router.transitionTo('users.edit', this.get('user.id'));
    }
  }
});

module.exports = SshkeysNewController;