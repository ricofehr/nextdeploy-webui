/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var supervisesRouter = express.Router();

  supervisesRouter.get('/', function(req, res) {
    res.send({
      'supervises':[
        {"id":1, "vm":1, "techno":6, "status":1},
        {"id":2, "vm":1, "techno":10, "status":1},
        {"id":3, "vm":1, "techno":1, "status":1},
        {"id":4, "vm":1, "techno":7, "status":1},
        {"id":5, "vm":1, "techno":5, "status":1},
        {"id":6, "vm":1, "techno":4, "status":1},
        {"id":7, "vm":2, "techno":6, "status":1},
        {"id":8, "vm":2, "techno":10, "status":1},
        {"id":9, "vm":2, "techno":1, "status":1},
        {"id":10, "vm":2, "techno":7, "status":1},
        {"id":11, "vm":2, "techno":5, "status":1},
        {"id":12, "vm":2, "techno":4, "status":1},
        {"id":13, "vm":3, "techno":6, "status":0},
        {"id":14, "vm":3, "techno":10, "status":1},
        {"id":15, "vm":3, "techno":1, "status":1},
        {"id":16, "vm":3, "techno":7, "status":1},
        {"id":17, "vm":3, "techno":5, "status":0},
        {"id":18, "vm":4, "techno":6, "status":1},
        {"id":19, "vm":4, "techno":10, "status":1},
        {"id":20, "vm":4, "techno":1, "status":1},
        {"id":21, "vm":4, "techno":7, "status":1},
        {"id":22, "vm":5, "techno":6, "status":1},
        {"id":23, "vm":5, "techno":10, "status":1},
        {"id":24, "vm":5, "techno":1, "status":1},
        {"id":25, "vm":6, "techno":6, "status":1},
        {"id":26, "vm":6, "techno":10, "status":1},
        {"id":27, "vm":6, "techno":1, "status":1},
        {"id":28, "vm":6, "techno":7, "status":1},
        {"id":29, "vm":6, "techno":5, "status":1},
        {"id":30, "vm":6, "techno":4, "status":1}
      ]
    });
  });



  supervisesRouter.get('/:id', function(req, res) {
    res.send({
      'uri':{
        id: req.params.id
      }
    });
  });

  app.use('/api/v1/supervises', require('body-parser').json(), supervisesRouter);
};
