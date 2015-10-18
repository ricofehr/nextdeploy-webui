// Ember controller for list vm into html array
var VmsListController = Ember.ArrayController.extend({
  // Sort order
  sortProperties: ['project', 'user.email'],
  sortAscending: true,

  // Show / hide on html side
  isShowingDeleteConfirmation: false,
  isAllDelete: false,

  // Filter model values for html display
  vms: Ember.computed.map('model', function(model){
      var textStatus = '';
      var warnStatus = false;
      var dangStatus = false;
      var sucStatus = false;
      var status = model.get('status');

      model.set('todelete', false) ;
      model.set('created_at_short', model.get('created_at').getDate() + "/" + (model.get('created_at').getMonth() + 1) + " " +  + model.get('created_at').getHours() + ":" +  + model.get('created_at').getMinutes()) ;

      if (status < 1) {
        textStatus = 'SETUP'; 
        warnStatus = true;
        //if status is negative => setup in progress
        model.set('timeStatus', -parseInt(status)); 
        setTimeout(this.getStatus(model), 1500); 
      }
      if (status > 1) { textStatus = 'RUNNING'; sucStatus = true; model.set('timeStatus', (status)); }
      if (status == 1) { textStatus = 'ERROR'; dangStatus = true; }

      model.set('textStatus', textStatus);
      model.set('sucStatus', sucStatus);
      model.set('warnStatus', warnStatus);
      model.set('dangStatus', dangStatus);

      return model ;
  }),

  getStatus: function(model) {
    $.get("/api/v1/vms/" + model.get('id') + "/setupcomplete")
        .done(function(data) {
          model.set('status', data);
          model.set('timeStatus', data);
          model.set('textStatus', 'RUNNING');
          model.set('sucStatus', true);
          model.set('warnStatus', false);
        })
        .fail(function(data) {
          model.set('status', data.responseText);
          model.set('timeStatus', -parseInt(data.responseText));
        })
  },

  // Check if current user is admin
  isAdmin: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel') ;

    if (access_level == 50) return true ;
    return false ;
  }.property('App.AuthManager.apiKey'),

  // Check if current user at least a dev
  isDev: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel') ;

    if (access_level >= 30) return true ;
    return false ;
  }.property('App.AuthManager.apiKey'),

  // Check if current user is admin
  isLead: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel') ;

    if (access_level >= 40) return true ;
    return false ;
  }.property('App.AuthManager.apiKey'),

  // Check if current user can launch vm
  isVm: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel') ;

    if (access_level >= 20) return true ;
    return false ;
  }.property('App.AuthManager.apiKey'),

  // actions binding with user event
  actions: {
    // ajax call to get current status
    checkStatus: function(model) {
      var vm_id = model.get('id') ;
      //loader for display an action on the screen
      $('#waitingModal').modal();

      // jquery get setupcomplete
      $.get("/api/v1/vms/" + vm_id + "/setupcomplete")
        .done(function(data) {
          model.set('status', data);
          model.set('timeStatus', data);
          model.set('textStatus', 'RUNNING');
          model.set('sucStatus', true);
          model.set('warnStatus', false);
        })
        .fail(function(data) {
          model.set('status', data.responseText);
          model.set('timeStatus', -parseInt(data.responseText));
        })
        .always(function() {
          setTimeout($('#waitingModal').modal('hide'), 2000);
        });
    },

    // action to show vm uri into popin modal
    showUri: function(uri, login, password, technos, framework, sucstatus, floating_ip, systemimage, sizing) {
      var authcredentials = '';
      var linepmtools = '';
      var linesystem = '';
      var linejs = '';
      var modal = $('#textModal');
      var access_level = App.AuthManager.get('apiKey.accessLevel') ;
      
      if (!sucstatus) {
        modal.find('.modal-title').text('Please try again later');
        modal.find('.modal-body').html("<b>Vm is not on running status.</b>") ;
        modal.modal();
        return
      }

      // system details are displaying only for at least dev user
      if (access_level >= 30) {
        linesystem = '<b>System</b><br>' + 'Image: ' + systemimage + 
        '<br>Sizing: ' + sizing + 
        '<br>Ssh access: ssh modem@' + floating_ip + '<br><br>';
      }

      if (login && login != '') {
        modal.find('.modal-title').text('Urls & Tools');
        // system details are displaying only for at least dev user
        if (access_level >= 30) {
          modal.find('.modal-title').text('System & Urls & Tools');
        }

        authcredentials = login + ':' + password + '@';
        linepmtools = '<br><b>Tools</b><br>' +
        '<a href="http://' + authcredentials + uri + '/pm_tools/gitsync/" target="_blank">Gitpull</a><br/>' +
        '<a href="http://' + authcredentials + uri + '/pm_tools/phpmyadmin/" target="_blank">Phpmyadmin (s_bdd/s_bdd)</a><br/>' +
        '<a href="http://' + authcredentials + uri + '/pm_tools/tail/" target="_blank">Apache logs</a><br/>' +
        '<a href="http://' + authcredentials + uri + '/pm_tools/pminfo/" target="_blank">Phpinfo</a><br/>' +
        '<a href="http://' + authcredentials + uri + '/pm_tools/clearvarnish/" target="_blank">Flush varnish Cache</a><br/>';
        if (framework == 'Symfony2') {
          linepmtools = linepmtools + '<a href="http://' + authcredentials + uri + '/pm_tools/composerinstall/" target="_blank">Composer Install</a><br/>' +
          '<a href="http://' + authcredentials + uri + '/pm_tools/sf2/" target="_blank">Sf2 commands: cc, assets, assetic, updb</a><br/>' +
          '<a href="http://' + authcredentials + uri + '/pm_tools/tailsf2/" target="_blank">Sf2 logs</a><br/>';
        }
      } else {
        modal.find('.modal-title').text('Urls');
        // system details are displaying only for at least dev user
        if (access_level >= 30) {
          modal.find('.modal-title').text('System & Urls');
        }
      }

      if (technos.findBy('name', 'nodejs')) {
         linejs = '<a href="http://' + authcredentials + 'nodejs.' + uri + '" target="_blank">nodejs.'+ uri + '</a><br/>';
      }

      modal.find('.modal-body').html(
        linesystem +
        '<b>URIS</b><br><a href="http://' + authcredentials + uri + '" target="_blank">'+ uri + '</a><br/>' +
        '<a href="http://' + authcredentials + 'admin.' + uri + '" target="_blank">admin.'+ uri + '</a><br/>' +
        '<a href="http://' + authcredentials + 'm.' + uri + '" target="_blank">m.'+ uri + '</a><br/>' + 
        linejs +
        linepmtools
        );

      modal.modal();
    },

    // action for delete event
    deleteItems: function() {
      var router = this.get('target');
      var vms = this.get('model.[]') ;
      var items = this.filterProperty('todelete', true) ;

      items.forEach(function(model) {
        model.destroyRecord() ;
        vms.removeObject(model) ;
      }) ;

      this.set('isShowingDeleteConfirmation', false) ;
      this.set('isAllDelete', false) ;
      router.transitionTo('vms.list');
    },

    // Change hide/show for delete confirmation
    showDeleteConfirmation: function() {
      this.toggleProperty('isShowingDeleteConfirmation') ;
    },

    // Action for add a new item, change current page to create form
    newItem: function() {
      var router = this.get('target');
      router.transitionTo('vms.new');
    },

    // Toggle or untoggle all items
    toggleDeleteAll: function() {
      if (this.get('isAllDelete')) this.set('isAllDelete', false) ;
      else this.set('isAllDelete', true) ;
      this.setEach('todelete', this.get('isAllDelete'));
    },
  }
});

module.exports = VmsListController;
