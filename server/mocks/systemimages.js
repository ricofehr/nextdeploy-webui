/**
 *  systemimages mock on server side
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Systemimage
 *  @namespace mock
 *  @module nextdeploy
 */
module.exports = function(app) {
  var express = require('express');
  var systemimagesRouter = express.Router();

  /**
   *  Mock systemimages list request
   *
   *  @method get:/
   */
  systemimagesRouter.get('/', function(req, res) {
    res.send({
      'systemimages':[
        {
          "id":1,"name":"Ubuntu1404","glance_id":"46830159-e050-4360-b2ca-ef26ffe2241e",
          "enabled":true,"systemimagetype":1,"vms":[1,2,4,6],"projects":[1,2,3,4,5,6]
        },
        {
          "id":2,"name":"Debian8","glance_id":"7df4037d-243f-46d1-83b0-064e243cf0e3",
          "enabled":true,"systemimagetype":1,"vms":[3,5],"projects":[1,3,4,5,6]
        }
      ]
    });
  });

  /**
   *  Mock show systemimage request
   *
   *  @method get:/$id
   */
  systemimagesRouter.get('/:id', function(req, res) {
    res.send({
      'systemimage':{
        id: req.params.id
      }
    });
  });

  app.use('/api/v1/systemimages', systemimagesRouter);
};
