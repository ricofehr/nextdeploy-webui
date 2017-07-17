/**
 *  Endpoints mock on server side
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Endpoint
 *  @namespace mock
 *  @module nextdeploy
 */
module.exports = function(app) {
  var express = require('express');
  var endpointsRouter = express.Router();

  /**
   *  Mock endpoints list request
   *
   *  @method get:/
   */
  endpointsRouter.get('/', function(req, res) {
    res.send({
      'endpoints':[
        {
          "id":1,"prefix":"","is_main":true,"path":"nodejs","envvars":"PORT=3100",
          "aliases":"nodejs njs","is_install":false,"ipfilter":"","port":3100,"customvhost":"",
          "is_sh":false,"is_import":false,"is_ssl":false,"project":6,"framework":6
        },
        {
          "id":2,"prefix":"","is_main":true,"path":"server","envvars":"",
          "aliases":"","is_install":false,"ipfilter":"","port":8080,"customvhost":"",
          "is_sh":false,"is_import":true,"is_ssl":true,"project":5,"framework":5
        },
        {
          "id":3,"prefix":"html","is_main":false,"path":"html","envvars":"",
          "aliases":"","is_install":false,"ipfilter":"","port":8080,"customvhost":"",
          "is_sh":false,"is_import":false,"is_ssl":false,"project":5,"framework":8
        },
        {
          "id":4,"prefix":"","is_main":true,"path":"server","envvars":"",
          "aliases":"","is_install":false,"ipfilter":"","port":8080,"customvhost":"",
          "is_sh":false,"is_import":false,"is_ssl":true,"project":4,"framework":8
        },
        {
          "id":5,"prefix":"","is_main":true,"path":"server","envvars":"",
          "aliases":"","is_install":false,"ipfilter":"","port":8080,"customvhost":"",
          "is_sh":false,"is_import":true,"is_ssl":false,"project":1,"framework":4
        },
        {
          "id":6,"prefix":"","is_main":true,"path":"server","envvars":"",
          "aliases":"sf2s","is_install":false,"ipfilter":"","port":8080,"customvhost":"",
          "is_sh":false,"is_import":true,"is_ssl":true,"project":3,"framework":1
        },
        {
          "id":7,"prefix":"","is_main":true,"path":"server","envvars":"",
          "aliases":"sf3c","is_install":false,"ipfilter":"","port":8080,"customvhost":"",
          "is_sh":false,"is_import":true,"is_ssl":false,"project":2,"framework":2
        }
      ]
    });
  });

  /**
   *  Mock new endpoint request
   *
   *  @method post:/
   */
  endpointsRouter.post('/', function(req, res) {
    var ep = req.body.endpoint;

    res.send({
      "endpoint":{
        "id": Math.floor((Math.random() * 1000) + 8),
        "prefix": ep.prefix,
        "path": ep.path,
        "envvars": ep.envvars,
        "aliases": ep.aliases,
        "is_install": ep.is_install,
        "ipfilter": ep.ipfilter,
        "port": ep.port,
        "customvhost": ep.customvhost,
        "is_sh": ep.is_sh,
        "is_import": ep.is_import,
        "is_ssl": ep.is_ssl,
        "project": ep.project,
        "framework": ep.framework
      }
    });
  });

  /**
   *  Mock show endpoint request
   *
   *  @method get:/$id
   */
  endpointsRouter.get('/:id', function(req, res) {
    res.send({
      'endpoint':{
        id: req.params.id
      }
    });
  });

  /**
   *  Mock change endpoint request
   *
   *  @method put:/$id
   */
  endpointsRouter.put('/:id', function(req, res) {
    var ep = req.body.endpoint;

    res.send({
      "endpoint":{
        "id": req.params.id,
        "prefix": ep.prefix,
        "path": ep.path,
        "envvars": ep.envvars,
        "aliases": ep.aliases,
        "is_install": ep.is_install,
        "ipfilter": ep.ipfilter,
        "port": ep.port,
        "customvhost": ep.customvhost,
        "is_sh": ep.is_sh,
        "is_import": ep.is_import,
        "is_ssl": ep.is_ssl,
        "project": ep.project,
        "framework": ep.framework
      }
    });
  });

  /**
   *  Mock delete endpoint request
   *
   *  @method delete:/$id
   */
  endpointsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v1/endpoints', require('body-parser').json(), endpointsRouter);
};
