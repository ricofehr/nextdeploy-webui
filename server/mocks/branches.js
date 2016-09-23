/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var branchesRouter = express.Router();

  branchesRouter.get('/:id', function(req, res) {
    switch(req.params.id) {
      case '1-master':
        res.send({"branche":{"id":"1-master","name":"master","commits":["1-master-dda0cdb59073b669f67b0b0e1a6e852a2a8d4218"],"project":1}});
        break;
      case '2-master':
        res.send({"branche":{"id":"2-master","name":"master","commits":["2-master-358077869eafc57a5d1e87bc0c7b17d7a73bac70"],"project":2}});
        break;
      case '3-master':
        res.send({"branche":{"id":"3-master","name":"master","commits":["3-master-28fb9dc5ea9bd6a334ef0c25ccf24917396fd1e1"],"project":3}});
        break;
      case '4-master':
        res.send({"branche":{"id":"4-master","name":"master","commits":["4-master-3e04c66d36d0f893485f2d49d973d693f63eef29"],"project":4}});
        break;
      case '5-master':
        res.send({"branche":{"id":"5-master","name":"master","commits":["5-master-88227772f241958c7efb2708b9b0d1956a3c3e15"],"project":5}});
        break;
      case '6-master':
        res.send({"branche":{"id":"6-master","name":"master","commits":["6-master-5fa7c7269d0dfba4e09528de60e443065e4c8cfb"],"project":6}});
        break;
      case '1-develop':
        res.send({"branche":{"id":"1-develop","name":"develop","commits":["1-develop-dda0cdb59073b669f67b0b0e1a6e852a2a8d4218"],"project":1}});
        break;
      case '2-develop':
        res.send({"branche":{"id":"2-develop","name":"develop","commits":["2-develop-358077869eafc57a5d1e87bc0c7b17d7a73bac70"],"project":2}});
        break;
      case '3-develop':
        res.send({"branche":{"id":"3-develop","name":"develop","commits":["3-develop-28fb9dc5ea9bd6a334ef0c25ccf24917396fd1e1"],"project":3}});
        break;
      case '4-develop':
        res.send({"branche":{"id":"4-develop","name":"develop","commits":["4-develop-3e04c66d36d0f893485f2d49d973d693f63eef29"],"project":4}});
        break;
      case '5-develop':
        res.send({"branche":{"id":"5-develop","name":"develop","commits":["5-develop-88227772f241958c7efb2708b9b0d1956a3c3e15"],"project":5}});
        break;
      case '6-develop':
        res.send({"branche":{"id":"6-develop","name":"develop","commits":["6-develop-5fa7c7269d0dfba4e09528de60e443065e4c8cfb"],"project":6}});
        break;
    }
  });

  app.use('/api/v1/branches', branchesRouter);
};
