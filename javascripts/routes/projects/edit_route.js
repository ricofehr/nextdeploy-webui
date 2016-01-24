var AuthenticatedRoute = require('../authenticated_route');

// Project Ember Route Class (inherit from auth route because restricted)
var ProjectsEditRoute = AuthenticatedRoute.extend({
  // This controller needs lot of datas: brands, frameworks, technos, flavors, users
  // and ofcourse the project following the parameter
  model: function(params) {
    var access_level = App.AuthManager.get('apiKey.accessLevel');
    var self=this
    var technoids = [];
    var vmsizeids = [];
    var systemimageids = [];

    if (access_level == 50) {
      return Ember.RSVP.hash({
        brandlist: this.store.all('brand'),
        frameworklist: this.store.all('framework'),
        technolist: this.store.all('techno'),
        vmsizelist: this.store.all('vmsize'),
        userlist: this.store.all('user'),
        systemlist: this.store.all('systemimage'),
        project: this.store.find('project', params.project_id),
        projects: this.store.all('project').filterBy('name')
      });
    } else {
      $.ajaxSetup({ async: false });
      $.getJSON("/api/v1/projects/0")
          .done(function(data) {
            var project = data.project;
            vmsizeids = project.vmsizes;
            technoids = project.technos;
            systemimageids = project.systemimages;
          });
      $.ajaxSetup({ async: true });

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
        project: this.store.find('project', params.project_id),
        projects: []
      });
    }

  },

  // Same template than the create form
  renderTemplate:function () {
    this.render('projects/new');
  },

  // Setup the controller "projects.new" with this model
  setupController: function(controller, model) {
    this.controllerFor('projects.new').setProperties({model: model.project,
                                                      gitpath: model.project.get('gitpath').replace(/^.*\//, ''),
                                                      project_users: model.project.get('users'),
                                                      project_technos: model.project.get('technos'),
                                                      project_vmsizes: model.project.get('vmsizes'),
                                                      project_systemimages: model.project.get('systemimages'),
                                                      brandlist: model.brandlist,
                                                      frameworklist: model.frameworklist,
                                                      technolist: model.technolist,
                                                      vmsizelist: model.vmsizelist,
                                                      userlist: model.userlist,
                                                      systemlist: model.systemlist,
                                                      projects: model.projects});
  },

});

module.exports = ProjectsEditRoute;