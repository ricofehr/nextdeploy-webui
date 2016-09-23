/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var systemimagetypesRouter = express.Router();

  systemimagetypesRouter.get('/', function(req, res) {
    res.send({
      'systemimagetypes':[
        {"id":1,"name":"linux","systemimages":[1,2]}
      ]
    });
  });

  systemimagetypesRouter.get('/:id', function(req, res) {
    res.send({
      'systemimagetype':{
        id: req.params.id
      }
    });
  });

  app.use('/api/v1/systemimagetypes', systemimagetypesRouter);
};
