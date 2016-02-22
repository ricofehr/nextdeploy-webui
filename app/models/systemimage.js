import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  glance_id: DS.attr('string'),
  enabled: DS.attr('boolean'),
  vms: DS.hasMany('vm', {async: false}),
  projects: DS.hasMany('project', {async: false}),
  systemimagetype: DS.belongsTo('systemimagetype', {async: true})
});