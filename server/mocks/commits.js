/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var commitsRouter = express.Router();
  var branch_id = '';

  commitsRouter.get('/:id', function(req, res) {
    switch(req.params.id) {
      case '1-master-dda0cdb59073b669f67b0b0e1a6e852a2a8d4218':
        res.send({"commit":{"id":"1-master-dda0cdb59073b669f67b0b0e1a6e852a2a8d4218","commit_hash":"dda0cdb59073b669f67b0b0e1a6e852a2a8d4218","short_id":"dda0cdb5","title":"Init project with a lot of bundles and custom javascript for header title","author_name":"root","author_email":"admin@example.com","message":"Init project with a lot of bundles and custom javascript for header title, hd images and lot of external links\n","created_at":new Date().toLocaleString(),"branche":"1-master","vms":[2,3,6]}});
        break;
      case '2-master-358077869eafc57a5d1e87bc0c7b17d7a73bac70':
        res.send({"commit":{"id":"2-master-358077869eafc57a5d1e87bc0c7b17d7a73bac70","commit_hash":"358077869eafc57a5d1e87bc0c7b17d7a73bac70","short_id":"35807786","title":"Init project\n","author_name":"root","author_email":"admin@example.com","message":"Init project\n","created_at":new Date().toLocaleString(),"branche":"2-master","vms":[]}});
        break;
      case '3-master-28fb9dc5ea9bd6a334ef0c25ccf24917396fd1e1':
        res.send({"commit":{"id":"3-master-28fb9dc5ea9bd6a334ef0c25ccf24917396fd1e1","commit_hash":"28fb9dc5ea9bd6a334ef0c25ccf24917396fd1e1","short_id":"28fb9dc5","title":"Init project\n","author_name":"root","author_email":"admin@example.com","message":"Init projects\n","created_at":new Date().toLocaleString(),"branche":"3-master","vms":[]}});
        break;
      case '4-master-3e04c66d36d0f893485f2d49d973d693f63eef29':
        res.send({"commit":{"id":"4-master-3e04c66d36d0f893485f2d49d973d693f63eef29","commit_hash":"3e04c66d36d0f893485f2d49d973d693f63eef29","short_id":"3e04c66d","title":"Init project","author_name":"root","author_email":"admin@example.com","message":"Init project\n","created_at":new Date().toLocaleString(),"branche":"4-master","vms":[]}});
        break;
      case '5-master-88227772f241958c7efb2708b9b0d1956a3c3e15':
        res.send({"commit":{"id":"5-master-88227772f241958c7efb2708b9b0d1956a3c3e15","commit_hash":"88227772f241958c7efb2708b9b0d1956a3c3e15","short_id":"88227772","title":"Init project","author_name":"root","author_email":"admin@example.com","message":"Init project\n","created_at":new Date().toLocaleString(),"branche":"5-master","vms":[4]}});
        break;
      case '6-master-5fa7c7269d0dfba4e09528de60e443065e4c8cfb':
        res.send({"commit":{"id":"6-master-5fa7c7269d0dfba4e09528de60e443065e4c8cfb","commit_hash":"5fa7c7269d0dfba4e09528de60e443065e4c8cfb","short_id":"5fa7c726","title":"Init project","author_name":"root","author_email":"admin@example.com","message":"Init project\n","created_at":new Date().toLocaleString(),"branche":"6-master","vms":[]}});
        break;
      case '1-develop-dda0cdb59073b669f67b0b0e1a6e852a2a8d4218':
        res.send({"commit":{"id":"1-develop-dda0cdb59073b669f67b0b0e1a6e852a2a8d4218","commit_hash":"dda0cdb59073b669f67b0b0e1a6e852a2a8d4218","short_id":"dda0cdb5","title":"Init project","author_name":"root","author_email":"admin@example.com","message":"Init project\n","created_at":new Date().toLocaleString(),"branche":"1-develop","vms":[1]}});
        break;
      case '2-develop-358077869eafc57a5d1e87bc0c7b17d7a73bac70':
        res.send({"commit":{"id":"2-develop-358077869eafc57a5d1e87bc0c7b17d7a73bac70","commit_hash":"358077869eafc57a5d1e87bc0c7b17d7a73bac70","short_id":"35807786","title":"Init project","author_name":"root","author_email":"admin@example.com","message":"Init project\n","created_at":new Date().toLocaleString(),"branche":"2-develop","vms":[]}});
        break;
      case '3-develop-28fb9dc5ea9bd6a334ef0c25ccf24917396fd1e1':
        res.send({"commit":{"id":"3-develop-28fb9dc5ea9bd6a334ef0c25ccf24917396fd1e1","commit_hash":"28fb9dc5ea9bd6a334ef0c25ccf24917396fd1e1","short_id":"28fb9dc5","title":"Init project","author_name":"root","author_email":"admin@example.com","message":"Init project\n","created_at":new Date().toLocaleString(),"branche":"3-develop","vms":[]}});
        break;
      case '4-develop-3e04c66d36d0f893485f2d49d973d693f63eef29':
        res.send({"commit":{"id":"4-develop-3e04c66d36d0f893485f2d49d973d693f63eef29","commit_hash":"3e04c66d36d0f893485f2d49d973d693f63eef29","short_id":"3e04c66d","title":"Init project","author_name":"root","author_email":"admin@example.com","message":"Init project\n","created_at":new Date().toLocaleString(),"branche":"4-develop","vms":[5]}});
        break;
      case '5-develop-88227772f241958c7efb2708b9b0d1956a3c3e15':
        res.send({"commit":{"id":"5-develop-88227772f241958c7efb2708b9b0d1956a3c3e15","commit_hash":"88227772f241958c7efb2708b9b0d1956a3c3e15","short_id":"88227772","title":"Init project","author_name":"root","author_email":"admin@example.com","message":"Init project\n","created_at":new Date().toLocaleString(),"branche":"5-develop","vms":[]}});
        break;
      case '6-develop-5fa7c7269d0dfba4e09528de60e443065e4c8cfb':
        res.send({"commit":{"id":"6-develop-5fa7c7269d0dfba4e09528de60e443065e4c8cfb","commit_hash":"5fa7c7269d0dfba4e09528de60e443065e4c8cfb","short_id":"5fa7c726","title":"Init project","author_name":"root","author_email":"admin@example.com","message":"Init project\n","created_at":new Date().toLocaleString(),"branche":"6-develop","vms":[]}});
        break;
      default:
        branch_id = req.params.id.split('-');
        branch_id.pop();
        res.send({"commit":{"id":req.params.id,"commit_hash":req.params.id.replace(/^.*-/g, ''),"short_id":req.params.id.replace(/^.*-/g, '').substr(0,6),"title":"Init project","author_name":"root","author_email":"admin@example.com","message":"Init project\n","created_at":new Date().toLocaleString(),"branche":branch_id.join('-'),"vms":[]}});
        break;
    }
  });

  app.use('/api/v1/commits', commitsRouter);
};
