var AuthenticatedRoute = require('../authenticated_route');

// Project Ember Route Class (inherit from auth route because restricted)
var ProjectsNewRoute = AuthenticatedRoute.extend({
  // This controller needs lot of datas: brands, frameworks, technos, flavors, users
model: function() {
    var access_level = App.AuthManager.get('apiKey.accessLevel');
    var self=this
    var content = Ember.Object.create();
    var technoids = [];
    var vmsizeids = [];
    var systemimageids = [];

    $.ajaxSetup({ async: false });
    $.getJSON("/api/v1/projects/0")
        .done(function(data) {
          var project = data.project;
          var vmsizes = Ember.A();
          var systemimages = Ember.A();
          var technos = Ember.A();
          var i = 0;
          content.set('id', null);
          content.set('name', project.name);
          content.set('gitpath', project.gitpath);
          content.set('enabled', project.enabled);
          content.set('login', project.login);
          content.set('password', project.password);
          content.set('created_at', project.created_at);
          content.set('owner', self.store.find('user', App.AuthManager.get('apiKey.user')));
          content.set('brand', self.store.find('brand', project.brand));
          content.set('framework', self.store.find('framework', project.framework));
          content.set('branches', []);
          content.set('project_users', [self.store.find('user', App.AuthManager.get('apiKey.user'))]);

          vmsizeids = project.vmsizes;
          vmsizeids.forEach(function (vmsize) {
            vmsizes.push(self.store.find('vmsize', vmsize));
          });
          content.set('project_vmsizes', vmsizes);

          systemimageids = project.systemimages;
          systemimageids.forEach(function (systemimage) {
            systemimages.push(self.store.find('systemimage', systemimage));
          });
          content.set('project_systemimages', systemimages);

          technoids = project.technos;
          technoids.forEach(function (techno) {
            technos.push(self.store.find('techno', techno));
          });
          content.set('project_technos', technos);
        });

    $.ajaxSetup({ async: true });

    if (access_level == 50) {
      return Ember.RSVP.hash({
        brandlist: this.store.all('brand'),
        frameworklist: this.store.all('framework'),
        technolist: this.store.all('techno'),
        vmsizelist: this.store.all('vmsize'),
        userlist: this.store.all('user'),
        systemlist: this.store.all('systemimage'),
        groups: this.store.all('group'),
        projects: this.store.all('project').filterBy('name'),
        project: content
      });
    } else {
      return Ember.RSVP.hash({
        brandlist: this.store.all('brand'),
        frameworklist: this.store.all('framework'),
        technolist: this.store.all('techno').filter(function(item, index, self) {
          if (technoids.contains(parseInt(item.get("id")))) { return true; }
        }),
        vmsizelist: this.store.all('vmsize').filter(function(item, index, self) {
         if (vmsizeids.contains(parseInt(item.get("id")))) { return true; }
        }),
        systemlist: this.store.all('systemimage').filter(function(item, index, self) {
         if (systemimageids.contains(parseInt(item.get("id")))) { return true; }
        }),
        userlist: this.store.all('user'),
        groups: this.store.all('group'),
        projects: [],
        project: content
      });
    }
  },

  // Setup the controller with thie model
  setupController: function(controller, model) {
    var self = this;
    content = Ember.Object.create();
    content.set('brand', {content: null});
    content.set('framework', {content: null});
    this.controllerFor('projects.new').setProperties({model: content});
    this.controllerFor('projects.new').clearForm();

    this.controllerFor('projects.new').setProperties({model: model.project,
                                                      brandlist: model.brandlist,
                                                      frameworklist: model.frameworklist,
                                                      technolist: model.technolist,
                                                      vmsizelist: model.vmsizelist,
                                                      userlist: model.userlist,
                                                      systemlist: model.systemlist,
                                                      groups: model.groups,
                                                      projects: model.projects});
  }

});


module.exports = ProjectsNewRoute;

