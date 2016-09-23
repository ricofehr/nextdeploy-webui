/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var technosRouter = express.Router();

  technosRouter.get('/', function(req, res) {
    res.send({
      'technos':[
        {"id":1,"name":"apache","dockercompose":null,"technotype":2,"projects":[1,2,3,4,5,6],"vms":[1,2,3,4,5,6]},
        {"id":2,"name":"rabbitmq","dockercompose":null,"technotype":6,"projects":[2],"vms":[]},
        {"id":3,"name":"elasticsearch","dockercompose":null,"technotype":8,"projects":[2],"vms":[]},
        {"id":4,"name":"memcached","dockercompose":null,"technotype":7,"projects":[1],"vms":[1,2,6]},
        {"id":5,"name":"redis","dockercompose":null,"technotype":7,"projects":[1,2,3],"vms":[1,2,3,6]},
        {"id":6,"name":"varnish","dockercompose":null,"technotype":1,"projects":[1,2,3,4,5,6],"vms":[1,2,3,4,5,6]},
        {"id":7,"name":"mysql","dockercompose":null,"technotype":4,"projects":[1,3,5],"vms":[1,2,3,4,6]},
        {"id":8,"name":"nodejs-0.10","dockercompose":null,"technotype":5,"projects":[],"vms":[]},
        {"id":9,"name":"nodejs-0.12","dockercompose":null,"technotype":5,"projects":[],"vms":[]},
        {"id":10,"name":"nodejs-4","dockercompose":null,"technotype":5,"projects":[1,2,3,4,5,6],"vms":[1,2,3,4,5,6]},
        {"id":11,"name":"nodejs-5","dockercompose":null,"technotype":5,"projects":[],"vms":[]},
        {"id":12,"name":"mongodb-2.6","dockercompose":null,"technotype":3,"projects":[2],"vms":[]},
        {"id":13,"name":"mongodb-3.0","dockercompose":null,"technotype":3,"projects":[],"vms":[]},
        {"id":14,"name":"mongodb-3.2","dockercompose":null,"technotype":3,"projects":[],"vms":[]},
        {"id":15,"name":"java-6","dockercompose":null,"technotype":9,"projects":[],"vms":[]},
        {"id":16,"name":"java-7","dockercompose":null,"technotype":9,"projects":[],"vms":[]},
        {"id":17,"name":"java-8","dockercompose":null,"technotype":9,"projects":[],"vms":[]}
      ]
    });
  });

  technosRouter.get('/:id', function(req, res) {
    res.send({
      'techno':{
        id: req.params.id
      }
    });
  });

  app.use('/api/v1/technos', technosRouter);
};
