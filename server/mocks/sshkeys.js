/**
 *  sshkeys mock on server side
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Sshkey
 *  @namespace mock
 *  @module nextdeploy
 */
module.exports = function(app) {
  var express = require('express');
  var sshkeysRouter = express.Router();

  /**
   *  Mock sshkeys list request
   *
   *  @method get:/
   */
  sshkeysRouter.get('/', function(req, res) {
    res.send({
      'sshkeys':[
        {
          "id":1,
          "key":"ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAIEAxdvI9J3us9qsviBy01t/627M9SD" +
                "iOpdsqdayuYYUh9TPKGziqr1W/FciDTock8G6PaenQyFhCXkYpWunqPz9dE/272A6" +
                "NfOTirMAZfScZJ0+MRzmfvCSlfLoONjz1QGhrUGYvgfgg91e7HnRnrHnM/Mj0NTbh8" +
                "eaEAaRgg8= usera@os.nextdeploy",
          "name":"userakey","gitlab_id":null,"user":1
        }
      ]
    });
  });

  /**
   *  Mock new sshkey request
   *
   *  @method post:/
   */
  sshkeysRouter.post('/', function(req, res) {
    var sshkey = req.body.sshkey;

    res.status(200).send({
      "sshkey":{
        "id": Math.floor((Math.random() * 1000) + 2),
        "key": sshkey.key,
        "name": sshkey.name,
        "gitlab_id": null,
        "user": sshkey.user
      }
    });
  });

  /**
   *  Mock show sshkey request
   *
   *  @method get:/$id
   */
  sshkeysRouter.get('/:id', function(req, res) {
    res.send({
      'sshkey':{
        id: req.params.id
      }
    });
  });

  /**
   *  Mock change sshkey request
   *
   *  @method put:/$id
   */
  sshkeysRouter.put('/:id', function(req, res) {
    var sshkey = req.body.sshkey;

    res.status(200).send({
      "sshkey":{
        "id": req.params.id,
        "key": sshkey.key,
        "name": sshkey.name,
        "gitlab_id": null,
        "user": sshkey.user
      }
    });
  });

  /**
   *  Mock delete sshkey request
   *
   *  @method delete:/$id
   */
  sshkeysRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v1/sshkeys', require('body-parser').json(), sshkeysRouter);
};
