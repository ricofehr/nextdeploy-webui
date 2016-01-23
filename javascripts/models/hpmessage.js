// Ember model for hpmessage object
var Hpmessage = DS.Model.extend({
  title: DS.attr('string'),
  message: DS.attr('string'),
  ordering: DS.attr('number')
});

module.exports = Hpmessage;