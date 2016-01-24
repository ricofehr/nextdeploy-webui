// Ember controller for create project form
var ProjectsNewController = Ember.ObjectController.extend({
  //brand combobox
  computeSorting: ['name'],
  brandsSort: Ember.computed.sort('brandlist', 'computeSorting'),
  //framework combobox
  frameworksSort: Ember.computed.sort('frameworklist', 'computeSorting'),

  //vmsizes checkboxes
  vmsizeSorting: ['title:desc'],
  vmsizesSort: Ember.computed.sort('vmsizelist', 'vmsizeSorting'),
  checkedVmsizes: Ember.computed.map('vmsizesSort', function(model){
    var checked = false;
    var readonly = false;
    var access_level = App.AuthManager.get('apiKey.accessLevel');
    var vmsizes = this.get('project_vmsizes');

    if (access_level < 50) readonly = true;

    if (vmsizes) {
      var vmsize = vmsizes.findBy('id', model.get('id'));
      if (vmsize) checked = true;
    }

    return Ember.ObjectProxy.create({
      content: model,
      checked: checked,
      readonly: readonly
    });
  }),

  //technos checkboxes
  technosSort: Ember.computed.sort('technolist', 'computeSorting'),
  checkedTechnos: Ember.computed.map('technosSort', function(model){
    var checked = false;
    var readonly = false;
    var access_level = App.AuthManager.get('apiKey.accessLevel');
    var technos = this.get('project_technos');
    var user_id = App.AuthManager.get('apiKey.user');

    if (access_level < 50 && this.get('owner').get('id') != user_id) readonly = true;

    if (technos) {
      var techno = technos.findBy('id', model.get('id'));
      if (techno) checked = true;
    }

    if (/.*varnish.*/.test(model.get('name'))) {
      checked = true;
      readonly = true;
    }

    return Ember.ObjectProxy.create({
      content: model,
      checked: checked,
      readonly: readonly
    });
  }),

  //systems checkboxes
  systemsSort: Ember.computed.sort('systemlist', 'computeSorting'),
  checkedSystems: Ember.computed.map('systemsSort', function(model){
    var checked = false;
    var readonly = false;
    var access_level = App.AuthManager.get('apiKey.accessLevel');
    var systems = this.get('project_systemimages');
    var user_id = App.AuthManager.get('apiKey.user');

    if (access_level < 50) readonly = true;

    if (systems) {
      var system = systems.findBy('id', model.get('id'));
      if (system) checked = true;
    }

    return Ember.ObjectProxy.create({
      content: model,
      checked: checked,
      readonly: readonly
    });
  }),

  //users checkboxes
  emailSorting: ['email'],
  usersSort: Ember.computed.sort('userlist', 'emailSorting'),
  checkedUsers: Ember.computed.map('usersSort', function(model){
    var checked = false;
    var readonly = false;
    var users = this.get('project_users');

    var user = null;

    if(users) {
      user = users.findBy('id', model.id);
      if(user) checked = true;
    }

    if (model.get('group').get('access_level') == 50) {
      checked = true;
      readonly = true;
    }

    return Ember.ObjectProxy.create({
      content: model,
      checked: checked,
      readonly: readonly
    });
  }),

  //validation variables
  errorBrand: false,
  errorName: false,
  errorName2: false,
  errorLogin: false,
  errorPassword: false,
  errorFramework: false,
  errorSystem: false,
  errorTechnos: false,
  errorVmsizes: false,
  errorUsers: false,

  //validation functions
  checkBrand: function() {
    var brand = this.get('brand.content');
    var errorBrand = false;

    if (!brand) {
      errorBrand = true;
    }

    this.set('errorBrand', errorBrand);
  }.observes('brand.content'),

  checkName: function() {
    var name = this.get('name');
    var errorName = false;

    if (!name) {
      errorName = true;
    } else {
      this.set('name', this.get('name').replace(/-/g,'.'));
    }

    this.set('errorName', errorName);
  }.observes('name'),

  // check projectname
  checkName2: function() {
    var projects = this.get('projects');
    var name = this.get('name');
    var current_id = this.get('id');
    var self = this;
    var errorName2 = false;

    // if projectname < 6, return
    if (!name || name.length < 6) {
      self.set('errorName2', false);
      self.set('errorName3', true);
      return;
    }
    self.set('errorName3', false);

    // set id to 0 if we create a new project
    if (current_id == null || isNaN(current_id)) { current_id = 0 }

    if (!projects || projects.length == 0) {
      $.ajax({
          url: "/api/v1/projects/" + current_id + "/name/" + name,
          global: false
        })
        .done(function(data) {
          self.set('errorName2', false);
        })
        .fail(function(data) {
          self.set('errorName2', true);
        })
    } else {
      projects.forEach(function (item) {
        if (item.id != current_id) {
          if (item.get('name') == name) {
            errorName2 = true;
          }
        }
      });
      self.set('errorName2', errorName2);
    }
  }.observes('name'),

  checkLogin: function() {
    var login = this.get('login');
    var errorLogin = false;

    this.set('errorLogin', errorLogin);
  }.observes('login'),

  checkPassword: function() {
    var password = this.get('password');
    var errorPassword = false;

    this.set('errorPassword', errorPassword);
  }.observes('password'),

  checkFramework: function() {
    var framework = this.get('framework.content');
    var errorFramework = false;

    if (!framework) {
      errorFramework = true;
    }

    this.set('errorFramework', errorFramework);
  }.observes('framework.content'),

  checkSystem: function() {
    var errorSystem = true;
    var systems = this.get('checkedSystems').filterBy('checked', true);
    if (systems.length > 0) errorSystem = false;

    this.set('errorSystem', errorSystem);
  }.observes('checkedSystems.@each.checked'),

  checkTechnos: function() {
    var errorTechnos = true;
    var technos = this.get('checkedTechnos').filterBy('checked', true);
    if (technos.length > 0) errorTechnos = false;

    this.set('errorTechnos', errorTechnos);
  }.observes('checkedTechnos.@each.checked'),

  checkVmsizes: function() {
    var errorVmsizes = true;
    var vmsizes = this.get('checkedVmsizes').filterBy('checked', true);
    if (vmsizes.length > 0) errorVmsizes = false;

    this.set('errorVmsizes', errorVmsizes);
  }.observes('checkedVmsizes.@each.checked'),

  checkUsers: function() {
    var errorUsers = true;
    var users = this.get('checkedUsers').filterBy('checked', true);
    if (users.length > 0) errorUsers = false;

    this.set('errorUsers', errorUsers);
  }.observes('checkedUsers.@each.checked'),

  //check form before submit
  formIsValid: function() {
    this.checkBrand();
    this.checkName();
    this.checkLogin();
    this.checkPassword();
    this.checkFramework();
    this.checkSystem();
    this.checkTechnos();
    this.checkVmsizes();
    this.checkUsers();

    if (!this.get('errorBrand') &&
        !this.get('errorName') &&
        !this.get('errorName2') &&
        !this.get('errorName3') &&
        !this.get('errorLogin') &&
        !this.get('errorPassword') &&
        !this.get('errorFramework') &&
        !this.get('errorSystem') &&
        !this.get('errorTechnos') &&
        !this.get('errorVmsizes') &&
        !this.get('errorUsers')) return true;
    return false;
  }.observes('model'),

  //clear form
  clearForm: function() {
    this.set('brand', {content: null});
    this.set('name', null);
    this.set('gitpath', null);
    this.set('login', null);
    this.set('password', null);
    this.set('framework', {content: null});
  },

  //events when projectname or brand changes
  updateGitpath: function() {
    var gitpath;
    if (!this.get('brand.content') || !this.get('name')) return;
    gitpath = this.get('brand.content').get('name').replace(/[\. ]/g,'') + "-" + this.get('name').replace(/[\. ]/g,'-');
    this.set('gitpath', gitpath.toLowerCase());
  }.observes('brand.content', 'name'),

  // Check if current user can create project
  isProjectCreate: function() {
    return App.AuthManager.get('apiKey.is_project_create');
  }.property('App.AuthManager.apiKey'),

  // Disable if edit item
  isDisableEdit: function() {
    if (this.get('id')) return true;
    else return false;
  }.property('id'),

  // Check if current user is admin and can change properties
  isDisableAdmin: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');

    if (access_level >= 50) return false;
    return true;
  }.property('App.AuthManager.apiKey'),

  // Disable if edit item
  isDisableEditAdmin: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');

    if (access_level < 50) return true;
    if (this.get('id')) return true;
    return false;
  }.property('id', 'apiKey.accessLevel'),

  // Check if current user is admin or edit his own project and can change properties
  isDisableCreate: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');
    var user_id = App.AuthManager.get('apiKey.user');

    if (access_level >= 50) return false;
    if (this.get('owner').id == user_id) return false;
    return true;
  }.property('App.AuthManager.apiKey'),

  // actions binding with user event
  actions: {
    // Action when submit ofrm
    postItem: function() {
      var router = this.get('target');
      var self = this;
      var store = this.store;
      var data = this.getProperties('name', 'gitpath', 'login', 'password', 'owner');
      var selectedBrand = this.get('brand.content');
      var selectedFramework = this.get('framework.content');
      var selectedSystem = this.get('systemimagetype.content');
      var technos = this.get('checkedTechnos').filterBy('checked', true).mapBy('content');
      var vmsizes = this.get('checkedVmsizes').filterBy('checked', true).mapBy('content');
      var systemimages = this.get('checkedSystems').filterBy('checked', true).mapBy('content');
      var users = this.get('checkedUsers').filterBy('checked', true).mapBy('content');

      var project;

      // set id only if different of 0
      if (this.get('id') != 0) {
        data['id'] = this.get('id');
      }

      // check if form is valid
      if (!this.formIsValid()) {
        return
      }

      // format value for the post request
      data['brand'] = selectedBrand;
      data['framework'] = selectedFramework;
      data['enabled'] = true;

      //if id is present, so update item, else create new one
      if(data['id']) {
        store.find('project', data['id']).then(function (project) {
          var vmsizes_p = project.get('vmsizes').toArray(),
          technos_p = project.get('technos').toArray(),
          systems_p = project.get('systemimages').toArray(),
          users_p = project.get('users').toArray();

          // reset old values from object
          vmsizes_p.forEach(function (item) {
            project.get('vmsizes').removeObject(item);
            item.get('projects').removeObject(project);
          });

          systems_p.forEach(function (item) {
            project.get('systemimages').removeObject(item);
            item.get('projects').removeObject(project);
          });

          technos_p.forEach(function (item) {
            project.get('technos').removeObject(item);
            item.get('projects').removeObject(project);
          });

          users_p.forEach(function (item) {
            project.get('users').removeObject(item);
            item.get('projects').removeObject(project);
          });

          project.get('framework').get('projects').removeObject(project);
          project.get('brand').get('projects').removeObject(project);

          project.setProperties(data);

          // add technos checked into project object
          technos.toArray().forEach(function (item) {
            item.get('projects').addObject(project);
            project.get('technos').pushObject(item);
          });

          // add vmsizes checked into project object
          vmsizes.toArray().forEach(function (item) {
            item.get('projects').addObject(project);
            project.get('vmsizes').pushObject(item);
          });

          systemimages.toArray().forEach(function (item) {
            item.get('projects').addObject(project);
            project.get('systemimages').pushObject(item);
          });

          users.toArray().forEach(function (item) {
            item.get('projects').addObject(project);
            project.get('users').pushObject(item);
          });

          selectedBrand.get('projects').pushObject(project);
          selectedFramework.get('projects').pushObject(project);

          $('#modalloader').modal();
          project.save().then(function() {
            // Return to projects list page
            router.transitionTo('projects.list');
            $('#modalloader').modal('hide');
          });

        });
      } else {
        project = store.createRecord('project', data);

        project.get('technos').forEach(function (item) {
           project.get('technos').removeObject(item);
        });

        project.get('vmsizes').forEach(function (item) {
           project.get('vmsizes').removeObject(item);
        });

        project.get('systemimages').forEach(function (item) {
           project.get('systemimages').removeObject(item);
        });

        project.get('users').forEach(function (item) {
           project.get('users').removeObject(item);
        });

        technos.toArray().forEach(function (item) {
          item.get('projects').addObject(project);
          project.get('technos').pushObject(item);
        });

        vmsizes.toArray().forEach(function (item) {
          item.get('projects').addObject(project);
          project.get('vmsizes').pushObject(item);
        });

        systemimages.toArray().forEach(function (item) {
          item.get('projects').addObject(project);
          project.get('systemimages').pushObject(item);
        });

        users.toArray().forEach(function (item) {
          item.get('projects').addObject(project);
          project.get('users').pushObject(item);
        });

        project.get('users').then(function (users_p) {
          users_p.pushObjects(users.toArray());
        });

        selectedBrand.get('projects').pushObject(project);
        selectedFramework.get('projects').pushObject(project);

        //loader because between 1 and 5min to complete create project
        $('#modalloader').modal();
        project.save().then(function() {
          // Return to projects list page
          router.transitionTo('projects.list');
          $('#modalloader').modal('hide');
        }) ;
      }
    }
  }
});

module.exports = ProjectsNewController;
