/**
 *  Frameworks mock on server side
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Framework
 *  @namespace mock
 *  @module nextdeploy
 */
module.exports = function(app) {
  var express = require('express');
  var frameworksRouter = express.Router();

  /**
   *  Mock frameworks list request
   *
   *  @method get:/
   */
  frameworksRouter.get('/', function(req, res) {
    res.send({
      'frameworks':[
        {
          "id":1,"name":"Symfony2","publicfolder":"web/",
          "rewrites":"RewriteEngine On\\nRewriteRule ^/?$ /app_dev.php [L]\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_URI} !=/server-status\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_FILENAME} !-f\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_FILENAME} !-d\\n" +
                     "RewriteRule .* /app_dev.php [L]\\n",
          "dockercompose":null,"endpoints":[6],"uris":[3]
        },
        {
          "id":2,"name":"Symfony3","publicfolder":"web/",
          "rewrites":"RewriteEngine On\\nRewriteRule ^/?$ /app_dev.php [L]\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_URI} !=/server-status\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_FILENAME} !-f\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_FILENAME} !-d\\n" +
                     "RewriteRule .* /app_dev.php [L]\\n",
          "dockercompose":null,"endpoints":[7],"uris":[]
        },
        {
          "id":3,"name":"Drupal7","publicfolder":"",
          "rewrites":"RewriteEngine On\\nRewriteRule ^/?$ /index.php [L]\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_FILENAME} !-f\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_FILENAME} !-d\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_URI} !=/favicon.ico\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_URI} !=/server-status\\n" +
                     "RewriteRule ^ index.php [L]\\n",
          "dockercompose":null,"endpoints":[],"uris":[]
        },
        {
          "id":4,"name":"Drupal8","publicfolder":"",
          "rewrites":"RewriteEngine On\\nRewriteRule ^/?$ /index.php [L]\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_FILENAME} !-f\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_FILENAME} !-d\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_URI} !=/favicon.ico\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_URI} !=/server-status\\n" +
                     "RewriteRule ^ index.php [L]\\n",
          "dockercompose":null,"endpoints":[5],"uris":[1,2,7]
        },
        {
          "id":5,"name":"Wordpress-4.5.2","publicfolder":"",
          "rewrites":"RewriteEngine On\\nRewriteRule ^/?$ /index.php [L]\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_URI} !=/server-status\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_FILENAME} !-f\\n" +
                     "RewriteCond %%{literal('%')}{REQUEST_FILENAME} !-d\\n" +
                     "RewriteRule .* /index.php [L]\\n",
          "dockercompose":null,"endpoints":[2],"uris":[4]
        },
        {
          "id":6,"name":"NodeJS","publicfolder":"","rewrites":"",
          "dockercompose":null,"endpoints":[1],"uris":[]
        },
        {
          "id":7,"name":"ReactJS","publicfolder":"","rewrites":"",
          "dockercompose":null,"endpoints":[],"uris":[]
        },
        {
          "id":8,"name":"Static","publicfolder":"","rewrites":"",
          "dockercompose":null,"endpoints":[3,4],"uris":[5,6]
        },
        {
          "id":9,"name":"NoWeb","publicfolder":"","rewrites":"",
          "dockercompose":null,"endpoints":[],"uris":[]
        }
      ]
    });
  });

  /**
   *  Mock show framework request
   *
   *  @method get:/$id
   */
  frameworksRouter.get('/:id', function(req, res) {
    res.send({
      'framework':{
        id: req.params.id
      }
    });
  });

  app.use('/api/v1/frameworks', frameworksRouter);
};
