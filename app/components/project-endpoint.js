import Ember from 'ember';

/**
 *  This component manages the project endpoint form
 *
 *  @module components/project-endpoint
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Set some default value when framework is setted
     *
     *  @function
     */
    changeFramework: function(value) {
      var frameworkName = '';

      this.set('endpoint.framework', value);
      frameworkName = this.get('endpoint.framework.name');

      if (!frameworkName) {
        return;
      }

      if (!this.get('endpoint.id')) {
        // set default values for port and envvars
        this.set('endpoint.port', 8080);
        this.set('endpoint.envvars', '');

        // HACK change values with framework name test (a dynamic value from api)
        if (frameworkName.match(/NodeJS/) ||
          frameworkName.match(/ReactJS/)) {

          this.set('endpoint.port', 3100);
          this.set('endpoint.envvars', 'PORT=3100');
          if (frameworkName.match(/ReactJS/)) {
            this.set('endpoint.envvars', 'PORT=3100 NODE_PATH=./src');
          }
        }
      }
    },

    /**
     *  Normalize ipfilter attribute
     *
     *  @function
     */
    checkIpfilter: function() {
      var ipFilter = this.get('endpoint.ipfilter');
      var self = this;

      if (ipFilter && ipFilter !== '') {
        ipFilter = ipFilter.replace(/(,|\n)/g, ' ');
        ipFilter = ipFilter.replace(/\.[0-9]+\/[0-9]+/g, '.0/24');
        ipFilter = ipFilter.replace(/[^ 0-9\./]/g, '');

        if (this.get('endpoint.ipfilter') !== ipFilter) {
          Ember.run.once(function() {
            self.set('endpoint.ipfilter', ipFilter);
          });
        }
      }
    },

    /**
     *  Update is_sh flag
     *
     *  @function
     */
    toggleShFlag: function(disabled, toggle) {
      if (disabled) {
        return;
      }

      this.set('endpoint.is_sh', toggle.newValue);
    },

    /**
     *  Update is_ssl flag
     *
     *  @function
     */
    toggleSslFlag: function(disabled, toggle) {
      if (disabled) {
        return;
      }

      this.set('endpoint.is_ssl', toggle.newValue);
    },

    /**
     *  Update is_import flag
     *
     *  @function
     */
    toggleImportFlag: function(disabled, toggle) {
      if (disabled) {
        return;
      }

      this.set('endpoint.is_import', toggle.newValue);
    },

    /**
     *  Submit the form: creates a new EndPoint
     *
     *  @function
     */
    addEndpoint: function() {
      var ep = this.get('endpoint');
      var endpoint = null;

      // check if form is valid
      if (!this.formIsValid()) {
        return;
      }

      endpoint =
        this.store.createRecord(
          'endpoint',
          {
            framework: ep.get('framework'), prefix: ep.get('prefix'),
            path: ep.get('path'), envvars: ep.get('envvars'),
            aliases: ep.get('aliases'), port: ep.get('port'),
            ipfilter: ep.get('ipfilter'), is_install: ep.get('is_install'),
            is_sh: ep.get('is_sh'), is_import: ep.get('is_import'),
            is_ssl: ep.get('is_ssl'), customvhost: ep.get('customvhost')
          }
        );

      this.get('project').get('endpoints').addObject(endpoint);
      this.set('newFlag', false);
      // reinit the form
      this.didReceiveAttrs();
    },

    /**
     *  Delete current endpoint
     *
     *  @function
     */
    deleteEndpoint: function() {
      this.get('project').get('endpoints').removeObject(this.get('endpoint'));
      if (this.get('project.id')) { this.get('endpoint').destroyRecord(); }
    }
  },

  /**
   *  Return true if local nextdeploy install
   *  In local install, ssl endpoints are forbidden
   *
   *  @function
   *  @returns {Boolean} true if local install (or endpoint already exists)
   */
  isLocal: function() {
    // HACK verify a local install from the WebUI URI
    return this.get('isExist') || document.URL.match(/nextdeploy.local/);
  }.property('isExist'),

  /**
   *  Test if current user is admin or edit his own project and can make changes
   *
   *  @function
   *  @returns {Boolean} true if cant make changes
   */
  isDisableCreate: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var user_id = this.get('session').get('data.authenticated.user.id');

    if (access_level >= 50) { return false; }
    if (parseInt(this.get('project.owner.id')) === user_id) { return false; }
    return true;

  }.property('session.data.authenticated.user.id'),

  /**
   *  Check if current user is admin
   *
   *  @function
   *  @returns {Boolean} True if admin
   */
  isAdmin: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level === 50) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  /**
   *  Ensure framework is filled
   *
   *  @function
   *  @returns {Boolean} true if no valid field
   */
  errorFramework: function() {
    var framework = this.get('endpoint.framework.id');
    var errorFramework = false;

    if (!framework) {
      errorFramework = true;
      this.set('endpoint.port', '');
      this.set('endpoint.envvars', '');
    }

    return errorFramework;
  }.property('endpoint.framework'),

  /**
   *  Ensure prefix attribute is valid
   *    - not empty
   *    - normalize it
   *    - is unique
   *
   *  @function
   *  @returns {Boolean} true if no valid field
   */
  errorPrefix: function() {
    var errorPrefix = false;
    var aliases = [];
    var epId = this.get('endpoint.id');
    var epPrefix = this.get('endpoint.prefix');
    var self = this;

    if (this.get('endpoint.aliases')) {
      aliases = this.get('endpoint.aliases').split(' ');
    }

    if (epPrefix) {
      // normalize prefix field
      epPrefix = epPrefix.toLowerCase();
      epPrefix = epPrefix.replace(/( |_|\/)/g,'');
      epPrefix = epPrefix.replace(/\./g,'-');
    }

    if (this.get('endpoint.prefix') !== epPrefix) {
      Ember.run.once(function() {
        self.set('endpoint.prefix', epPrefix);
      });
    }

    aliases.forEach(function (alias) {
      if (epPrefix === alias) {
        errorPrefix = true;
      }
    });

    // Ensure prefix is unique
    this.get('project').get('endpoints').forEach(function(ep) {
      if (ep.get('id') !== epId) {
        if (ep.get('aliases')) {
          aliases = ep.get('aliases').split(' ');
        } else {
          aliases = [];
        }

        if (ep.get('prefix') === epPrefix) {
          errorPrefix = true;
        }

        aliases.forEach(function (alias) {
          if (alias === epPrefix) {
            errorPrefix = true;
          }
        });
      }
    });

    return errorPrefix;
  }.property('endpoint.prefix'),

  /**
   *  Ensure path attribute is valid
   *    - not empty
   *    - normalize it
   *    - is unique
   *
   *  @function
   *  @returns {Boolean} true if no valid field
   */
  errorPath: function() {
    var errorPath = false;
    var epId = this.get('endpoint.id');
    var epPath = this.get('endpoint.path');
    var self = this;

    if (epPath) {
      // normalize
      epPath = epPath.toLowerCase();
      epPath = epPath.replace(/( |\/)/g, '');
    }

    if (this.get('endpoint.path') !== epPath) {
      Ember.run.once(function() {
        self.set('endpoint.path', epPath);
      });
    }

    if (!epPath) {
      errorPath = true;
    }

    // Ensure path is unique
    this.get('project').get('endpoints').forEach(function(ep) {
      if (ep.get('id') !== epId && ep.get('path') === epPath) {
        errorPath = true;
      }
    });

    return errorPath;
  }.property('endpoint.path'),


  /**
   *  Ensure aliases attribute is valid
   *    - not empty
   *    - normalize it
   *    - is unique
   *
   *  @function
   *  @returns {Boolean} true if no valid field
   */
  errorAliases: function() {
    var prefix = '';
    var errorAliases = false;
    var aliases = [];
    var aliases2 = [];
    var epId = this.get('endpoint.id');
    var epAliases = this.get('endpoint.aliases');
    var self = this;

    if (epAliases) {
      // normalize
      epAliases = epAliases.toLowerCase();
      epAliases = epAliases.replace(/(_|\/)/g, '');
      epAliases = epAliases.replace(/\./g, '-');

      if (this.get('endpoint.aliases') !== epAliases) {
        Ember.run.once(function() {
          self.set('endpoint.aliases', epAliases);
        });
      }

      aliases = this.get('endpoint.aliases').split(" ");
    }

    if (!aliases) {
      return;
    }

    // Ensure aliases is different than prefix
    prefix = this.get('endpoint.prefix');
    aliases.forEach(function (alias) {
      if (prefix === alias) {
        errorAliases = true;
      }
    });

    // Ensure aliases is uniq
    this.get('project').get('endpoints').forEach(function(ep) {
      if (ep.get('id') !== epId) {
        if (ep.get('aliases')) {
          aliases2 = ep.get('aliases').split(' ');
        } else {
          aliases2 = [];
        }

        aliases.forEach(function (alias) {
          if (ep.get('prefix') === alias) {
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
  }.property('endpoint.aliases'),

  /**
   *  Ensure port attribute is valid
   *    - not empty
   *    - normalize it
   *
   *  @function
   *  @returns {Boolean} true if no valid field
   */
  errorPort: function() {
    var epPort = this.get('endpoint.port');
    var self = this;

    // normalize
    if (epPort) {
      epPort = ('' + epPort).replace(/[^0-9]/g, '');
    }

    if (this.get('endpoint.port') !== epPort) {
      Ember.run.once(function() {
        self.set('endpoint.port', epPort);
      });
    }

    if (epPort && epPort !== '') {
      return false;
    }

    return true;
  }.property('endpoint.port'),

  /**
   *  Triggered when the project parent form is submitted
   *
   *  @function
   */
  addEndpointOnSubmitProject: function() {
    var ep = this.get('endpoint');
    var endpoint = null;
    var isMain = false;

    // check if form is valid
    if (!this.get('projectSave') || !this.formIsValid() || ep.get('id')) {
      return;
    }

    // main is the first
    if (this.get('project').get('endpoints').toArray().length === 0) {
      isMain = true;
    }

    endpoint =
      this.store.createRecord(
        'endpoint',
        {
          framework: ep.get('framework'), prefix: ep.get('prefix'),
          path: ep.get('path'), envvars: ep.get('envvars'),
          aliases: ep.get('aliases'), port: ep.get('port'),
          ipfilter: ep.get('ipfilter'), is_install: ep.get('is_install'),
          is_sh: ep.get('is_sh'), is_import: ep.get('is_import'),
          is_ssl: ep.get('is_ssl'), customvhost: ep.get('customvhost'),
          is_main: isMain
        }
      );

    this.get('project').get('endpoints').addObject(endpoint);
  }.observes('projectSave'),

  /**
   *  Trigger when receives models
   *
   *  @function
   */
  didReceiveAttrs() {
    this._super(...arguments);

    // init an endpoint object if null
    if (!this.get('endpoint') || !this.get('endpoint.project.brand')) {
      this.set('endpoint',
        Ember.Object.create(
          { prefix: '', path: '', aliases: '', envvars: '', framework: null,
            port: '8080', ipfilter: '', is_install: true, is_sh: false,
            is_import: true, is_ssl: false, customvhost: '' }
        )
      );

      if (this.get('project.id')) {
        this.get('endpoint').set('is_install', false);
      }
    }

    this.formIsValid();
  },

  /**
   *  Ensures all form fields are valids before submit
   *
   *  @function
   */
  formIsValid: function() {
    if (!this.get('errorFramework') &&
        !this.get('errorPrefix') &&
        !this.get('errorPath') &&
        !this.get('errorPort') &&
        !this.get('errorAliases')) { return true; }
    return false;
  }
});
