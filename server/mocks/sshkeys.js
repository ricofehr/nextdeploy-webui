/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var sshkeysRouter = express.Router();

  sshkeysRouter.get('/', function(req, res) {
    res.send({
      'sshkeys':[
        {"id":1,"key":"ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAIEAxdvI9J3us9qsviBy01t/627M9SDiOpdsqdayuYYUh9TPKGziqr1W/FciDTock8G6PaenQyFhCXkYpWunqPz9dE/272A6NfOTirMAZfScZJ0+MRzmfvCSlfLoONjz1QGhrUGYvgfgg91e7HnRnrHnM/Mj0NTbh8eaEAaRgg8= usera@os.nextdeploy","name":"userakey","gitlab_id":null,"user":1}
      ]
    });
  });

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

  sshkeysRouter.get('/:id', function(req, res) {
    res.send({
      'sshkey':{
        id: req.params.id
      }
    });
  });

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

  sshkeysRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v1/sshkeys', require('body-parser').json(), sshkeysRouter);
};
