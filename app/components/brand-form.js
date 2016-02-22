import Ember from 'ember';

export default Ember.Component.extend({
  //validation variables
  errorName: false,
  errorName2: false,

  //validation function
  checkName: function() {
    var name = this.get('brand.name');
    var errorName = false;

    if (!name) {
      errorName = true;
    }

    this.set('errorName', errorName);
  }.observes('brand.name'),

  // check if brand name is uniq
  checkName2: function() {
    var brands = this.get('brands');
    var name = this.get('brand.name');
    var current_id = this.get('brand.id');
    var self = this;
    var errorName2 = false;

    if (!brands || brands.length === 0) { return; }
    if (!name || name.length === 0) { return; }

    brands.filterBy('name').forEach(function (item) {
      if (item.id !== current_id) {
        if (item.get('name') === name) {
          errorName2 = true;
        }
      }
    });

    self.set('errorName2', errorName2);
  }.observes('brand.name'),

  // check form before submit
  formIsValid: function() {
    this.checkName();
    this.checkName2();

    if (!this.get('errorName') && !this.get('errorName')) { return true; }
    return false;
  },


  actions: {
    // insert or update current brand object
    postItem: function() {
      var router = this.get('router');

      // check if form is valid
      if (!this.formIsValid()) {
        return;
      }

      // redirect if success
      var pass = function(){
        router.transitionTo('brands.list');
      };

      // error modal if issue occurs
      var fail = function(){
        router.transitionTo('error');
      };

      // loading modal and server request for update object
      router.transitionTo('loading');
      this.get('brand').save().then(pass, fail);
    },
  }
});