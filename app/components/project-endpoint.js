import Ember from 'ember';

export default Ember.Component.extend({
  errorFramework: false,
  errorPrefix: false,
  errorAliases: false,
  errorPort: false,

  // trigger function when model changes
  didReceiveAttrs() {
    this._super(...arguments);

    // init an endpoint object if needed
    if (!this.get('endpoint') || !this.get('endpoint.project.brand')) {
      this.set('endpoint', Ember.Object.create(
                              { prefix: '', path: '', aliases: '', envvars: '', framework: null,
                                port: '8080', ipfilter: '', is_install: true, is_sh: false,
                                is_import: true, customvhost: '' }));

      if (this.get('project.id')) {
        this.get('endpoint').set('is_install', false);
      }
    }

    this.formIsValid();
  },

  // ensure framework attribute is not empty
  checkFramework: function() {
    var framework = this.get('endpoint.framework.id');
    var errorFramework = false;

    if (!framework) {
      errorFramework = true;
      this.set('endpoint.port', '');
      this.set('endpoint.envvars', '');
    }

    this.set('errorFramework', errorFramework);
  },

  // ensure framework attribute is not empty
  changeFramework: function() {
    var frameworkName = this.get('endpoint.framework.name');
    var errorFramework = false;

    if (!frameworkName) {
      return;
    }

    if (!this.get('endpoint.id')) {
      // set default values for port and envvars
      this.set('endpoint.port', 8080);
      this.set('endpoint.envvars', '');
      if (frameworkName.match(/NodeJS/) ||
        frameworkName.match(/ReactJS/)) {

        this.set('endpoint.port', 3100);
        this.set('endpoint.envvars', 'PORT=3100');
        if (frameworkName.match(/ReactJS/)) {
          this.set('endpoint.envvars', 'PORT=3100 NODE_PATH=./src');
        }
      }
    }

    this.set('errorFramework', errorFramework);
  }.observes('endpoint.framework'),

  // ensure prefix attribute is not empty
  checkPrefix: function() {
    var prefix = '';
    var errorPrefix = false;
    var aliases = [];
    var ep_id = this.get('endpoint.id');

    if (this.get('endpoint.aliases')) {
      aliases = this.get('endpoint.aliases').split(' ');
    }

    if (this.get('endpoint.prefix')) {
      // normalize prefix field
      this.set('endpoint.prefix', this.get('endpoint.prefix').toLowerCase().replace(/_/g,'').replace(/ /g,''));
      prefix = this.get('endpoint.prefix');
    }

    aliases.forEach(function (alias) {
      if (prefix === alias) {
        errorPrefix = true;
      }
    });

    // Ensure prefix is uniq
    this.get('project').get('endpoints').forEach(function(ep) {
      if (ep.get('id') !== ep_id) {
        if (ep.get('aliases')) {
          aliases = ep.get('aliases').split(' ');
        } else {
          aliases = [];
        }

        if (ep.get('prefix') === prefix) {
          errorPrefix = true;
        }

        aliases.forEach(function (alias) {
          if (alias === prefix) {
            errorPrefix = true;
          }
        });
      }
    });

    this.set('errorPrefix', errorPrefix);
  }.observes('endpoint.prefix'),

  // ensure path attribute is not empty
  checkPath: function() {
    var path = '';
    var errorPath = false;
    var ep_id = this.get('endpoint.id');

    // normalize prefix field
    if (this.get('endpoint.path')) {
      this.set('endpoint.path', this.get('endpoint.path').toLowerCase().replace(/ /g,''));
      path = this.get('endpoint.path');
    }

    if (!path) {
      errorPath = true;
    }

    // Ensure prefix is uniq
    this.get('project').get('endpoints').forEach(function(ep) {
      if (ep.get('id') !== ep_id && ep.get('path') === path) {
        errorPath = true;
      }
    });

    this.set('errorPath', errorPath);
  }.observes('endpoint.path'),


  // ensure aliases attribute is not empty
  checkAliases: function() {
    var prefix = '';
    var errorAliases = false;
    var aliases = [];
    var aliases2 = [];
    var ep_id = this.get('endpoint.id');

    if (this.get('endpoint.aliases')) {
    // normalize prefix field
      this.set('endpoint.aliases', this.get('endpoint.aliases').toLowerCase().replace(/_/g,''));
      aliases = this.get('endpoint.aliases').split(" ");
    }
    prefix = this.get('endpoint.prefix');

    if (!aliases) {
      return;
    }

    aliases.forEach(function (alias) {
      if (prefix === alias) {
        errorAliases = true;
      }
    });

    // Ensure aliases is uniq
    this.get('project').get('endpoints').forEach(function(ep) {
      if (ep.get('id') !== ep_id) {
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

    this.set('errorAliases', errorAliases);
  }.observes('endpoint.aliases'),

  // normalize ipfilter field
  checkIpfilter: function() {
    if (this.get('endpoint.ipfilter') && this.get('endpoint.ipfilter') !== '') {
      this.set('endpoint.ipfilter', this.get('endpoint.ipfilter').replace(/,/g,' '));
      this.set('endpoint.ipfilter', this.get('endpoint.ipfilter').replace(/\n/g,' '));
      this.set('endpoint.ipfilter', this.get('endpoint.ipfilter').replace(/\.[0-9]+\/[0-9]+/g, '.0/24'));
      this.set('endpoint.ipfilter', this.get('endpoint.ipfilter').replace(/[^ 0-9\./]/g,''));
    }
  }.observes('endpoint.ipfilter'),

  // normalize port field and ensure not empty
  checkPort: function() {
    if (this.get('endpoint.port')) {
      this.set('endpoint.port', ('' + this.get('endpoint.port')).replace(/[^0-9]/g,''));
    }

    if (this.get('endpoint.port') && this.get('endpoint.port').length) {
      this.set('errorPort', false);
    } else {
      this.set('errorPort', true);
    }
  }.observes('endpoint.port'),

  //check form before submit
  formIsValid: function() {
    this.checkFramework();
    this.checkPrefix();
    this.checkPath();
    this.checkAliases();
    this.checkPort();
    this.checkIpfilter();

    if (!this.get('errorFramework') &&
        !this.get('errorPrefix') &&
        !this.get('errorPath') &&
        !this.get('errorPort') &&
        !this.get('errorAliases')) { return true; }
    return false;
  },

  addEndpointOnSubmitProject: function() {
    var ep = this.get('endpoint');
    var endpoint = null;
    var is_main = false;

    // check if form is valid
    if (!this.get('projectSave') || !this.formIsValid() || ep.get('id')) {
      return;
    }

    // main is the first
    if (this.get('project').get('endpoints').toArray().length === 0) {
      is_main = true;
    }

    endpoint = this.store.createRecord('endpoint', { framework: ep.get('framework'), prefix: ep.get('prefix'),
                                                     path: ep.get('path'), envvars: ep.get('envvars'), aliases: ep.get('aliases'),
                                                     port: ep.get('port'), ipfilter: ep.get('ipfilter'), is_install: ep.get('is_install'),
                                                     is_sh: ep.get('is_sh'), is_import: ep.get('is_import'), customvhost: ep.get('customvhost'),
                                                     is_main: is_main });

    this.get('project').get('endpoints').addObject(endpoint);
  }.observes('projectSave'),

  // Check if current user is admin or edit his own project and can change properties
  isDisableCreate: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');
    var user_id = this.get('session').get('data.authenticated.user.id');

    if (access_level >= 50) { return false; }
    if (parseInt(this.get('project.owner.id')) === user_id) { return false; }
    return true;

  }.property('session.data.authenticated.user.id'),

  // Return true if user is an admin
  isAdmin: function() {
    var access_level = this.get('session').get('data.authenticated.access_level');

    if (access_level === 50) { return true; }
    return false;
  }.property('session.data.authenticated.access_level'),

  actions: {
    // change property on power-select
    changeProperty: function(property, value) {
      this.set(property, value);
    },

    toggleShFlag: function(disabled, toggle) {
      if (disabled) {
        return;
      }

      this.set('endpoint.is_sh', toggle.newValue);
    },

    toggleImportFlag: function(disabled, toggle) {
      if (disabled) {
        return;
      }

      this.set('endpoint.is_import', toggle.newValue);
    },

    addEndpoint: function() {
      var ep = this.get('endpoint');
      var endpoint = null;

      // check if form is valid
      if (!this.formIsValid()) {
        return;
      }

      endpoint = this.store.createRecord('endpoint',
                              { framework: ep.get('framework'), prefix: ep.get('prefix'), path: ep.get('path'),
                                envvars: ep.get('envvars'), aliases: ep.get('aliases'), port: ep.get('port'),
                                ipfilter: ep.get('ipfilter'), is_install: ep.get('is_install'), is_sh: ep.get('is_sh'),
                                is_import: ep.get('is_import'), customvhost: ep.get('customvhost') });

      this.get('project').get('endpoints').addObject(endpoint);
      this.set('newFlag', false);
      // reinit the form
      this.didReceiveAttrs();
    },

    deleteEndpoint: function() {
      this.get('project').get('endpoints').removeObject(this.get('endpoint'));
      if (this.get('project.id')) { this.get('endpoint').destroyRecord(); }
    }
  }
});
