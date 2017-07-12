import Ember from 'ember';

/**
 *  This component manages the brand form for creation and editing
 *
 *  @module components/brand-form
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Submit form for create or update current object
     *
     *  @function
     */
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
  },

  /**
   *  Ensure the name attribute is filled
   *
   *  @function
   *  @returns {Boolean} true if no valid field
   */
  errorName: function() {
    var name = this.get('brand.name');
    var errorName = false;

    if (!name) {
      errorName = true;
    }

    return errorName;
  }.property('brand.name'),

  /**
   *  Ensure the name attribute is unique
   *
   *  @function
   *  @returns {Boolean} true if no valid field
   */
  errorNameUnique: function() {
    var brands = this.get('brands');
    var name = this.get('brand.name');
    var current_id = this.get('brand.id');
    var errorName = false;

    if (!brands || brands.length === 0) {
      return false;
    }

    if (!name || name.length === 0) {
      return false;
    }

    brands.filterBy('name').forEach(function (item) {
      if (item.id !== current_id) {
        if (item.get('name') === name) {
          errorName = true;
        }
      }
    });

    return errorName;
  }.property('brand.name'),

  /**
   *  Ensure the form is valid before submit
   *
   *  @function
   *  @returns {Boolean} true if valid
   */
  formIsValid: function() {
    if (!this.get('errorName') &&
        !this.get('errorNameUnique')) {
          return true;
    }
    return false;
  }
});
