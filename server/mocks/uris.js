/**
 *  uris mock on server side
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Uri
 *  @namespace mock
 *  @module nextdeploy
 */
module.exports = function(app) {
  var express = require('express');
  var urisRouter = express.Router();

  /**
   *  Mock uris list request
   *
   *  @method get:/
   */
  urisRouter.get('/', function(req, res) {
    res.send({
      'uris':[
        {
          "id":1,"absolute":"3-www-drupalmycompany-com-74486777.os.nextdeploy.local",
          "is_main":true,"path":"server","envvars":"","aliases":"","is_redir_alias":false,
          "ipfilter":"","port":8080,"customvhost":"","is_sh":false,"is_import":true,
          "is_ssl": false,"vm":1,"framework":4
        },
        {
          "id":2,"absolute":"2-www-drupalmycompany-com-74475477.os.nextdeploy.local",
          "is_main":true,"path":"server","envvars":"","aliases":"","is_redir_alias":false,
          "ipfilter":"","port":8080,"customvhost":"","is_sh":false,"is_import":true,
          "is_ssl": false,"vm":2,"framework":4
        },
        {
          "id":3,"absolute":"3-www-symfonyhiscompany-com-76475472.os.nextdeploy.local",
          "is_main":true,"path":"server","envvars":"",
          "aliases":"sf2s.3-www-symfonyhiscompany-com-76475472.os.nextdeploy.local",
          "is_redir_alias":true,"ipfilter":"","port":8080,"customvhost":"",
          "is_sh":false,"is_import":true,"is_ssl": false,"vm":3,"framework":1
        },
        {
          "id":4,"absolute":"1-www-wordpressmycompany-com-72475432.os.nextdeploy.local",
          "is_main":true,"path":"server","envvars":"","aliases":"","is_redir_alias":false,
          "ipfilter":"","port":8080,"customvhost":"","is_sh":false,"is_import":true,
          "is_ssl": false,"vm":4,"framework":5
        },
        {
          "id":5,"absolute":"html.1-www-wordpressmycompany-com-72475432.os.nextdeploy.local",
          "is_main":false,"path":"server","envvars":"","aliases":"","is_redir_alias":false,
          "ipfilter":"","port":8080,"customvhost":"","is_sh":false,"is_import":false,
          "is_ssl": false,"vm":4,"framework":8
        },
        {
          "id":6,"absolute":"2-www-statichiscompany-com-72495402.os.nextdeploy.local",
          "is_main":true,"path":"server","envvars":"","aliases":"","is_redir_alias":false,
          "ipfilter":"","port":8080,"customvhost":"","is_sh":false,"is_import":false,
          "is_ssl": false,"vm":5,"framework":8
        },
        {
          "id":7,"absolute":"4-www-drupalmycompany-com-75685412.os.nextdeploy.local",
          "is_main":true,"path":"server","envvars":"","aliases":"","is_redir_alias":false,
          "ipfilter":"","port":8080,"customvhost":"","is_sh":false,"is_import":true,
          "is_ssl": false,"vm":6,"framework":4
        }
      ]
    });
  });

  /**
   *  Mock new uri request
   *
   *  @method post:/
   */
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
          "is_import": uri.is_import,
          "is_ssl": uri.is_ssl,
          "is_redir_alias": uri.is_redir_alias,
          "vm": uri.vm,
          "framework":uri.framework
        }
    });
  });

  /**
   *  Mock show uri request
   *
   *  @method get:/$id
   */
  urisRouter.get('/:id', function(req, res) {
    res.send({
      'uri':{
        id: req.params.id
      }
    });
  });

  /**
   *  Mock change uri request
   *
   *  @method put:/$id
   */
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
          "is_import": uri.is_import,
          "is_ssl": uri.is_ssl,
          "is_redir_alias": uri.is_redir_alias,
          "vm": uri.vm,
          "framework":uri.framework
        }
    });
  });

  /**
   *  Mock delete uri request
   *
   *  @method delete:/$id
   */
  urisRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  /**
   *  Mock import request on uri
   *
   *  @method post:/$id/import
   */
  urisRouter.post('/:id/import', function(req, res) {
    res.status(200).end();
  });

  /**
   *  Mock export request on uri
   *
   *  @method post:/$id/export
   */
  urisRouter.post('/:id/export', function(req, res) {
    res.status(200).end();
  });

  /**
   *  Mock npm request on uri
   *
   *  @method post:/$id/npm
   */
  urisRouter.post('/:id/npm', function(req, res) {
    res.status(200).send('> Project@1.0.0 build /var/www/www.project.com/html\n' +
          '> npm run wp && grunt s && grunt build\n\n\n' +
          '> Project@1.0.0 wp /var/www/www.project.com/html\n' +
          '> webpack --config webpack.config.prod.js\n\n' +
          'Hash: d312160bbec914c9f0aaa\n' +
          'Version: webpack 1.13.2\n' +
          'Time: 10772ms\n' +
          '    Asset     Size  Chunks             Chunk Names\n' +
          'bundle.js  1.51 MB       0  [emitted]  main\n' +
          '    [0] multi main 40 bytes {0} [built]\n' +
          '    + 346 hidden modules\n' +
          'Running "sass:dev" (sass) task\n\n' +
          'Running "cmq:prod" (cmq) task\n\n' +
          'File styles/all.min.css created.\n\n' +
          'File ./styles/fiche-produit-print.css found.\n' +
          'File styles/fiche-produit-print.css created.\n\n' +
          'File ./styles/wishlist-print.css found.\n' +
          'File styles/wishlist-print.css created.\n\n' +
          'Running "postcss:prod" (postcss) task\n' +
          'processed stylesheet created.\n\n' +
          'Running "uglify:prod" (uglify) task\n' +
          'File scripts/vendors.min.js created: 942.4 kB → 461.12 kB\n' +
          'File scripts/bundle.min.js created: 1.51 MB → 151.89 kB\n' +
          'files created.\n\n' +
          'Done, without errors.\n' +
          'files created.\n\n' +
          'Done, without errors');
  });

  /**
   *  Mock build nodejs request on uri
   *
   *  @method post:/$id/nodejs
   */
  urisRouter.post('/:id/nodejs', function(req, res) {
    res.status(200).end();
  });

  /**
   *  Mock build reactjs request on uri
   *
   *  @method post:/$id/reactjs
   */
  urisRouter.post('/:id/reactjs', function(req, res) {
    res.status(200).end();
  });

  /**
   *  Mock maven request on uri
   *
   *  @method post:/$id/mvn
   */
  urisRouter.post('/:id/mvn', function(req, res) {
    res.status(200).end();
  });

  /**
   *  Mock composer request on uri
   *
   *  @method post:/$id/composer
   */
  urisRouter.post('/:id/composer', function(req, res) {
    res.status(200).send('All settings correct for using Composer\n' +
            'Downloading...\n\n' +
            'Composer (version 1.3.1) successfully installed to: server/composer.phar\n' +
            'Use it: php composer.phar\n\n' +
            'Loading composer repositories with package information\n' +
            'Installing dependencies (including require-dev) from lock file\n' +
            'Nothing to install or update');
  });

  /**
   *  Mock drush request on uri
   *
   *  @method post:/$id/drush
   */
  urisRouter.post('/:id/drush', function(req, res) {
    res.status(200).send('Cache rebuild complete.                                                     [ok]');
  });

  /**
   *  Mock symfony cmd request on uri
   *
   *  @method post:/$id/sfcmd
   */
  urisRouter.post('/:id/sfcmd', function(req, res) {
    res.status(200).send('Trying to install assets as symbolic links.\n' +
          'Installing assets for Symfony\Bundle\FrameworkBundle into web/bundles/framework\n' +
          'The assets were installed using symbolic links.\n' +
          'Installing assets for Sonata\CoreBundle into web/bundles/sonatacore\n' +
          'The assets were installed using symbolic links.\n' +
          'Installing assets for Sonata\AdminBundle into web/bundles/sonataadmin\n' +
          'The assets were installed using symbolic links.\n' +
          'Installing assets for Carrefour\FrontBundle into web/bundles/carrefourfront\n' +
          'The assets were installed using symbolic links.\n' +
          'Installing assets for Carrefour\MainBundle into web/bundles/carrefourmain\n' +
          'The assets were installed using symbolic links.\n' +
          'Installing assets for Sensio\Bundle\DistributionBundle into web/bundles/sensiodistribution\n' +
          'The assets were installed using symbolic links.\n\n' +
          'Dumping all dev assets.\n' +
          'Debug mode is on.\n\n\n' +
          'Clearing the cache for the dev environment with debug true');
  });

  /**
   *  Mock list-scripts request on uri
   *
   *  @method post:/$id/listscript
   */
  urisRouter.post('/:id/listscript', function(req, res) {
    res.status(200).end();
  });

  /**
   *  Mock execute script request on uri
   *
   *  @method post:/$id/script
   */
  urisRouter.post('/:id/script', function(req, res) {
    res.status(200).end();
  });

  /**
   *  Mock logs request on uri
   *
   *  @method post:/$id/logs
   */
  urisRouter.post('/:id/logs', function(req, res) {
    res.status(200).send('2017-01-20 13:41:23] event.DEBUG: Notified event "console.terminate" to listener "Symfony\Bridge\Monolog\Handler\ConsoleHandler::onTerminate". [] []\n' +
              '[2017-01-20 13:41:24] event.DEBUG: Notified event "console.command" to listener "Symfony\Component\HttpKernel\EventListener\DebugHandlersListener::configure". [] []\n' +
              '[2017-01-20 13:41:24] event.DEBUG: Notified event "console.command" to listener "Symfony\Bridge\Monolog\Handler\ConsoleHandler::onCommand". [] []\n' +
              '[2017-01-20 13:41:24] event.DEBUG: Notified event "console.command" to listener "Symfony\Bridge\Monolog\Handler\ConsoleHandler::onCommand". [] []\n' +
              '[2017-01-20 13:41:24] event.DEBUG: Notified event "console.terminate" to listener "Symfony\Bundle\SwiftmailerBundle\EventListener\EmailSenderListener::onTerminate". [] []\n' +
              '[2017-01-20 13:41:24] event.DEBUG: Notified event "console.terminate" to listener "Symfony\Bridge\Monolog\Handler\ConsoleHandler::onTerminate". [] []\n' +
              '[2017-01-20 13:41:24] event.DEBUG: Notified event "console.terminate" to listener "Symfony\Bridge\Monolog\Handler\ConsoleHandler::onTerminate". [] []\n');
  });

  /**
   *  Mock clearvarnish request on uri
   *
   *  @method post:/$id/clearvarnish
   */
  urisRouter.post('/:id/clearvarnish', function(req, res) {
    res.status(200).send('Flushed for 92-www-project-fr-76807700.os.nextdeploy');
  });

  /**
   *  Mock siteinstall request on uri
   *
   *  @method post:/$id/siteinstall
   */
  urisRouter.post('/:id/siteinstall', function(req, res) {
    res.status(200).send('You are about to DROP all tables in your \'server\' database. Do you want to continue? (y/n): y\n' +
              'Starting Drupal installation. This takes a while. Consider using the [ok]\n' +
              '--notify global option. \n' +
              'Installation complete.  User name: drive20  User password: 16dacia   [ok]\n' +
              'This site has only a single language enabled. Add at least one more  [warning]\n' +
              'language in order to translate content.\n' +
              'Enable translation for content types, taxonomy vocabularies,         [warning]\n' +
              'accounts, or any other element you wish to translate.\n' +
              'Site frontpage switched to empty page.                               [status]\n' +
              'Congratulations, you installed Drupal!                               [status]');
  });

  app.use('/api/v1/uris', require('body-parser').json(), urisRouter);
};
