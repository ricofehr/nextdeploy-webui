// Ember model for hpmessage object
var Hpmessage = DS.Model.extend({
  title: DS.attr('string'),
  message: DS.attr('string')
});

module.exports = Hpmessage;