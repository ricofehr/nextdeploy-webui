import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  systemimages: DS.hasMany('systemimage', {async: false})
});