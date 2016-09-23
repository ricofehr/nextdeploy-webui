/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var urisRouter = express.Router();

  urisRouter.get('/', function(req, res) {
    res.send({
      'uris':[
        {"id":1,"absolute":"3-www-drupalmycompany-com-74486777.os.nextdeploy.local","path":"server","envvars":"","aliases":"","ipfilter":"","port":8080,"customvhost":"","is_sh":false,"vm":1,"framework":4},
        {"id":2,"absolute":"2-www-drupalmycompany-com-74475477.os.nextdeploy.local","path":"server","envvars":"","aliases":"","ipfilter":"","port":8080,"customvhost":"","is_sh":false,"vm":2,"framework":4},
        {"id":3,"absolute":"3-www-symfonyhiscompany-com-76475472.os.nextdeploy.local","path":"server","envvars":"","aliases":"sf2s.3-www-symfonyhiscompany-com-76475472.os.nextdeploy.local","ipfilter":"","port":8080,"customvhost":"","is_sh":false,"vm":3,"framework":1},
        {"id":4,"absolute":"1-www-wordpressmycompany-com-72475432.os.nextdeploy.local","path":"server","envvars":"","aliases":"","ipfilter":"","port":8080,"customvhost":"","is_sh":false,"vm":4,"framework":5},
        {"id":5,"absolute":"html.1-www-wordpressmycompany-com-72475432.os.nextdeploy.local","path":"server","envvars":"","aliases":"","ipfilter":"","port":8080,"customvhost":"","is_sh":false,"vm":4,"framework":8},
        {"id":6,"absolute":"2-www-statichiscompany-com-72495402.os.nextdeploy.local","path":"server","envvars":"","aliases":"","ipfilter":"","port":8080,"customvhost":"","is_sh":false,"vm":5,"framework":8},
        {"id":7,"absolute":"4-www-drupalmycompany-com-75685412.os.nextdeploy.local","path":"server","envvars":"","aliases":"","ipfilter":"","port":8080,"customvhost":"","is_sh":false,"vm":6,"framework":4}
      ]
    });
  });

  urisRouter.post('/', function(req, res) {
    var uri = req.body.uri;

    res.send({
        "uri":{
          "id": Math.floor((Math.random() * 1000) + 10),
          "absolute": uri.absolute,
          "path": uri.path,
          "envvars": uri.envvars,
          "aliases": uri.aliases,
          "ipfilter": uri.ipfilter,
          "port": uri.port,
          "customvhost": uri.customvhost,
          "is_sh": uri.is_sh,
          "vm": uri.vm,
          "framework":uri.framework
        }
    });
  });

  urisRouter.get('/:id', function(req, res) {
    res.send({
      'uri':{
        id: req.params.id
      }
    });
  });

  urisRouter.put('/:id', function(req, res) {
    var uri = req.body.uri;

    res.send({
        "uri":{
          "id": req.params.id,
          "absolute": uri.absolute,
          "path": uri.path,
          "envvars": uri.envvars,
          "aliases": uri.aliases,
          "ipfilter": uri.ipfilter,
          "port": uri.port,
          "customvhost": uri.customvhost,
          "is_sh": uri.is_sh,
          "vm": uri.vm,
          "framework":uri.framework
        }
    });
  });

  urisRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  urisRouter.post('/:id/import', function(req, res) {
    res.status(200).end();
  });

  urisRouter.post('/:id/export', function(req, res) {
    res.status(200).end();
  });

  app.use('/api/v1/uris', require('body-parser').json(), urisRouter);
};
