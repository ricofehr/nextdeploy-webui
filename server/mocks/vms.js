/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var vmsRouter = express.Router();

  vmsRouter.get('/', function(req, res) {
    res.send({
      'vms':[
        {"id":1,"nova_id":"0d139f2a-1236-44b3-9870-f39aafb3adee","floating_ip":"192.168.11.11","vnc_url":"/images/vnc.png","created_at":new Date().toLocaleString(),"name":"3-www-drupalmycompany-com-74486777.os.nextdeploy.local","topic":"develop","status":460,"is_auth":true,"htlogin":"modem","htpassword":"modem","termpassword":null,"layout":"fr","is_prod":false,"is_cached":false,"is_ht":false,"is_ci":false,"is_cors":false,"is_backup":false,"technos":[6,10,1,7,5,4],"uris":[1],"commit":"1-develop-dda0cdb59073b669f67b0b0e1a6e852a2a8d4218","project":1,"vmsize":2,"user":3,"systemimage":1},
        {"id":2,"nova_id":"0d139f2a-1236-44b3-5470-f39aafb3adee","floating_ip":"192.168.11.12","vnc_url":"/images/vnc.png","created_at":new Date().toLocaleString(),"name":"2-www-drupalmycompany-com-74475477.os.nextdeploy.local","topic":"New basket","status":482,"is_auth":true,"htlogin":"modem","htpassword":"modem","termpassword":null,"layout":"fr","is_prod":false,"is_cached":false,"is_ht":false,"is_ci":false,"is_cors":true,"is_backup":false,"technos":[6,10,1,7,5,4],"uris":[2],"commit":"1-master-dda0cdb59073b669f67b0b0e1a6e852a2a8d4218","project":1,"vmsize":2,"user":2,"systemimage":1},
        {"id":3,"nova_id":"0d542f2a-1236-44b3-1270-f39fffb3adee","floating_ip":"192.168.11.13","vnc_url":"/images/vnc.png","created_at":new Date().toLocaleString(),"name":"3-www-symfonyhiscompany-com-76475472.os.nextdeploy.local","topic":"Remove second address","status":513,"is_auth":true,"htlogin":"modem","htpassword":"modem","termpassword":null,"layout":"fr","is_prod":false,"is_cached":false,"is_ht":false,"is_ci":false,"is_cors":false,"is_backup":false,"technos":[6,10,1,7,5],"uris":[3],"commit":"3-master-dda0cdb59073b669f67b0b0e1a6e852a2a8d4218","project":3,"vmsize":2,"user":3,"systemimage":2},
        {"id":4,"nova_id":"0d542f2a-1236-44b3-3470-f19ffca3adee","floating_ip":"192.168.11.14","vnc_url":"/images/vnc.png","created_at":new Date().toLocaleString(),"name":"1-www-wordpressmycompany-com-72475432.os.nextdeploy.local","topic":"master","status":501,"is_auth":true,"htlogin":"modem","htpassword":"modem","termpassword":null,"layout":"fr","is_prod":true,"is_cached":false,"is_ht":false,"is_ci":true,"is_cors":true,"is_backup":false,"technos":[6,10,1,7],"uris":[4,5],"commit":"5-master-88227772f241958c7efb2708b9b0d1956a3c3e15","project":5,"vmsize":2,"user":3,"systemimage":1},
        {"id":5,"nova_id":"0d122f2a-1236-44b3-3440-f19ffca3abce","floating_ip":"192.168.11.15","vnc_url":"/images/vnc.png","created_at":new Date().toLocaleString(),"name":"2-www-statichiscompany-com-72495402.os.nextdeploy.local","topic":"custom topic","status":611,"is_auth":true,"htlogin":"modem","htpassword":"modem","termpassword":null,"layout":"fr","is_prod":false,"is_cached":false,"is_ht":false,"is_ci":true,"is_cors":false,"is_backup":false,"technos":[6,10,1],"uris":[6],"commit":"4-develop-3e04c66d36d0f893485f2d49d973d693f63eef29","project":4,"vmsize":1,"user":2,"systemimage":2},
        {"id":6,"nova_id":"0d342f2a-1236-44b3-3450-f19ffca3bbce","floating_ip":"192.168.11.16","vnc_url":"/images/vnc.png","created_at":new Date().toLocaleString(),"name":"4-www-drupalmycompany-com-75685412.os.nextdeploy.local","topic":"master","status":421,"is_auth":true,"htlogin":"modem","htpassword":"modem","termpassword":null,"layout":"fr","is_prod":false,"is_cached":false,"is_ht":false,"is_ci":false,"is_cors":true,"is_backup":false,"technos":[6,10,1,7,5,4],"uris":[7],"commit":"1-master-dda0cdb59073b669f67b0b0e1a6e852a2a8d4218","project":1,"vmsize":1,"user":4,"systemimage":1}
      ]
    });
  });

  vmsRouter.post('/', function(req, res) {
    var vm = req.body.vm;

    res.send({
      "vm":{
        "id": Math.floor((Math.random() * 1000) + 6),
        "nova_id": null,
        "floating_ip": null,
        "vnc_url": "/images/vnc.png",
        "created_at": new Date().toLocaleString(),
        "name": vm.name,
        "topic": vm.topic,
        "status": null,
        "is_auth": vm.is_auth,
        "htlogin": vm.htlogin,
        "htpassword": vm.htpassword,
        "termpassword": "toto",
        "layout": vm.layout,
        "is_prod": vm.is_prod,
        "is_cached": vm.is_cached,
        "is_ht": vm.is_ht,
        "is_ci": vm.is_ci,
        "is_cors": vm.is_cors,
        "is_backup": vm.is_backup,
        "technos": vm.technos,
        "uris": [],
        "commit": vm.commit,
        "project": vm.project,
        "vmsize": vm.vmsize,
        "user": vm.user,
        "systemimage": vm.systemimage
      }
    });
  });

  vmsRouter.get('/:id', function(req, res) {
    res.send({
      'vm':{
        "id": req.params.id
      }
    });
  });

  vmsRouter.put('/:id', function(req, res) {
    var osid = Math.floor((Math.random() * 899) + 100);
    var ipid = Math.floor((Math.random() * 250) + 2);
    var vm = req.body.vm;

    res.send({
      'vm':{
        "id": req.params.id,
        "nova_id":"0d345f2a-2486-44b3-9" + osid + "-f39ccfb3adee",
        "floating_ip":"192.168.11." + ipid,
        "status": "420",
        "vnc_url": "/images/vnc.png",
        "created_at": vm.created_at,
        "name": vm.name,
        "topic": vm.topic,
        "is_auth": vm.is_auth,
        "htlogin": vm.htlogin,
        "htpassword": vm.htpassword,
        "termpassword": "toto",
        "layout": vm.layout,
        "is_prod": vm.is_prod,
        "is_cached": vm.is_cached,
        "is_ht": vm.is_ht,
        "is_ci": vm.is_ci,
        "is_cors": vm.is_cors,
        "is_backup": vm.is_backup,
        "technos": vm.technos,
        "uris": vm.uris,
        "commit": vm.commit,
        "project": vm.project,
        "vmsize": vm.vmsize,
        "user": vm.user,
        "systemimage": vm.systemimage
      }
    });
  });

  vmsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  vmsRouter.put('/:id/topic', function(req, res) {
    res.status(200).end();
  });

  vmsRouter.post('/:id/togglecached', function(req, res) {
    res.status(200).end();
  });

  vmsRouter.post('/:id/toggleauth', function(req, res) {
    res.status(200).end();
  });

  vmsRouter.post('/:id/toggleht', function(req, res) {
    res.status(200).end();
  });

  vmsRouter.post('/:id/togglebackup', function(req, res) {
    res.status(200).end();
  });

  vmsRouter.post('/:id/toggleci', function(req, res) {
    res.status(200).end();
  });

  vmsRouter.post('/:id/togglecors', function(req, res) {
    res.status(200).end();
  });

  vmsRouter.post('/:id/toggleprod', function(req, res) {
    res.status(200).end();
  });

  vmsRouter.post('/:id/reboot', function(req, res) {
    res.status(200).end();
  });

  vmsRouter.post('/:id/postinstall_display', function(req, res) {
    res.status(200).end();
  });

  vmsRouter.post('/:id/postinstall', function(req, res) {
    res.status(200).end();
  });

  vmsRouter.post('/:id/gitpull', function(req, res) {
    res.status(200).end();
  });

  vmsRouter.post('/:id/logs', function(req, res) {
    res.status(200).end();
  });

  app.use('/api/v1/vms', require('body-parser').json(), vmsRouter);
};
