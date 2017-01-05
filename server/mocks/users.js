/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var usersRouter = express.Router();
  var signinRouter = express.Router();

  usersRouter.get('/', function(req, res) {
    res.send({
      'users':[
        {"id":1,"email":"usera@os.nextdeploy","authentication_token":"Ue1maDFV-NQzrD4eKrVn","is_project_create":true,"is_user_create":true,"company":"My Company","quotavm":0,"quotaprod":0,"layout":"us","firstname":"usera","lastname":"usera","shortname":"U. Usera","created_at":"2016-06-07T22:31:35.000+02:00","vms":[4],"sshkeys":[1],"group":1,"projects":[1,2,3,4,5,6],"own_projects":[1,2,3,4,5,6]},
        {"id":2,"email":"userl@os.nextdeploy","authentication_token":null,"is_project_create":true,"is_user_create":true,"company":"My Company","quotavm":10,"quotaprod":4,"layout":"us","firstname":"userl","lastname":"userl","shortname":"U. Userl","created_at":"2016-06-07T22:31:42.000+02:00","vms":[2,5],"sshkeys":[],"group":2,"projects":[1,4,5,6],"own_projects":[]},
        {"id":3,"email":"userd@os.nextdeploy","authentication_token":null,"is_project_create":false,"is_user_create":false,"company":"My Company","quotavm":5,"quotaprod":0,"layout":"us","firstname":"userd","lastname":"userd","shortname":"U. Userd","created_at":"2016-06-07T22:31:43.000+02:00","vms":[1,3],"sshkeys":[],"group":3,"projects":[1,2,3,4,6],"own_projects":[]},
        {"id":4,"email":"userp@os.nextdeploy","authentication_token":null,"is_project_create":false,"is_user_create":false,"company":"My Company","quotavm":5,"quotaprod":0,"layout":"us","firstname":"userp","lastname":"userp","shortname":"U. Userp","created_at":"2016-06-07T22:31:44.000+02:00","vms":[6],"sshkeys":[],"group":4,"projects":[1],"own_projects":[]},
        {"id":5,"email":"userg@os.nextdeploy","authentication_token":null,"is_project_create":false,"is_user_create":false,"company":"My Company","quotavm":3,"quotaprod":0,"layout":"us","firstname":"userg","lastname":"userg","shortname":"U. Userg","created_at":"2016-06-07T22:31:44.000+02:00","vms":[],"sshkeys":[],"group":5,"projects":[1,2,5],"own_projects":[]}
      ]
    });
  });

  usersRouter.post('/', function(req, res) {
    var user = req.body.user;

    res.send({
      "user":{
        "id": Math.floor((Math.random() * 1000) + 6),
        "email": user.email,
        "authentication_token": null,
        "is_project_create": user.is_project_create,
        "is_user_create": user.is_user_create,
        "company": user.company,
        "quotavm": user.quotavm,
        "quotaprod": user.quotaprod,
        "layout": user.layout,
        "firstname": user.firstname,
        "lastname": user.lastname,
        "shortname": user.firstname.charAt(0).toUpperCase() + ". " + user.lastname.charAt(0).toUpperCase() + user.lastname.slice(1),
        "created_at": new Date().toLocaleString(),
        "vms": [],
        "sshkeys": [],
        "group": user.group,
        "projects": user.projects,
        "own_projects": []
      }
    });
  });

  signinRouter.post('', function(req, res) {
    /* check password */
    if (req.body.user.password != 'word123123') {
      res.status(401).end();
    }

    switch(req.body.user.email) {
        case 'usera@os.nextdeploy':
          res.send({"token":"Ue1maDFV-NQzrD4eKrVn","email":"usera@os.nextdeploy","access_level":50,"user_id":1,"group_id":1,"user":{"id":1,"email":"usera@os.nextdeploy","created_at":"2016-06-07T22:31:35.000+02:00","updated_at":"2016-09-20T14:08:47.273+02:00","authentication_token":"Ue1maDFV-NQzrD4eKrVn","quotavm":0,"company":"My Company","gitlab_id":2,"group_id":1,"firstname":"usera","lastname":"usera","is_project_create":true,"layout":"us","is_user_create":true,"quotaprod":0}});
          break;
        case 'userl@os.nextdeploy':
          res.send({"token":"KJ1PUDCx7vg3MAJTszUy","email":"userl@os.nextdeploy","access_level":40,"user_id":2,"group_id":2,"user":{"id":2,"email":"userl@os.nextdeploy","created_at":"2016-06-07T22:31:42.000+02:00","updated_at":"2016-09-20T17:59:18.630+02:00","authentication_token":"KJ1PUDCx7vg3MAJTszUy","quotavm":10,"company":"My Company","gitlab_id":3,"group_id":2,"firstname":"userl","lastname":"userl","is_project_create":true,"layout":"us","is_user_create":true,"quotaprod":4}});
          break;
        case 'userd@os.nextdeploy':
          res.send({"token":"K8VZPAyYJAxZGugMSbYP","email":"userd@os.nextdeploy","access_level":30,"user_id":3,"group_id":3,"user":{"id":3,"email":"userd@os.nextdeploy","created_at":"2016-06-07T22:31:43.000+02:00","updated_at":"2016-09-20T17:57:27.005+02:00","authentication_token":"K8VZPAyYJAxZGugMSbYP","quotavm":5,"company":"My Company","gitlab_id":4,"group_id":3,"firstname":"userd","lastname":"userd","is_project_create":false,"layout":"us","is_user_create":false,"quotaprod":0}});
          break;
        case 'userp@os.nextdeploy':
          res.send({"token":"WpnCKEVaFebsxJvC4Hza","email":"userp@os.nextdeploy","access_level":20,"user_id":4,"group_id":4,"user":{"id":4,"email":"userp@os.nextdeploy","created_at":"2016-06-07T22:31:44.000+02:00","updated_at":"2016-09-20T18:00:21.311+02:00","authentication_token":"WpnCKEVaFebsxJvC4Hza","quotavm":5,"company":"My Company","gitlab_id":5,"group_id":4,"firstname":"userp","lastname":"userp","is_project_create":false,"layout":"us","is_user_create":false,"quotaprod":0}});
          break;
        case 'userg@os.nextdeploy':
          res.send({"token":"S25f2tZJs5X3nsgcMzyE","email":"userg@os.nextdeploy","access_level":10,"user_id":5,"group_id":5,"user":{"id":5,"email":"userg@os.nextdeploy","created_at":"2016-06-07T22:31:44.000+02:00","updated_at":"2016-09-20T18:01:05.906+02:00","authentication_token":"S25f2tZJs5X3nsgcMzyE","quotavm":3,"company":"My Company","gitlab_id":6,"group_id":5,"firstname":"userg","lastname":"userg","is_project_create":false,"layout":"us","is_user_create":false,"quotaprod":0}});
          break;
        default:
          res.send(401);
    }

  });

  usersRouter.get('/:id', function(req, res) {
    res.send({
      'user':{
        id: req.params.id
      }
    });
  });

  usersRouter.put('/:id', function(req, res) {
    var user = req.body.user;

    res.send({
      "user":{
        "id": req.params.id,
        "email": user.email,
        "authentication_token": user.authentication_token,
        "is_project_create": user.is_project_create,
        "is_user_create": user.is_user_create,
        "company": user.company,
        "quotavm": user.quotavm,
        "quotaprod": user.quotaprod,
        "layout": user.layout,
        "firstname": user.firstname,
        "lastname": user.lastname,
        "shortname": user.firstname.charAt(0).toUpperCase() + ". " + user.lastname.charAt(0).toUpperCase() + user.lastname.slice(1),
        "created_at": user.created_at,
        "vms": user.vms,
        "sshkeys": user.sshkeys,
        "group": user.group,
        "projects": user.projects,
        "own_projects": user.own_projects,
      }
    });
  });

  usersRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  usersRouter.get('/:id/email/:email', function(req, res) {
    res.status(200).end();
  });

  app.use('/api/v1/users', require('body-parser').json(), usersRouter);
  app.use('/api/v1/users/sign_in', require('body-parser').urlencoded(), signinRouter);
};
