/**
 *  hpmessages mock on server side
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Hpmessage
 *  @namespace mock
 *  @module nextdeploy
 */
module.exports = function(app) {
  var express = require('express');
  var hpmessagesRouter = express.Router();

  /**
   *  Mock hpmessages list request
   *
   *  @method get:/
   */
  hpmessagesRouter.get('/', function(req, res) {
    res.send({
      'hpmessages':[
        {
          "id":3,
          "title":"New Release v1.9",
          "message":"A new release was deployed: topic field for vm, better drupal support," +
                    " and more  (view <a href=\"https://bit.ly/2i9yopn\" target=\"_blank\">here</a>)",
          "access_level_min":20,
          "access_level_max":50,
          "expiration":0,
          "ordering":2514,
          "is_twitter":null,
          "date":"9 January 2017"
        },
        {
          "id":2,
          "title":"Cli Update",
          "message":"With the new v1.6 Release, please update your ndeploy cli command" +
                    "for enjoy the new \"ndeploy docker\" command<br/>Please run \"ndeploy " +
                    "upgrade\" on your favorite terminal<br><br><video controls>" +
                    "<source src=\"https://nextdeploy.io/videos/nd/ndeploydocker.mp4\" " +
                    "type=\"video/mp4\"></video>",
          "access_level_min":30,
          "access_level_max":50,
          "expiration":0,
          "ordering":2313,
          "is_twitter":null,
          "date":"22 August 2016"
        },
        {
          "id":1,
          "title":"@NextDeploy",
          "message":"\u003ca class=\"twitter-timeline\" href=\"https://twitter.com/nextdeploy\" " +
                    "data-widget-id=\"690883407518273536\"\u003eTweets by @nextdeploy\u003c/a\u003e",
          "access_level_min":10,
          "access_level_max":50,
          "expiration":0,
          "ordering":-100,
          "is_twitter":true,
          "date":"19 June 2016"
        }
      ]
    });
  });

  app.use('/api/v1/hpmessages', hpmessagesRouter);
};
