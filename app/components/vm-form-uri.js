import Ember from 'ember';

/**
 *  This component manages vm uris form modal
 *
 *  @module components/vm-form-uri
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Normalize ipfilter attribute
     *
     *  @function
     */
    checkIpfilter: function() {
      var ipFilter = this.get('uri.ipfilter');
      var self = this;

      if (ipFilter && ipFilter !== '') {
        ipFilter = ipFilter.replace(/(,|\n|[ ]{2})/g, ' ');
        ipFilter = ipFilter.replace(/\.[0-9]+\/[0-9]+/g, '.0/24');
        ipFilter = ipFilter.replace(/([^ 0-9\./]| $|^ )/g, '');

        if (this.get('uri.ipfilter') !== ipFilter) {
          Ember.run.once(function() {
            self.set('uri.ipfilter', ipFilter);
          });
        }
      }
    },

    /**
     *  Update is_sh flag
     *
     *  @function
     */
    toggleShFlag: function(toggle) {
      this.set('uri.is_sh', toggle.newValue);
      this.set('uriFocused', true);
    },

    /**
     *  Update is_ssl flag
     *
     *  @function
     */
    toggleSslFlag: function(toggle) {
      this.set('uri.is_ssl', toggle.newValue);
      this.set('uriFocused', true);
    },

    /**
     *  Update is_redir_alias flag
     *
     *  @function
     */
    toggleRedirectFlag: function(toggle) {
      this.set('uri.is_redir_alias', toggle.newValue);
      this.set('uriFocused', true);
    },

    /**
     *  Set focused flag to true
     *
     *  @function
     */
    displayFocus: function() {
      this.set('uriFocused', true);
    },

    /**
     *  Submit form for create or update current object
     *
     *  @function
     */
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
  },

  /**
   *  Flag to display some extra fields
   *
   *  @type {Boolean}
   */
  uriFocused: false,

  /**
   *  Flag to show loading modal
   *
   *  @type {Boolean}
   */
  loadingModal: false,

  /**
   *  Manage bootstrap classnames for modal or vm form display
   *
   *  @function
   */
  colSmLeft: function() {
    if (this.get('isPopin')) {
      return 'col-md-2 col-sm-3 col-xs-4';
    }
    else {
      return 'col-md-1 col-sm-2 col-xs-2';
    }
  }.property('isPopin'),

  /**
   *  Manage bootstrap classnames for modal or vm form display
   *
   *  @function
   */
  colSmRight: function() {
    if (this.get('isPopin')) {
      return 'col-md-5 col-sm-6 col-xs-6';
    }
    else {
      return 'col-md-3 col-sm-5 col-xs-6';
    }
  }.property('isPopin'),

  /**
   *  Manage bootstrap classnames for modal or vm form display
   *
   *  @function
   */
  colSmOffsetSubmit: function() {
    if (this.get('isPopin')) {
      return 'col-md-offset-3 col-sm-offset-3 col-xs-offset-4';
    }
    else {
      return 'col-md-offset-2 col-sm-offset-2 col-xs-offset-3';
    }
  }.property('isPopin'),

  /**
   *  Return true if local nextdeploy install
   *  In local install, ssl endpoints are forbidden
   *
   *  @function
   *  @returns {Boolean} true if local install (or endpoint already exists)
   */
  isLocal: function() {
    var vm_name = this.get('vm.name');
    // HACK verify a local install from the vm name
    return vm_name.match(/os\.nextdeploy$/);
  }.property('vm.name'),

  /**
   *  Ensure absolute attribute is filled and normalized
   *
   *  @function
   *  @returns {Boolean} true if no valid field
   */
  errorAbsolute: function() {
    var errorAbsolute = false;
    var aliases = [];
    var path = this.get('uri.path');
    var absolute = this.get('uri.absolute');
    var self = this;

    if (this.get('uri.aliases')) {
      aliases = this.get('uri.aliases').split(' ');
    }

    if (absolute) {
      // normalize absolute field
      absolute = absolute.toLowerCase();
      absolute = absolute.replace(/(http|https):/g,'').replace(/\//g,'');
      absolute = absolute.replace(/[^a-z0-9\.-]/g,'');
    }

    if (this.get('uri.absolute') !== absolute) {
      Ember.run.once(function() {
        self.set('uri.absolute', absolute);
      });
    }

    aliases.forEach(function (alias) {
      if (absolute === alias) {
        errorAbsolute = true;
      }
    });

    // Ensure absolute is uniq
    this.get('vm').get('uris').forEach(function(ep) {
      if (ep.get('path') !== path) {
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

    return errorAbsolute;
  }.property('uri.absolute'),

  /**
   *  Ensure aliases attribute is filled and normalized
   *
   *  @function
   *  @returns {Boolean} true if no valid field
   */
  errorAliases: function() {
    var absolute = '';
    var errorAliases = false;
    var aliasesLine = this.get('uri.aliases');
    var aliases = [];
    var aliases2 = [];
    var path = this.get('uri.path');
    var self = this;

    if (aliasesLine) {
      // normalize absolute field
      aliasesLine = aliasesLine.toLowerCase().replace(/\n/, ' ');
      aliasesLine = aliasesLine.replace(/(http|https):/g, '').replace(/\//g,'');
      aliasesLine = aliasesLine.replace(/[^ a-z0-9\.-]/g,'');
      aliases = aliasesLine.split(" ");
    }

    if (this.get('uri.aliases') !== aliasesLine) {
      Ember.run.once(function() {
        self.set('uri.aliases', aliasesLine);
      });
    }

    if (!aliases) {
      return;
    }

    absolute = this.get('uri.absolute');
    aliases.forEach(function (alias) {
      if (absolute === alias) {
        errorAliases = true;
      }
    });

    // Ensure aliases is uniq
    this.get('vm').get('uris').forEach(function(ep) {
      if (ep.get('path') !== path) {
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

    return errorAliases;
  }.property('uri.aliases'),

  /**
   *  Ensure port attribute is filled and normalized
   *
   *  @function
   *  @returns {Boolean} true if no valid field
   */
  errorPort: function() {
    if (this.get('uri.port')) {
      this.set('uri.port', this.get('uri.port').replace(/[^0-9]/g,''));
    }

    if (this.get('uri.port') && this.get('uri.port').length) {
      this.set('errorPort', false);
    } else {
      this.set('errorPort', true);
    }
  }.property('uri.port'),

  /**
   *  Ensures all form fields are valids before submit
   *
   *  @function
   */
  formIsValid: function() {
    var uri_path = this.get('uri.path');

    if (!this.get('errorAbsolute') &&
        !this.get('errorAliases') &&
        !this.get('errorPort')) {
      this.get('checkListUris').set(uri_path, false);
      return true;
    }

    this.get('checkListUris').set(uri_path, true);
    return false;
  },

  /**
   *  Trigger when receives models
   *
   *  @function
   */
  didReceiveAttrs() {
    this.set('loadingModal', false);
    this.set('uriFocused', false);
    this.formIsValid();
  }
});
