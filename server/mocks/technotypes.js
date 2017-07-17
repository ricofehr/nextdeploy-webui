/**
 *  technotypes mock on server side
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Technotype
 *  @namespace mock
 *  @module nextdeploy
 */
module.exports = function(app) {
  var express = require('express');
  var technotypesRouter = express.Router();

  /**
   *  Mock technotypes list request
   *
   *  @method get:/
   */
  technotypesRouter.get('/', function(req, res) {
    res.send({
      "technotypes":[
        {"id":1,"name":"Cache Server","technos":[6]},
        {"id":2,"name":"Web Server","technos":[1]},
        {"id":3,"name":"Big Data","technos":[14,13,12]},
        {"id":4,"name":"Database","technos":[7]},
        {"id":5,"name":"Nodejs","technos":[11,10,9,8]},
        {"id":6,"name":"Messaging","technos":[2]},
        {"id":7,"name":"Keyvalue","technos":[5,4]},
        {"id":8,"name":"Index","technos":[3]},
        {"id":9,"name":"Java","technos":[17,16,15]}
      ]
    });
  });

  /**
   *  Mock show technotype request
   *
   *  @method get:/$id
   */
  technotypesRouter.get('/:id', function(req, res) {
    res.send({
      'technotype':{
        id: req.params.id
      }
    });
  });

  app.use('/api/v1/technotypes', technotypesRouter);
};
