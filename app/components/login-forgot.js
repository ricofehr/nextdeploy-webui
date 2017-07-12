import Ember from 'ember';
import config from '../config/environment';

/**
 *  This component manages the forget password form
 *
 *  @module components/login-forgot
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Close forgot modal
     *
     *  @function
     */
    closeForgot: function() {
      this.set('modalForgot', false);
    },

    /**
     *  Submit forgot password form
     *
     *  @function
     */
    forgotPassword: function(email, password) {
      var self = this;

      self.set('emailSend', false);
      self.set('errorPass', false);
      self.set('errorMail', false);

      this.set('modalForgot', true);

      if (!email) {
        self.set('errorMail', true);
        return;
      }

      if (password) {
        self.set('errorPass', true);
        return;
      }

      // forgot request
      Ember.$.ajax({
          url: config.APP.APIHost + '/api/v1/user/forgot/' + email,
          type: "GET",
          success: function() {
            self.set('emailSend', true);
          }
      });
    }
  },

  /**
   *  Validate email field
   *
   *  @type {Boolean}
   */
  errorMail: false,

  /**
   *  Validate password field
   *
   *  @type {Boolean}
   */
  errorPass: false,

  /**
   *  Flag on email sending
   *
   *  @type {Boolean}
   */
  emailSend: false,

  /**
   *  Flag to display the forgot modal
   *
   *  @type {Boolean}
   */
  modalForgot: false
});
