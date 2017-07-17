/**
 *  systemimagetypes mock on server side
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Systemimagetype
 *  @namespace mock
 *  @module nextdeploy
 */
module.exports = function(app) {
  var express = require('express');
  var systemimagetypesRouter = express.Router();

  /**
   *  Mock systemimagetypes list request
   *
   *  @method get:/
   */
  systemimagetypesRouter.get('/', function(req, res) {
    res.send({
      'systemimagetypes':[
        {"id":1,"name":"linux","systemimages":[1,2]}
      ]
    });
  });

  /**
   *  Mock show systemimagetype request
   *
   *  @method get:/$id
   */
  systemimagetypesRouter.get('/:id', function(req, res) {
    res.send({
      'systemimagetype':{
        id: req.params.id
      }
    });
  });

  app.use('/api/v1/systemimagetypes', systemimagetypesRouter);
};
