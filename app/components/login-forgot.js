import Ember from 'ember';
import config from '../config/environment';

/**
 *  This component manages the forget password form
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class LoginForgot
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Close forgot modal
     *
     *  @event closeForgot
     */
    closeForgot: function() {
      this.set('modalForgot', false);
    },

    /**
     *  Submit forgot password form
     *
     *  @event forgotPassword
     *  @param {String} email
     *  @param {String} password
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
   *  @property errorMail
   *  @type {Boolean}
   */
  errorMail: false,

  /**
   *  Validate password field
   *
   *  @property errorPass
   *  @type {Boolean}
   */
  errorPass: false,

  /**
   *  Flag on email sending
   *
   *  @property emailSend
   *  @type {Boolean}
   */
  emailSend: false,

  /**
   *  Flag to display the forgot modal
   *
   *  @property modalForgot
   *  @type {Boolean}
   */
  modalForgot: false
});
