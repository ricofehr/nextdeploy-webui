/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var vmsizesRouter = express.Router();

  vmsizesRouter.get('/', function(req, res) {
    res.send({
      'vmsizes':[
        {"id":1,"title":"m1.tiny","description":"1cpu/512M/15G","projects":[1,2,3,4,5,6],"vms":[5,6]},
        {"id":2,"title":"m1.small","description":"2cpu/1024M/15G","projects":[1,2,5],"vms":[1,2,3,4]},
        {"id":3,"title":"m1.medium","description":"2cpu/4096M/40G","projects":[],"vms":[]},
        {"id":4,"title":"m1.large","description":"4cpu/8192M/80G","projects":[],"vms":[]}
      ]
    });
  });

  vmsizesRouter.get('/:id', function(req, res) {
    res.send({
      'vmsize':{
        id: req.params.id
      }
    });
  });

  app.use('/api/v1/vmsizes', vmsizesRouter);
};
