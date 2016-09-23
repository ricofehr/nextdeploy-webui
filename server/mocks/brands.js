/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var brandsRouter = express.Router();

  brandsRouter.get('/', function(req, res) {
    res.send({
      'brands':[
        {"id":1,"name":"Test Company","logo":null,"projects":[1,5]},
        {"id":2,"name":"YourCompany","logo":null,"projects":[2,6]},
        {"id":3,"name":"HisCompany","logo":null,"projects":[3,4]}
      ]
    });
  });

  brandsRouter.post('/', function(req, res) {
    var brand = req.body.brand;

    res.status(200).send({
      "brand":{
        "id": Math.floor((Math.random() * 1000) + 4),
        "name": brand.name,
        "logo": null,
        "projects": []
      }
    });
  });

  brandsRouter.get('/:id', function(req, res) {
    res.send({
      'brand':{
        id: req.params.id
      }
    });
  });

  brandsRouter.put('/:id', function(req, res) {
    var brand = req.body.brand;

    res.status(200).send({
      "brand":{
        "id": req.params.id,
        "name": brand.name,
        "logo":null,
        "projects":brand.projects
      }
    });
  });

  brandsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v1/brands', require('body-parser').json(), brandsRouter);
};
