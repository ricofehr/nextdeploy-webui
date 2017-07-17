/**
 *  technos mock on server side
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Techno
 *  @namespace mock
 *  @module nextdeploy
 */
module.exports = function(app) {
  var express = require('express');
  var technosRouter = express.Router();

  /**
   *  Mock technos list request
   *
   *  @method get:/
   */
  technosRouter.get('/', function(req, res) {
    res.send({
      'technos':[
        {
          "id":1,"name":"apache","dockercompose":null,"playbook":null,"technotype":2,
          "projects":[1,2,3,4,5,6],"vms":[1,2,3,4,5,6],"supervises":[3,9,15,20,24,27]
        },
        {
          "id":2,"name":"rabbitmq","dockercompose":null,"playbook":null,"technotype":6,
          "projects":[2],"vms":[],"supervises":[]
        },
        {
          "id":3,"name":"elasticsearch","dockercompose":null,"playbook":null,"technotype":8,
          "projects":[2],"vms":[],"supervises":[]
        },
        {
          "id":4,"name":"memcached","dockercompose":null,"playbook":null,"technotype":7,
          "projects":[1],"vms":[1,2,6],"supervises":[6,12,30]
        },
        {
          "id":5,"name":"redis","dockercompose":null,"playbook":null,"technotype":7,
          "projects":[1,2,3],"vms":[1,2,3,6],"supervises":[5,11,17,29]
        },
        {
          "id":6,"name":"varnish","dockercompose":null,"playbook":null,"technotype":1,
          "projects":[1,2,3,4,5,6],"vms":[1,2,3,4,5,6],"supervises":[1,7,13,22,25]
        },
        {
          "id":7,"name":"mysql","dockercompose":null,"playbook":null,"technotype":4,
          "projects":[1,3,5],"vms":[1,2,3,4,6],"supervises":[4,10,16,21,28]
        },
        {
          "id":8,"name":"nodejs-0.10","dockercompose":null,"playbook":null,"technotype":5,
          "projects":[],"vms":[],"supervises":[]
        },
        {
          "id":9,"name":"nodejs-0.12","dockercompose":null,"playbook":null,"technotype":5,
          "projects":[],"vms":[],"supervises":[]
        },
        {
          "id":10,"name":"nodejs-4","dockercompose":null,"playbook":null,"technotype":5,
          "projects":[1,2,3,4,5,6],"vms":[1,2,3,4,5,6],"supervises":[2,8,14,19,23,26]
        },
        {
          "id":11,"name":"nodejs-5","dockercompose":null,"playbook":null,"technotype":5,
          "projects":[],"vms":[],"supervises":[]
        },
        {
          "id":12,"name":"mongodb-2.6","dockercompose":null,"playbook":null,"technotype":3,
          "projects":[2],"vms":[],"supervises":[]
        },
        {
          "id":13,"name":"mongodb-3.0","dockercompose":null,"playbook":null,"technotype":3,
          "projects":[],"vms":[],"supervises":[]
        },
        {
          "id":14,"name":"mongodb-3.2","dockercompose":null,"playbook":null,"technotype":3,
          "projects":[],"vms":[],"supervises":[]
        },
        {
          "id":15,"name":"java-6","dockercompose":null,"playbook":null,"technotype":9,
          "projects":[],"vms":[],"supervises":[]
        },
        {
          "id":16,"name":"java-7","dockercompose":null,"playbook":null,"technotype":9,
          "projects":[],"vms":[],"supervises":[]
        },
        {
          "id":17,"name":"java-8","dockercompose":null,"playbook":null,"technotype":9,
          "projects":[],"vms":[],"supervises":[]
        }
      ]
    });
  });

  /**
   *  Mock show techno request
   *
   *  @method get:/$id
   */
  technosRouter.get('/:id', function(req, res) {
    res.send({
      'techno':{
        id: req.params.id
      }
    });
  });

  app.use('/api/v1/technos', technosRouter);
};
