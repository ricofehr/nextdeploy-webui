/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var hpmessagesRouter = express.Router();

  hpmessagesRouter.get('/', function(req, res) {
    res.send({
      'hpmessages':[
        {"id":1,"title":"@NextDeploy","date":"19 June 2016","message":"\u003ca class=\"twitter-timeline\" href=\"https://twitter.com/nextdeploy\" data-widget-id=\"690883407518273536\"\u003eTweets by @nextdeploy\u003c/a\u003e","ordering":-100,"is_twitter":true}
      ]
    });
  });

  app.use('/api/v1/hpmessages', hpmessagesRouter);
};
