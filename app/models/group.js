import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  access_level: DS.attr('number'),
  users: DS.hasMany('user', {async: false})
});
