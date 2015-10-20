// Ember controller for list vm into html array
var VmsListController = Ember.ArrayController.extend({
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
          model.set('dangStatus', false);
        })
        .fail(function(data) {
          model.set('status', data.responseText);
          model.set('timeStatus', -parseInt(data.responseText));
          
          // check if error or setup
          if (parseInt(data.responseText) == 1) {
            model.set('textStatus', 'ERROR');
            model.set('sucStatus', false);
            model.set('warnStatus', false);
            model.set('dangStatus', true);
          } else {
            model.set('textStatus', 'SETUP');
            model.set('sucStatus', false);
            model.set('warnStatus', true);
            model.set('dangStatus', false);
          }
        })
        .always(function() {
          setTimeout($('#waitingModal').modal('hide'), 2000);
        });
    },

    // action to show vm uri and tools into popin modal
    showUri: function(model) {
      var uri = model.get('name');
      var login = model.get('project.login');
      var password = model.get('project.password');
      var technos = model.get('project.technos');
      var framework = model.get('project.framework.name');
      var sucstatus = model.get('sucStatus');

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

      // no tools if login is empty
      if (login && login != '') {
        modal.find('.modal-title').text('Urls & Tools');
        // system details are displaying only for at least dev user
        if (access_level >= 30) {
          modal.find('.modal-title').text('System & Urls & Tools');
        }

        authcredentials = login + ':' + password + '@';
        linepmtools = '<b>Tools</b><br>' + '<a href="http://' + authcredentials + uri + '/pm_tools/gitsync/" target="_blank">Gitpull</a><br/>';
        if (technos.findBy('name', 'mysql')) {
          linepmtools = linepmtools + '<a href="http://' + authcredentials + uri + '/pm_tools/phpmyadmin/" target="_blank">Phpmyadmin (s_bdd/s_bdd)</a><br/>';
        }
        linepmtools = linepmtools + '<a href="http://' + authcredentials + uri + '/pm_tools/tail/" target="_blank">Apache logs</a><br/>' +
        '<a href="http://' + authcredentials + uri + '/pm_tools/pminfo/" target="_blank">Phpinfo</a><br/>' +
        '<a href="http://' + authcredentials + uri + '/pm_tools/clearvarnish/" target="_blank">Flush varnish Cache</a><br/>';
        if (framework == 'Symfony2') {
          linepmtools = linepmtools + '<a href="http://' + authcredentials + uri + '/pm_tools/composerinstall/" target="_blank">Composer Install</a><br/>' +
          '<a href="http://' + authcredentials + uri + '/pm_tools/sf2/" target="_blank">Sf2 commands: cc, assets, assetic, updb</a><br/>' +
          '<a href="http://' + authcredentials + uri + '/pm_tools/tailsf2/" target="_blank">Sf2 logs</a><br/>';
        }
      } else {
        modal.find('.modal-title').text('Urls');
      }

      if (technos.findBy('name', 'nodejs')) {
         linejs = '<a href="http://' + authcredentials + 'nodejs.' + uri + '" target="_blank">nodejs.'+ uri + '</a><br/>';
      }

      modal.find('.modal-body').html(
        '<b>URIS</b><br><a href="http://' + authcredentials + uri + '" target="_blank">'+ uri + '</a><br/>' +
        '<a href="http://' + authcredentials + 'admin.' + uri + '" target="_blank">admin.'+ uri + '</a><br/>' +
        '<a href="http://' + authcredentials + 'm.' + uri + '" target="_blank">m.'+ uri + '</a><br/>' + 
        linejs + '<br><b>Http Access</b> (setted by default in URIS list before)<br>Login: ' + login + '<br>Password: ' + password + '<br><br>' +
        linepmtools
        );

      modal.modal();
    },

    // action to show commit and system details
    showDetails: function(model) {
      var login = model.get('project.login');
      var password = model.get('project.password');
      var sucstatus = model.get('sucStatus');
      var floating_ip = model.get('floating_ip');
      var systemimage = model.get('systemimage.name');
      var sizing = model.get('vmsize.title') + ' (' + model.get('vmsize.description')  + ')';
      var commit_hash = model.get('commit.commit_hash');
      var commit_msg = model.get('commit.message').replace('\n', '');
      // issue whan i try to get branche object, so this ugly tip ...
      var branch = model.get('commit.id').replace(/^[0-9]+-/,'').replace(/-[a-zA-Z0-9]+$/,'');
      var author = model.get('commit.author_email');

      var linesystem = '';
      var linecommit = '';
      
      var modal = $('#textModal');
      
      if (!sucstatus) {
        modal.find('.modal-title').text('Please try again later');
        modal.find('.modal-body').html("<b>Vm is not on running status.</b>") ;
        modal.modal();
        return
      }

      linesystem = '<b>System</b><br>' + 'Image: ' + systemimage + 
        '<br>Sizing: ' + sizing + 
        '<br>Ssh access: ssh modem@' + floating_ip + 
        '<br>Htaccess: ' + login + ' / ' + password + '<br><br>';

      linecommit = '<b>Commit</b><br>' + 'Hash: ' + commit_hash +
        '<br>Branche: ' + branch +
        '<br>Author: ' + author +
        '<br>Message: ' + commit_msg + '<br>' ;

      modal.find('.modal-body').html(
        linesystem +
        linecommit);

      modal.find('.modal-title').text('Details');

      
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
