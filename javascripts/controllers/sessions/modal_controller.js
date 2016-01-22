// Ember controller for project modals
var SessionsModalController = Ember.ObjectController.extend({
  errorMail: false,
  errorPass: false,
  emailSend: false,
  // show / hide forgot modal
  showForgot: function() {
    $('#modalforgot').modal('show');
  },

  hideForgot: function() {
    $('#modalforgot').modal('hide');
  },

  // show / hide help modal
  showHelp: function() {
    $('#modalhelp').modal('show');
  },

  hideHelp: function() {
    $('#modalhelp').modal('hide');
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
          success: function(results, textStatus, jqXHR) {
            self.set('emailSend', true);
          }
      });
  }

});

module.exports = SessionsModalController;