/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var projectsRouter = express.Router();

  projectsRouter.get('/', function(req, res) {
    res.send({
      'projects':[
        {"id":1,"name":"www.drupalmycompany.com","gitpath":"gitlab.nextdeploy.local:/root/mycompany-www-drupalmycompany-com","enabled":true,"login":"modem","password":"modem","created_at":new Date().toLocaleString(),"is_ht":false,"users":[1,2,3,4,5,6],"endpoints":[5],"technos":[6,10,1,7,5,4],"vmsizes":[1,2],"systemimages":[1,2],"branches":["1-develop","1-master"],"owner":1,"brand":1},
        {"id":2,"name":"www.symfonyyourcompany.com","gitpath":"gitlab.nextdeploy.local:/root/yourcompany-www-symfonyyourcompany-com","enabled":true,"login":"modem","password":"modem","created_at":new Date().toLocaleString(),"is_ht":false,"users":[1,3,5,6],"endpoints":[7],"technos":[6,10,1,12,5,2,3],"vmsizes":[1,2],"systemimages":[1],"branches":["2-develop","2-master"],"owner":1,"brand":2},
        {"id":3,"name":"www.symfonyhiscompany.com","gitpath":"gitlab.nextdeploy.local:/root/hiscompany-www-symfonyhiscompany-com","enabled":true,"login":"modem","password":"modem","created_at":new Date().toLocaleString(),"is_ht":false,"users":[1,3,6],"endpoints":[6],"technos":[6,10,1,7,5],"vmsizes":[1],"systemimages":[1,2],"branches":["3-develop","3-master"],"owner":1,"brand":3},
        {"id":4,"name":"www.statichiscompany.com","gitpath":"gitlab.nextdeploy.local:/root/hiscompany-www-statichiscompany-com","enabled":true,"login":"modem","password":"modem","created_at":new Date().toLocaleString(),"is_ht":false,"users":[1,2,3,6],"endpoints":[4],"technos":[6,10,1],"vmsizes":[1],"systemimages":[1,2],"branches":["4-develop","4-master"],"owner":1,"brand":3},
        {"id":5,"name":"www.wordpressmycompany.com","gitpath":"gitlab.nextdeploy.local:/root/mycompany-www-wordpressmycompany-com","enabled":true,"login":"modem","password":"modem","created_at":new Date().toLocaleString(),"is_ht":false,"users":[1,2,5,6],"endpoints":[2,3],"technos":[6,10,1,7],"vmsizes":[1,2],"systemimages":[1,2],"branches":["5-develop","5-master"],"owner":1,"brand":1},
        {"id":6,"name":"www.njsyourcompany.com","gitpath":"gitlab.nextdeploy.local:/root/yourcompany-www-njsyourcompany-com","enabled":true,"login":"modem","password":"modem","created_at":new Date().toLocaleString(),"is_ht":false,"users":[1,2,3,6],"endpoints":[1],"technos":[6,10,1,10],"vmsizes":[1],"systemimages":[1,2],"branches":["6-develop","6-master"],"owner":1,"brand":2}
      ]
    });
  });

  projectsRouter.post('/', function(req, res) {
    var project = req.body.project;
    var projid = Math.floor((Math.random() * 1000) + 7);

    res.send({
      "project":{
        "id": projid,
        "name": project.name,
        "gitpath": "gitlab.nextdeploy.local:/root/" + project.gitpath,
        "enabled": true,
        "login": project.login,
        "password": project.password,
        "created_at": new Date().toLocaleString(),
        "is_ht": project.is_ht,
        "users": project.users,
        "endpoints": [],
        "technos": project.technos,
        "vmsizes": project.vmsizes,
        "systemimages": project.systemimages,
        "branches": [projid + "-develop", projid + "-master"],
        "owner": project.owner,
        "brand": project.brand
      }
    });
  });

  projectsRouter.get('/:id', function(req, res) {
    if (req.params.id === '0') {
      res.send({
        "project":{
          "id": null,
          "name": "",
          "gitpath": "",
          "enabled": true,
          "login": "modem",
          "password": "modem",
          "created_at": null,
          "owner": null,
          "brand": 1,
          "systemimages": [1,2],
          "technos": [1,6,7,10],
          "vmsizes": [2],
          "users": [1],
          "vms": [],
          "branches": [],
          "endpoints": []
        }
      });
    } else if (req.params.id === '1') {
      res.send({
        'project':{
          "id":1,
          "name":"www.drupalmycompany.com",
          "gitpath":"gitlab.nextdeploy.local:/root/mycompany-www-drupalmycompany-com",
          "enabled":true,
          "login":"modem",
          "password":"modem",
          "created_at":new Date().toLocaleString(),
          "is_ht":false,
          "users":[1,2,3,4,5,6],
          "endpoints":[5],
          "technos":[6,10,1,7,5,4],
          "vmsizes":[1,2],
          "systemimages":[1,2],
          "branches":["1-develop","1-master"],
          "owner":1,
          "brand":1
        }
      });
    } else {
      res.send({
        'project':{
          id: req.params.id
        }
      });
    }
  });

  projectsRouter.put('/:id', function(req, res) {
    var project = req.body.project;

    res.send({
      "project":{
        "id": req.params.id,
        "name": project.name,
        "gitpath": "gitlab.nextdeploy.local:/root/" + project.gitpath,
        "enabled": true,
        "login": project.login,
        "password": project.password,
        "created_at": project.created_at,
        "is_ht": project.is_ht,
        "users": project.users,
        "endpoints": project.endpoints,
        "vms": project.vms,
        "technos": project.technos,
        "vmsizes": project.vmsizes,
        "systemimages": project.systemimages,
        "branches": [req.params.id + "-develop", req.params.id + "-master"],
        "owner": project.owner,
        "brand": project.brand
      }
    });
  });

  projectsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v1/projects', require('body-parser').json(), projectsRouter);
};
