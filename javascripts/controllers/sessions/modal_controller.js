// Ember controller for project modals
var SessionsModalController = Ember.ObjectController.extend({
  errorMail: false,
  errorPass: false,
  emailSend: false,
  // show / hide modal
  showForgot: function() {
    $('#modalforgot').modal('show');
  },

  hideForgot: function() {
    $('#modalforgot').modal('hide');
  },

  // forgot password
  forgotPassword: function(email, password) {
    var self = this;
    var router = this.get('target');
    var store = this.store;
    
    self.set('emailSend', false);
    self.set('errorPass', false);
    self.set('errorMail', false);

    self.showForgot();

    if (!email) {
      self.set('errorMail', true);
      return
    }

    if (password) {
      self.set('errorPass', true);
      return
    }

    $.ajax({
          url: '/api/v1/user/forgot/' + email,
          type: "GET",
          
          /**
           * A function to be called if the request succeeds.
           */
          success: function(results, textStatus, jqXHR) {
            self.set('emailSend', true);
          }
      });
  }
  
});

module.exports = SessionsModalController;