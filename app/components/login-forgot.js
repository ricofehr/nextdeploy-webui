import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  errorMail: false,
  errorPass: false,
  emailSend: false,
  modalForgot: false,

  actions: {
    // close forgot modal
    closeForgot: function() {
      this.set('modalForgot', false);
    },

    // submit forgot password form
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
  }
});