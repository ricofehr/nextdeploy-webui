import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  projects: DS.hasMany('project', {async: false}),
  vms: DS.hasMany('vm', {async: false})
});