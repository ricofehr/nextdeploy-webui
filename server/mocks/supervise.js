/**
 *  supervises mock on server side
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Supervise
 *  @namespace mock
 *  @module nextdeploy
 */
module.exports = function(app) {
  var express = require('express');
  var supervisesRouter = express.Router();

  /**
   *  Mock supervises list request
   *
   *  @method get:/
   */
  supervisesRouter.get('/', function(req, res) {
    res.send({
      'supervises':[
        {"id":1, "vm":1, "techno":6, "status":true},
        {"id":2, "vm":1, "techno":10, "status":true},
        {"id":3, "vm":1, "techno":1, "status":true},
        {"id":4, "vm":1, "techno":7, "status":true},
        {"id":5, "vm":1, "techno":5, "status":true},
        {"id":6, "vm":1, "techno":4, "status":true},
        {"id":7, "vm":2, "techno":6, "status":true},
        {"id":8, "vm":2, "techno":10, "status":true},
        {"id":9, "vm":2, "techno":1, "status":true},
        {"id":10, "vm":2, "techno":7, "status":true},
        {"id":11, "vm":2, "techno":5, "status":true},
        {"id":12, "vm":2, "techno":4, "status":true},
        {"id":13, "vm":3, "techno":6, "status":false},
        {"id":14, "vm":3, "techno":10, "status":true},
        {"id":15, "vm":3, "techno":1, "status":true},
        {"id":16, "vm":3, "techno":7, "status":true},
        {"id":17, "vm":3, "techno":5, "status":false},
        {"id":18, "vm":4, "techno":6, "status":true},
        {"id":19, "vm":4, "techno":10, "status":true},
        {"id":20, "vm":4, "techno":1, "status":true},
        {"id":21, "vm":4, "techno":7, "status":true},
        {"id":22, "vm":5, "techno":6, "status":true},
        {"id":23, "vm":5, "techno":10, "status":true},
        {"id":24, "vm":5, "techno":1, "status":true},
        {"id":25, "vm":6, "techno":6, "status":true},
        {"id":26, "vm":6, "techno":10, "status":true},
        {"id":27, "vm":6, "techno":1, "status":true},
        {"id":28, "vm":6, "techno":7, "status":true},
        {"id":29, "vm":6, "techno":5, "status":true},
        {"id":30, "vm":6, "techno":4, "status":true}
      ]
    });
  });

  /**
   *  Mock show supervise request
   *
   *  @method get:/$id
   */
  supervisesRouter.get('/:id', function(req, res) {
    res.send({
      'uri':{
        id: req.params.id
      }
    });
  });

  app.use('/api/v1/supervises', require('body-parser').json(), supervisesRouter);
};
