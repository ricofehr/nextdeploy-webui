// Ember model for techno object
var Techno = DS.Model.extend({
  name: DS.attr('string'),
  projects: DS.hasMany('project', {async: true, inverse: 'technos'})
});

module.exports = Techno;

