import Ember from 'ember';

export default Ember.Component.extend({
  uriFocused: false,
  loadingModal: false,
    // trigger function when model changes
  didReceiveAttrs() {
    this.set('loadingModal', false);
    this.set('uriFocused', false);
    this.formIsValid();
  },

  // manage popin / vm form display
  colSmLeft: function() {
    if (this.get('isPopin')) {
      return 'col-md-2 col-sm-3 col-xs-4';
    }
    else {
      return 'col-md-1 col-sm-2 col-xs-2';
    }
  }.property('isPopin'),

  colSmRight: function() {
    if (this.get('isPopin')) {
      return 'col-md-5 col-sm-6 col-xs-6';
    }
    else {
      return 'col-md-3 col-sm-5 col-xs-6';
    }
  }.property('isPopin'),

  colSmOffsetSubmit: function() {
    if (this.get('isPopin')) {
      return 'col-md-offset-3 col-sm-offset-3 col-xs-offset-4';
    }
    else {
      return 'col-md-offset-2 col-sm-offset-2 col-xs-offset-3';
    }
  }.property('isPopin'),

  // return true if local nextdeploy install
  isLocal: function() {
    var vm_name = this.get('vm.name');
    return vm_name.match(/os\.nextdeploy$/);
  }.property('vm.name'),

  // ensure absolute attribute is not empty
  checkAbsolute: function() {
    var absolute = '';
    var errorAbsolute = false;
    var aliases = [];
    var ep_path = this.get('uri.path');

    if (this.get('uri.aliases')) {
      aliases = this.get('uri.aliases').split(' ');
    }

    if (this.get('uri.absolute')) {
      // normalize absolute field
      this.set('uri.absolute', this.get('uri.absolute').toLowerCase());
      this.set('uri.absolute', this.get('uri.absolute').replace(/http:/g,'').replace(/https:/g,'').replace(/\//g,''));
      this.set('uri.absolute', this.get('uri.absolute').replace(/[^a-z0-9\.-]/g,''));
      absolute = this.get('uri.absolute');
    }

    aliases.forEach(function (alias) {
      if (absolute === alias) {
        errorAbsolute = true;
      }
    });

    // Ensure absolute is uniq
    this.get('vm').get('uris').forEach(function(ep) {
      if (ep.get('path') !== ep_path) {
        if (ep.get('aliases')) {
          aliases = ep.get('aliases').split(' ');
        } else {
          aliases = [];
        }

        if (ep.get('absolute') === absolute) {
          errorAbsolute = true;
        }

        aliases.forEach(function (alias) {
          if (alias === absolute) {
            errorAbsolute = true;
          }
        });
      }
    });

    this.set('errorAbsolute', errorAbsolute);
  }.observes('uri.absolute'),

  // ensure aliases attribute is not empty
  checkAliases: function() {
    var absolute = '';
    var errorAliases = false;
    var aliases = [];
    var aliases2 = [];
    var ep_path = this.get('uri.path');

    if (this.get('uri.aliases')) {
      // normalize absolute field
      this.set('uri.aliases', this.get('uri.aliases').toLowerCase().replace(/\n/, ' '));
      this.set('uri.aliases', this.get('uri.aliases').replace(/http:/g,'').replace(/https:/g,'').replace(/\//g,''));
      this.set('uri.aliases', this.get('uri.aliases').replace(/[^ a-z0-9\.-]/g,''));
      aliases = this.get('uri.aliases').split(" ");
    }
    absolute = this.get('uri.absolute');

    if (!aliases) {
      return;
    }

    aliases.forEach(function (alias) {
      if (absolute === alias) {
        errorAliases = true;
      }
    });

    // Ensure aliases is uniq
    this.get('vm').get('uris').forEach(function(ep) {
      if (ep.get('path') !== ep_path) {
        if (ep.get('aliases')) {
          aliases2 = ep.get('aliases').split(' ');
        } else {
          aliases2 = [];
        }

        aliases.forEach(function (alias) {
          if (ep.get('absolute') === alias) {
            errorAliases = true;
          }

          aliases2.forEach(function (alias2) {
            if (alias === alias2) {
              errorAliases = true;
            }
          });
        });
      }
    });

    this.set('errorAliases', errorAliases);
  }.observes('uri.aliases'),

    // normalize ipfilter field
  checkIpfilter: function() {
    if (this.get('uri.ipfilter') && this.get('uri.ipfilter') !== '') {
      this.set('uri.ipfilter', this.get('uri.ipfilter').replace(/,/g,' '));
      this.set('uri.ipfilter', this.get('uri.ipfilter').replace(/\n/g,' '));
      this.set('uri.ipfilter', this.get('uri.ipfilter').replace(/  /g,' '));
      this.set('uri.ipfilter', this.get('uri.ipfilter').replace(/\.[0-9]+\/[0-9]+/g, '.0/24'));
      this.set('uri.ipfilter', this.get('uri.ipfilter').replace(/[^ 0-9\./]/g,''));
      this.set('uri.ipfilter', this.get('uri.ipfilter').replace(/ $/g,''));
      this.set('uri.ipfilter', this.get('uri.ipfilter').replace(/^ /g,''));
    }
  }.observes('uri.ipfilter'),

  // normalize port field and ensure not empty
  checkPort: function() {
    if (this.get('uri.port')) {
      this.set('uri.port', this.get('uri.port').replace(/[^0-9]/g,''));
    }

    if (this.get('uri.port') && this.get('uri.port').length) {
      this.set('errorPort', false);
    } else {
      this.set('errorPort', true);
    }
  }.observes('uri.port'),

  //check form before submit
  formIsValid: function() {
    var uri_path = this.get('uri.path');

    this.checkAbsolute();
    this.checkAliases();
    this.checkIpfilter();
    this.checkPort();

    if (!this.get('errorAbsolute') &&
        !this.get('errorAliases') &&
        !this.get('errorPort')) {
      this.get('checkListUris').set(uri_path, false);
      return true;
    }

    this.get('checkListUris').set(uri_path, true);
    return false;
  },

  actions: {
    // change is_sh flag
    toggleShFlag: function(toggle) {
      this.set('uri.is_sh', toggle.newValue);
      this.set('uriFocused', true);
    },

    toggleSslFlag: function(disabled, toggle) {
      if (disabled) {
        return;
      }

      this.set('uriFocused', true);
      this.set('uri.is_ssl', toggle.newValue);
    },

    // change is_redirect flag
    toggleRedirectFlag: function(toggle) {
      this.set('uri.is_redir_alias', toggle.newValue);
      this.set('uriFocused', true);
    },

    // set focused flag to true
    displayFocus: function() {
      this.set('uriFocused', true);
    },

    // insert or update current brand object
    postItem: function() {
      var router = this.get('router');
      var self = this;

      // check if form is valid
      if (!this.formIsValid()) {
        return;
      }

      // redirect if success
      var pass = function(){
        self.set('loadingModal', false);
      };

      // error modal if issue occurs
      var fail = function(){
        self.set('loadingModal', false);
        router.transitionTo('error');
      };

      // loading modal and server request for update object
      self.set('loadingModal', true);
      this.get('uri').save().then(pass, fail);
    },
  }
});
